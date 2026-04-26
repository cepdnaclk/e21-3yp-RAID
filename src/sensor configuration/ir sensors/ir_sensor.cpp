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

    // ==========================================
    // CALIBRATION: Scaled for ESP32 (0 - 4095)
    // Arduino threshold of 300 is roughly 1200 here.
    // ==========================================
    constexpr int CRACK_THRESHOLD = 1200; 

    // MASKING: Set to false if a sensor is physically dead
    // Note: Set to false at index 1 based on your last ESP code, 
    // change to index 2 if Sensor 2 is the dead one!
    const bool SENSOR_ACTIVE[IR_SENSOR_COUNT] = {true, false, true, true, true, true, true, true};

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
        delayMicroseconds(50); 
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

    // Keep IR emitter enabled constantly (Arduino Simple Mode)
    digitalWrite(PIN_CONFIG.ledInPin, HIGH);
    delay(50);
}

IRScanResult scanIRArray()
{
    IRScanResult result{};
    result.crackDetected = false;
    result.minValue = 4095;

    // --- STEP 1: SCAN ALL SENSORS ---
    for (int i = 0; i < IR_SENSOR_COUNT; ++i)
    {
        selectOutput(i);
        
        // Take 3 quick readings and average them to kill electrical noise
        int total = 0;
        for(int j = 0; j < 3; j++) {
            total += analogRead(PIN_CONFIG.irOutPin);
        }
        result.values[i] = total / 3;

        // Track the lowest value for AWS reporting
        if (SENSOR_ACTIVE[i] && result.values[i] < result.minValue)
        {
            result.minValue = result.values[i];
        }
    }

    // --- STEP 2: ARDUINO "OR" LOGIC BY PAIRS ---
    for (int i = 0; i < 4; i++) {
        int sA = i;
        int sB = i + 4;

        bool crackInPair = false;

        // If Sensor A is active AND drops below threshold
        if (SENSOR_ACTIVE[sA] && result.values[sA] < CRACK_THRESHOLD) {
            crackInPair = true;
        }
        
        // If Sensor B is active AND drops below threshold
        if (SENSOR_ACTIVE[sB] && result.values[sB] < CRACK_THRESHOLD) {
            crackInPair = true;
        }

        // If ANY sensor in the pair saw a crack, trigger the global alert
        if (crackInPair) {
            result.crackDetected = true;
            break; 
        }
    }

    return result;
}