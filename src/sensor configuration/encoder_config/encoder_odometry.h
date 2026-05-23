#pragma once
#include <Arduino.h>
#include <Wire.h>

// ── Wheel & Encoder Config ─────────────────────────────────────────────────
#define WHEEL_DIA_MM    100.0
#define TICKS_PER_REV   4096.0
#define AS5600_ADDR     0x36

// Circumference is negative if wheel spins backward relative to forward motion
// Flip sign if distance counts down when moving forward
const float WHEEL_CIRC_M = -(PI * (WHEEL_DIA_MM / 1000.0));

// ── State (extern so gps_module.cpp and main.cpp can read) ─────────────────
extern long     enc_totalTicks;
extern long     enc_anchorTicks;
extern float    enc_anchorDistM;   // GPS distance from origin at last anchor
extern double   enc_lastBearing;   // degrees, 0 = North, from GPS course
extern bool     enc_originSet;
extern double   enc_originLat;
extern double   enc_originLng;

// ── API ────────────────────────────────────────────────────────────────────
void  encoder_init();
void  encoder_update();            // call every loop() tick
float encoder_getDeltaM();         // meters since last GPS anchor
float encoder_getBestDistM();      // anchor dist + delta