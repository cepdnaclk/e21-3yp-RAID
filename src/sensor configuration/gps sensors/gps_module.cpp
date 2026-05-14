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
    frozenLat = gps.location.lat();
    frozenLng = gps.location.lng();
    frozenValid = gps.location.isValid();
    
    Serial.print("📍 Coordinates Frozen: ");
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