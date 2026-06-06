#pragma once
#include <Arduino.h>
#include <Wire.h>
extern TwoWire encoderWire;

#define WHEEL_DIA_MM    100.0
#define TICKS_PER_REV   4096.0
#define AS5600_ADDR     0x36

const float WHEEL_CIRC_M = -(PI * (WHEEL_DIA_MM / 1000.0));

extern long     enc_totalTicks;
extern long     enc_anchorTicks;
extern float    enc_anchorDistM;
extern double   enc_lastBearing;
extern bool     enc_originSet;
extern double   enc_originLat;    // first-ever GPS fix (unchanged after set)
extern double   enc_originLng;
extern double   enc_anchorLat;    // ← NEW: lat of most recent GPS anchor
extern double   enc_anchorLng;    // ← NEW: lng of most recent GPS anchor

void  encoder_init();
void  encoder_update();
float encoder_getDeltaM();        // metres since last GPS anchor
float encoder_getBestDistM();     // kept for heartbeat / debug if desired