#include "gps_module.h"

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
}

void GPSModule::waitForFix(int minSatellites) {
    Serial.println("⏳ Waiting for GPS fix — do not start scanning yet...");
    while (true) {
        update();
        if (gps.location.isValid() && gps.satellites.value() >= minSatellites) {
            Serial.print("✅ GPS fix acquired! Satellites: ");
            Serial.println(gps.satellites.value());
            Serial.print("📍 Initial position: ");
            Serial.print(gps.location.lat(), 6);
            Serial.print(", ");
            Serial.println(gps.location.lng(), 6);
            break;
        }
        Serial.print(".");
        delay(500);
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
    // Lock in the exact coordinates at the moment the brake is applied
    frozenLat   = gps.location.lat();
    frozenLng   = gps.location.lng();
    frozenValid = gps.location.isValid();

    if (!frozenValid) {
        Serial.println("⚠️  GPS freeze attempted but NO FIX — coordinates stored as 0.0, 0.0");
    } else {
        Serial.print("📍 Coordinates Frozen: ");
        Serial.print(frozenLat, 6);
        Serial.print(", ");
        Serial.println(frozenLng, 6);
        Serial.print("🛰️  Satellites locked: ");
        Serial.println(gps.satellites.value());
    }
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