#include "encoder_odometry.h"

// ── State definitions ──────────────────────────────────────────────────────
long     enc_totalTicks    = 0;
long     enc_anchorTicks   = 0;
float    enc_anchorDistM   = 0.0f;
double   enc_lastBearing   = 0.0;
bool     enc_originSet     = false;
double   enc_originLat     = 0.0;
double   enc_originLng     = 0.0;

static uint16_t prevAngle  = 0;

// ── AS5600 raw angle read ──────────────────────────────────────────────────
static uint16_t readAngle() {
    Wire.beginTransmission(AS5600_ADDR);
    Wire.write(0x0C);
    Wire.endTransmission(false);
    Wire.requestFrom(AS5600_ADDR, 2);
    return ((Wire.read() << 8) | Wire.read()) & 0x0FFF;
}

void encoder_init() {
    // Wire.begin() is already called in main setup with pins 21,22
    prevAngle = readAngle();
}

void encoder_update() {
    uint16_t angle = readAngle();
    int16_t  delta = (int16_t)(angle - prevAngle);
    // Handle 12-bit rollover
    if (delta >  2048) delta -= 4096;
    if (delta < -2048) delta += 4096;
    enc_totalTicks += delta;
    prevAngle = angle;
}

float encoder_getDeltaM() {
    return ((enc_totalTicks - enc_anchorTicks) / TICKS_PER_REV) * WHEEL_CIRC_M;
}

float encoder_getBestDistM() {
    return enc_anchorDistM + encoder_getDeltaM();
}