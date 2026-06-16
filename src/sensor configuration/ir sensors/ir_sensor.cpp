#include <Arduino.h>
#include "ir_sensor.h"

namespace
{
    // ==========================================
    // 3-ZONE HARDWARE CONFIGURATION
    // ==========================================
    const int MUX_A = 10;
    const int MUX_B = 11;
    const int MUX_C = 12;

    // LEFT = 0, CENTER = 1, RIGHT = 2
    const int IR_OUT_PINS[3] = {4, 5, 6}; 
    // Define 3 hardware trigger pins to command the cameras
    const int CAM_TRIGGER_PINS[3] = {15, 16, 17}; // Left, Center, Right

    // 2D Arrays: [0]=Left, [1]=Center, [2]=Right
    // -------------------------------------------------------------
    // Anchor 1: MILD PROFILE 
    const float T_mild[3] = {31.6, 31.4, 31.6}; // Measured temperatures
    const float Th_mild[3][IR_SENSOR_COUNT] = {
        {370, 551, 565, 647, 0, 0, 0, 0},   // LEFT Array
        {0, 0, 0, 376, 158, 175, 255, 221}, // CENTER Array
        {370, 551, 565, 647, 0, 0, 0, 0}    // RIGHT Array (Mirrors Left)
    };

    // Anchor 2: HOT PROFILE 
    // Note: Left/Right hot arrays are extrapolated 4.0x until real hot data is provided
    const float T_hot[3] = {33.0, 33.0, 33.0}; // Measured temperatures
    const float Th_hot[3][IR_SENSOR_COUNT] = {
        {1480, 2204, 2260, 2588, 0, 0, 0, 0}, // LEFT Array (Extrapolated)
        {0, 0, 0, 883, 632, 779, 1106, 1144}, // CENTER Array
        {1480, 2204, 2260, 2588, 0, 0, 0, 0}  // RIGHT Array (Extrapolated)
    };
    // ------------------------------------------------------------- 

    // MASKING: Set to false if a sensor is physically dead
    const bool SENSOR_ACTIVE[IR_SENSOR_COUNT] = {true, true, false, false, true, true, true, true};

    void selectOutput(int channel)
    {
        digitalWrite(MUX_A, channel & 0x01);
        digitalWrite(MUX_B, (channel >> 1) & 0x01);
        digitalWrite(MUX_C, (channel >> 2) & 0x01);
        
        // Increased delay to allow CD4051 Multiplexers to physically switch
        delayMicroseconds(150); 
    }
}

void initIRSensors()
{
    pinMode(MUX_A, OUTPUT);
    pinMode(MUX_B, OUTPUT);
    pinMode(MUX_C, OUTPUT);
    
    // Initialize all 3 analog input pins
    for(int z = 0; z < 3; z++) {
        pinMode(IR_OUT_PINS[z], INPUT);
    }
    
    // Configure ADC for maximum range (0V - 3.1V)
    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);
}

MultiZoneScanResult scanAllZones(float currentTemp)
{
    MultiZoneScanResult results{};

    // Dynamically calculate the 2D thresholds for the exact current temperature
    float THRESHOLDS[3][IR_SENSOR_COUNT];
    for (int z = 0; z < 3; z++) {
        float effectiveTemp = currentTemp;
        if (effectiveTemp < T_mild[z]) effectiveTemp = T_mild[z];
        if (effectiveTemp > T_hot[z])  effectiveTemp = T_hot[z];

        for (int i = 0; i < IR_SENSOR_COUNT; i++) {
            // Point-Slope Linear Interpolation Formula
            THRESHOLDS[z][i] = Th_mild[z][i] + ((Th_hot[z][i] - Th_mild[z][i]) / (T_hot[z] - T_mild[z])) * (effectiveTemp - T_mild[z]);
        }
    }

    // Initialize baselines for all 3 zones
    for(int z = 0; z < 3; z++) {
        results.zone[z].crackDetected = false;
        results.zone[z].minValue = 4095;
    }

    // --- STEP 1: SCAN ALL SENSORS ACROSS ALL 3 ARRAYS ---
    for (int i = 0; i < IR_SENSOR_COUNT; ++i)
    {
        selectOutput(i);
        
        // Read Left, Center, and Right arrays simultaneously for this channel
        for(int z = 0; z < 3; z++) {
            // DISCARD READ: Clear the ESP32's internal ADC capacitor
            analogRead(IR_OUT_PINS[z]);
            delayMicroseconds(50);
            
            // Take 3 quick readings and average them to kill electrical noise
            int total = 0;
            for(int j = 0; j < 3; j++) {
                total += analogRead(IR_OUT_PINS[z]);
            }
            results.zone[z].values[i] = total / 3;

            // Track the lowest value for reporting
            bool isActiveForZone = SENSOR_ACTIVE[i];
            if ((z == 0 || z == 2) && i >= 4) {
                isActiveForZone = false; 
            }

            if (isActiveForZone && results.zone[z].values[i] < results.zone[z].minValue)
            {
                results.zone[z].minValue = results.zone[z].values[i];
                results.zone[z].minValueIndex = i;
            }
        }
    }

    // --- STEP 2: ZONE-SPECIFIC PAIR-BASED CRACK DETECTION ---
    for(int z = 0; z < 3; z++) {
        
        // CENTER ZONE (z = 1): 8 Sensors. Pairs: 0&4, 1&5, 2&6, 3&7
        if (z == 1) {
            for (int i = 0; i < 4; i++) {
                int sA = i;
                int sB = i + 4;
                bool crackInPair = false;

                if (SENSOR_ACTIVE[sA] && results.zone[z].values[sA] < THRESHOLDS[z][sA]) crackInPair = true;
                if (SENSOR_ACTIVE[sB] && results.zone[z].values[sB] < THRESHOLDS[z][sB]) crackInPair = true;

                if (crackInPair) {
                    results.zone[z].crackDetected = true;
                    break; 
                }
            }
        }
        // LEFT (z = 0) & RIGHT (z = 2) ZONES: 4 Sensors. Pairs: 0&2, 1&3
        else {
            for (int i = 0; i < 2; i++) {
                int sA = i;
                int sB = i + 2;
                bool crackInPair = false;

                if (SENSOR_ACTIVE[sA] && results.zone[z].values[sA] < THRESHOLDS[z][sA]) crackInPair = true;
                if (SENSOR_ACTIVE[sB] && results.zone[z].values[sB] < THRESHOLDS[z][sB]) crackInPair = true;

                if (crackInPair) {
                    results.zone[z].crackDetected = true;
                    break; 
                }
            }
        }
    }

    return results;
}