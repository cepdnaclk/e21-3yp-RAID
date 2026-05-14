#ifndef GPS_MODULE_H
#define GPS_MODULE_H

#include <Arduino.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

// Define the ESP32 Hardware UART pins for the NEO-6M
#define GPS_RX_PIN 16
#define GPS_TX_PIN 17
#define GPS_BAUD_RATE 9600

class GPSModule {
private:
    TinyGPSPlus gps;
    HardwareSerial gpsSerial;
    
    // Variables to store the "frozen" coordinates
    double frozenLat;
    double frozenLng;
    bool frozenValid;

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
};

#endif