#include "gps_module.h"
#include "../encoder_config/encoder_odometry.h"

// Initialize using HardwareSerial 2
GPSModule::GPSModule() : gpsSerial(2) {
    frozenLat = 0.0;
    frozenLng = 0.0;
    frozenValid = false;
}

void GPSModule::begin() {
    // Start the serial connection to the NEO-6M
    gpsSerial.begin(GPS_BAUD_RATE, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
    Serial.println("🛰️ GPS Module Initialized on RX:16, TX:17");
}

void GPSModule::update() {
    // Continuously read data from the GPS module and feed it to TinyGPS++
    while (gpsSerial.available() > 0) {
        gps.encode(gpsSerial.read());
    }

    // ← NEW: re-anchor encoder every time a strong GPS fix arrives
    if (gps.location.isUpdated() &&
        gps.location.isValid()   &&
        gps.satellites.value() >= GPS_MIN_SATS) {
        resyncEncoderAnchor();
    }
}
// ── Dead reckoning helpers ─────────────────────────────────────────────────

// ← NEW
float GPSModule::haversine(double la1, double lo1, double la2, double lo2) {
    const float R = 6371000.0f;
    float dLat = radians(la2 - la1);
    float dLon = radians(lo2 - lo1);
    float a = sin(dLat/2)*sin(dLat/2) +
              cos(radians(la1))*cos(radians(la2))*
              sin(dLon/2)*sin(dLon/2);
    return R * 2.0f * atan2(sqrt(a), sqrt(1.0f - a));
}

// ← NEW
void GPSModule::projectPosition(double lat1, double lon1,
                                 float distM, double bearingDeg,
                                 double &newLat, double &newLng) {
    const double R = 6371000.0;
    double d     = distM / R;
    double brng  = radians(bearingDeg);
    double lat1r = radians(lat1);
    double lon1r = radians(lon1);
    double newLatR = asin(sin(lat1r)*cos(d) + cos(lat1r)*sin(d)*cos(brng));
    double newLngR = lon1r + atan2(sin(brng)*sin(d)*cos(lat1r),
                                   cos(d) - sin(lat1r)*sin(newLatR));
    newLat = degrees(newLatR);
    newLng = degrees(newLngR);
}

// ← NEW
void GPSModule::resyncEncoderAnchor() {
    if (!enc_originSet) {
        enc_originLat   = gps.location.lat();
        enc_originLng   = gps.location.lng();
        enc_originSet   = true;
        enc_anchorTicks = enc_totalTicks;
        Serial.println("[GPS] Origin locked for dead reckoning.");
    }

    // Re-anchor distance + tick baseline to current GPS position
    enc_anchorDistM  = haversine(enc_originLat, enc_originLng,
                                  gps.location.lat(), gps.location.lng());
    enc_anchorTicks  = enc_totalTicks;

    // Update bearing only when moving (course unreliable at standstill)
    if (gps.course.isValid() && gps.speed.kmph() > 0.5) {
        enc_lastBearing = gps.course.deg();
    }
}

// ---------------- LIVE DATA METHODS ----------------

double GPSModule::getLiveLat() {
    return gps.location.lat();
}

double GPSModule::getLiveLng() {
    return gps.location.lng();
}

bool GPSModule::isLiveLocationValid() {
    return gps.location.isValid();
}

int GPSModule::getSatellites() {
    return gps.satellites.value();
}

// ---------------- FROZEN DATA METHODS ----------------
// This is critical for your "Stop-and-Shoot" architecture

void GPSModule::freezeCoordinates() {
    // ← CHANGED: use best-estimate instead of raw GPS
    frozenLat   = getBestLatitude();
    frozenLng   = getBestLongitude();
    frozenValid = enc_originSet || gps.location.isValid();
    
    Serial.print("📍 Coordinates Frozen (");
    Serial.print(isPositionFromEncoder() ? "ENCODER" : "GPS");   // ← NEW: shows source
    Serial.print("): ");
    Serial.print(frozenLat, 6);
    Serial.print(", ");
    Serial.println(frozenLng, 6);
}

double GPSModule::getFrozenLat() {
    return frozenLat;
}

double GPSModule::getFrozenLng() {
    return frozenLng;
}

bool GPSModule::isFrozenValid() {
    return frozenValid;
}

// ---------------- BEST-ESTIMATE POSITION ----------------  // ← NEW SECTION

bool GPSModule::isPositionFromEncoder() {
    return !gps.location.isValid() ||
           (gps.satellites.value() < GPS_MIN_SATS);
}

double GPSModule::getBestLatitude() {
    if (!isPositionFromEncoder()) return gps.location.lat();
    if (!enc_originSet)           return 0.0;
    double estLat, estLng;
    projectPosition(enc_originLat, enc_originLng,
                    encoder_getBestDistM(), enc_lastBearing,
                    estLat, estLng);
    return estLat;
}

double GPSModule::getBestLongitude() {
    if (!isPositionFromEncoder()) return gps.location.lng();
    if (!enc_originSet)           return 0.0;
    double estLat, estLng;
    projectPosition(enc_originLat, enc_originLng,
                    encoder_getBestDistM(), enc_lastBearing,
                    estLat, estLng);
    return estLng;
}