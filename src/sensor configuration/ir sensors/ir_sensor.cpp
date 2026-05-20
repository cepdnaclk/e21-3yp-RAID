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
    const int IR_OUT_PINS[3] = {4, 5, 10}; 

    // CALIBRATED THRESHOLDS 
    const int THRESHOLDS[IR_SENSOR_COUNT] = {303, 292, 0, 0, 295, 318, 380, 361}; 

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

MultiZoneScanResult scanAllZones()
{
    MultiZoneScanResult results{};

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

                if (SENSOR_ACTIVE[sA] && results.zone[z].values[sA] < THRESHOLDS[sA]) crackInPair = true;
                if (SENSOR_ACTIVE[sB] && results.zone[z].values[sB] < THRESHOLDS[sB]) crackInPair = true;

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

                if (SENSOR_ACTIVE[sA] && results.zone[z].values[sA] < THRESHOLDS[sA]) crackInPair = true;
                if (SENSOR_ACTIVE[sB] && results.zone[z].values[sB] < THRESHOLDS[sB]) crackInPair = true;

                if (crackInPair) {
                    results.zone[z].crackDetected = true;
                    break; 
                }
            }
        }
    }

    return results;
}