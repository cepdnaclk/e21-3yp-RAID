#pragma once

#ifndef UNIT_TEST
#include "encoder_odometry.h"
#else
extern long enc_totalTicks;
extern long enc_anchorTicks;
extern float enc_anchorDistM;
extern double enc_lastBearing;
extern bool enc_originSet;
extern double enc_originLat;
extern double enc_originLng;
extern double enc_anchorLat;
extern double enc_anchorLng;

float encoder_getBestDistM();
#endif

struct GpsFix
{
    bool valid;
    double lat;
    double lng;
};

using GpsFixProvider = GpsFix (*)();

static constexpr float GPS_ANCHOR_GATE_M = 10.0f;

extern GpsFixProvider gpsFixProvider;

float haversineM(double lat1, double lng1, double lat2, double lng2);
void maybeUpdateGpsAnchor();