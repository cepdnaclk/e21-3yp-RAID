#include "encoder_odometry.h"
TwoWire encoderWire = TwoWire(1);

long   enc_totalTicks   = 0;
long   enc_anchorTicks  = 0;
float  enc_anchorDistM  = 0.0f;
double enc_lastBearing  = 0.0;
bool   enc_originSet    = false;
double enc_originLat    = 0.0;
double enc_originLng    = 0.0;
double enc_anchorLat    = 0.0;    // ← NEW
double enc_anchorLng    = 0.0;    // ← NEW

static uint16_t prevAngle = 0;

static uint16_t readAngle()
{
    encoderWire.beginTransmission(AS5600_ADDR);
    encoderWire.write(0x0C);
    encoderWire.endTransmission(false);
    encoderWire.requestFrom(AS5600_ADDR, 2);
    return ((encoderWire.read() << 8) | encoderWire.read()) & 0x0FFF;
}

void encoder_init()
{
    encoderWire.begin(21, 47, 400000);
    prevAngle = readAngle();
    Serial.println("⚙️  AS5600 Encoder initialized on GPIO21(SDA) GPIO47(SCL)");
}

void encoder_update()
{
    uint16_t angle = readAngle();
    int16_t delta  = (int16_t)(angle - prevAngle);
    if (delta >  2048) delta -= 4096;
    if (delta < -2048) delta += 4096;
    enc_totalTicks += delta;
    prevAngle = angle;
}

float encoder_getDeltaM()
{
    return ((enc_totalTicks - enc_anchorTicks) / TICKS_PER_REV) * WHEEL_CIRC_M;
}

float encoder_getBestDistM()
{
    return enc_anchorDistM + encoder_getDeltaM();
}