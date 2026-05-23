#ifndef GPS_MODULE_H
#define GPS_MODULE_H

#include <Arduino.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include "../encoder_config/encoder_odometry.h"

// Define the ESP32 Hardware UART pins for the NEO-6M
#define GPS_RX_PIN 16
#define GPS_TX_PIN 17
#define GPS_BAUD_RATE 9600
#define GPS_MIN_SATS 4

class GPSModule
{
private:
    TinyGPSPlus gps;
    HardwareSerial gpsSerial;

    // Variables to store the "frozen" coordinates
    double frozenLat;
    double frozenLng;
    bool frozenValid;

    // ── Dead reckoning helpers ─────────────────────────────────────────── // ← NEW BLOCK
    static float haversine(double la1, double lo1,
                           double la2, double lo2);
    static void projectPosition(double lat1, double lon1,
                                float distM, double bearingDeg,
                                double &newLat, double &newLng);
    void resyncEncoderAnchor(); // call on every valid GPS fix

public:
    // Constructor initializes Hardware UART 2
    GPSModule();

    // Setup function to call inside your main setup()
    void begin();

    // Continuous update function to call inside your main loop()
    void update();

    // Get live coordinates
    double getLiveLat();
    double getLiveLng();
    bool isLiveLocationValid();
    int getSatellites();

    // Call this exact moment the camera detects a crack
    void freezeCoordinates();

    // Retrieve the frozen coordinates for your MQTT JSON payload
    double getFrozenLat();
    double getFrozenLng();
    bool isFrozenValid();

    // ── Dead reckoning / best-estimate position ───────────────────────────
    // ← ADD THESE THREE
    double getBestLatitude(); // GPS if strong, encoder projection otherwise
    double getBestLongitude();
    bool isPositionFromEncoder();
};

#endif