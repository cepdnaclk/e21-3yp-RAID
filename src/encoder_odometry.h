#pragma once
#include <Arduino.h>
#include <Wire.h>

extern TwoWire encoderWire;

// ── Hardware config ───────────────────────────────────────────────────────
#define AS5600_ADDR   0x36
#define WHEEL_DIA_MM  50.0      // ← measure your actual wheel and update this
#define TICKS_PER_REV 4096.0

// Negative because of winding direction — flip sign here if distance reads backwards
const float WHEEL_CIRC_M = -(PI * (WHEEL_DIA_MM / 1000.0));

// ── Odometry state (extern so main.cpp can read them directly) ────────────
extern long   enc_totalTicks;
extern long   enc_anchorTicks;
extern float  enc_anchorDistM;
extern double enc_lastBearing;
extern bool   enc_originSet;
extern double enc_originLat;
extern double enc_originLng;
extern double enc_anchorLat;
extern double enc_anchorLng;

// ── Public functions ──────────────────────────────────────────────────────
void  encoder_init();
void  encoder_update();
float encoder_getDeltaM();      // metres travelled since last GPS anchor
float encoder_getBestDistM();   // total distance from origin