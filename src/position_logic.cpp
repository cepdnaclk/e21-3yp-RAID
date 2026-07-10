#include "position_logic.h"

#include <cmath>

static inline double radiansFromDegrees(double degrees)
{
    return degrees * 3.14159265358979323846 / 180.0;
}

#ifndef UNIT_TEST
#include "encoder_odometry.h"
#include "sensor configuration/gps sensors/gps_module.h"
extern GPSModule gps;
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

GpsFixProvider gpsFixProvider = nullptr;

#ifndef UNIT_TEST
static GpsFix readCurrentGpsFix()
{
    return GpsFix{gps.isLiveLocationValid(), gps.getLiveLat(), gps.getLiveLng()};
}
#endif

float haversineM(double lat1, double lng1, double lat2, double lng2)
{
    const float R = 6371000.0f;
    float dLat = radiansFromDegrees(lat2 - lat1);
    float dLng = radiansFromDegrees(lng2 - lng1);
    float a = sin(dLat / 2) * sin(dLat / 2) + cos(radiansFromDegrees(lat1)) * cos(radiansFromDegrees(lat2)) * sin(dLng / 2) * sin(dLng / 2);
    return R * 2.0f * atan2(sqrt(a), sqrt(1 - a));
}

void maybeUpdateGpsAnchor()
{
#ifndef UNIT_TEST
    const GpsFix fix = gpsFixProvider ? gpsFixProvider() : readCurrentGpsFix();
#else
    const GpsFix fix = gpsFixProvider ? gpsFixProvider() : GpsFix{false, 0.0, 0.0};
#endif

    if (!fix.valid)
        return;

    double lat = fix.lat;
    double lng = fix.lng;

    if (!enc_originSet)
    {
        enc_originLat = lat;
        enc_originLng = lng;
        enc_anchorLat = lat;
        enc_anchorLng = lng;
        enc_anchorTicks = enc_totalTicks;
        enc_anchorDistM = 0.0f;
        enc_originSet = true;
#ifndef UNIT_TEST
        Serial.printf("📍 GPS origin set: %.6f, %.6f\n", lat, lng);
#endif
        return;
    }

    float dist = haversineM(enc_anchorLat, enc_anchorLng, lat, lng);
    if (dist >= GPS_ANCHOR_GATE_M)
    {
        enc_anchorLat = lat;
        enc_anchorLng = lng;
        enc_anchorTicks = enc_totalTicks;
        enc_anchorDistM = encoder_getBestDistM();
#ifndef UNIT_TEST
        Serial.printf("📍 Anchor updated: %.6f, %.6f (moved %.1fm)\n", lat, lng, dist);
#endif
    }
}