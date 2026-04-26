#include <Arduino.h>
#include "ir_sensor.h"

namespace
{
    struct IRPinConfig
    {
        int muxPinA;
        int muxPinB;
        int muxPinC;
        int ledInPin;
        int irOutPin;
        const char *profileName;
    };

    // Legacy absolute threshold kept as a fallback when baseline is not ready.
    constexpr int LEGACY_CRACK_THRESHOLD = 1200;
    constexpr int ADC_LOW_READING = 5;
    constexpr int VERY_LOW_READING = 120;
    constexpr int MAX_LOW_READINGS_PER_FRAME = 6;
    constexpr int MAX_VERY_LOW_READINGS_PER_FRAME = 6;
    constexpr int CALIBRATION_SAMPLES = 20;
    constexpr int SCAN_SAMPLES = 4;
    constexpr int DYNAMIC_DROP_RATIO_PERCENT = 45;
    constexpr int MIN_DROP_COUNTS = 120;

    // Keep this map aligned with the physical sensor health table.
    // Index: 0,1,2,3,4,5,6,7
    const bool SENSOR_ACTIVE[IR_SENSOR_COUNT] = {true, false, true, true, true, true, true, true};
    int sensorBaseline[IR_SENSOR_COUNT] = {0};
    bool baselineReady = false;

#if defined(CONFIG_IDF_TARGET_ESP32S3)
    constexpr IRPinConfig PIN_CONFIG = {4, 3, 2, 6, 1, "ESP32-S3"};
#else
    constexpr IRPinConfig PIN_CONFIG = {25, 26, 27, 14, 34, "ESP32-Classic"};
#endif

    void selectOutput(int channel)
    {
        digitalWrite(PIN_CONFIG.muxPinA, channel & 0x01);
        digitalWrite(PIN_CONFIG.muxPinB, (channel >> 1) & 0x01);
        digitalWrite(PIN_CONFIG.muxPinC, (channel >> 2) & 0x01);
        delayMicroseconds(60); // Slightly increased for ESP32-S3 speed
    }

    int readAveragedChannel(int channel, int samples)
    {
        selectOutput(channel);
        delayMicroseconds(120);
        // Discard first conversion after channel switch to reduce mux settling noise.
        (void)analogRead(PIN_CONFIG.irOutPin);

        long total = 0;
        for (int i = 0; i < samples; ++i)
        {
            total += analogRead(PIN_CONFIG.irOutPin);
            delayMicroseconds(40);
        }

        return static_cast<int>(total / samples);
    }

    int computeDynamicThreshold(int sensorIndex)
    {
        if (!SENSOR_ACTIVE[sensorIndex])
        {
            return 0;
        }
if (!baselineReady && sensorBaseline[sensorIndex] <= 0)
        {
            return LEGACY_CRACK_THRESHOLD;
        }

        const int baseline = sensorBaseline[sensorIndex];
        // Very low baseline channels are usually disconnected or saturated; ignore them.
        if (baseline <= MIN_DROP_COUNTS)
        {
            return 0;
        }

        const int ratioDrop = (baseline * DYNAMIC_DROP_RATIO_PERCENT) / 100;
        const int requiredDrop = ratioDrop > MIN_DROP_COUNTS ? ratioDrop : MIN_DROP_COUNTS;
        int threshold = baseline - requiredDrop;

        if (threshold < 0)
        {
            threshold = 0;
        }

        return threshold;
    }

    void captureBaseline()
    {
        for (int i = 0; i < IR_SENSOR_COUNT; ++i)
        {
            if (!SENSOR_ACTIVE[i])
            {
                sensorBaseline[i] = 0;
                continue;
            }

            long total = 0;
            for (int sample = 0; sample < CALIBRATION_SAMPLES; ++sample)
            {
                total += readAveragedChannel(i, 1);
                delay(2);
            }
            sensorBaseline[i] = static_cast<int>(total / CALIBRATION_SAMPLES);
        }

        baselineReady = true;
    }
}

void initIRSensors()
{
    pinMode(PIN_CONFIG.muxPinA, OUTPUT);
    pinMode(PIN_CONFIG.muxPinB, OUTPUT);
    pinMode(PIN_CONFIG.muxPinC, OUTPUT);
    pinMode(PIN_CONFIG.ledInPin, OUTPUT);
    pinMode(PIN_CONFIG.irOutPin, INPUT);
    
    // Configure ADC for maximum range (0V - 3.1V)
    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);

    digitalWrite(PIN_CONFIG.ledInPin, HIGH);
    delay(50);

    captureBaseline();
}

IRScanResult scanIRArray()
{
    IRScanResult result{};
    result.crackDetected = false;
    result.minValue = 4095;
    int lowReadingCount = 0;
    int veryLowReadingCount = 0;
 for (int i = 0; i < IR_SENSOR_COUNT; ++i)
    {
        result.values[i] = readAveragedChannel(i, SCAN_SAMPLES);

        if (result.values[i] <= ADC_LOW_READING)
        {
            ++lowReadingCount;
        }

        if (result.values[i] <= VERY_LOW_READING)
        {
            ++veryLowReadingCount;
        }

        if (SENSOR_ACTIVE[i] && result.values[i] < result.minValue)
        {
            result.minValue = result.values[i];
        }
    }

    // If almost all channels are near 0 simultaneously, treat as invalid frame
    // (temporary wiring/power/ADC glitch) instead of a real crack.
    if (lowReadingCount >= MAX_LOW_READINGS_PER_FRAME &&
        veryLowReadingCount >= MAX_VERY_LOW_READINGS_PER_FRAME)
    {
        return result;
    }

    // Pair-based crack logic with per-sensor dynamic thresholds.
    // If both channels in a pair are active, require both to agree to avoid
    // single-channel noise creating false crack events.
    for (int i = 0; i < 4; i++) {
        int sA = i;
        int sB = i + 4;

        int thresholdA = computeDynamicThreshold(sA);
        int thresholdB = computeDynamicThreshold(sB);

        bool sensorAUsable = SENSOR_ACTIVE[sA] && thresholdA > 0;
        bool sensorBUsable = SENSOR_ACTIVE[sB] && thresholdB > 0;
        
        bool crackA = sensorAUsable && (result.values[sA] < thresholdA);
        bool crackB = sensorBUsable && (result.values[sB] < thresholdB);
        bool crackInPair = false;

        if (sensorAUsable && sensorBUsable)
        {
            crackInPair = crackA && crackB;
        }
        else
        {
            crackInPair = crackA || crackB;
        }
        
        if (crackInPair) {
            result.crackDetected = true;
            break;
        }
    }

    // Update baseline slowly only when surface is classified as normal.
    if (!result.crackDetected)
    {
        for (int i = 0; i < IR_SENSOR_COUNT; ++i)
        {
            if (!SENSOR_ACTIVE[i])
            {
                continue;
            }
            sensorBaseline[i] = ((sensorBaseline[i] * 15) + result.values[i]) / 16;
        }
    }

    return result;
}