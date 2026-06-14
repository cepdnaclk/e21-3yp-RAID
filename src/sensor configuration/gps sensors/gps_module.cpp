#include "gps_module.h"

// Initialize using HardwareSerial 2
GPSModule::GPSModule() : gpsSerial(2) {}

void GPSModule::begin() {
    gpsSerial.begin(GPS_BAUD_RATE, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
    Serial.println("🛰️ GPS initialized on RX:" + String(GPS_RX_PIN)
                   + " TX:" + String(GPS_TX_PIN));
}

void GPSModule::update() {
    while (gpsSerial.available() > 0)
        gps.encode(gpsSerial.read());
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

bool GPSModule::waitForFixWithTimeout(unsigned long timeout_ms) {
    unsigned long start = millis();
    Serial.print("🛰️ Waiting for GPS fix");
    while (millis() - start < timeout_ms) {
        update();
        if (gps.location.isValid()) {
            Serial.printf("\n✅ GPS fix: %.6f, %.6f (%d sats)\n",
                          getLiveLat(), getLiveLng(), getSatellites());
            return true;
        }
        delay(500);
        Serial.print(".");
    }
    Serial.println("\n⚠️ GPS fix timed out.");
    return false;
}