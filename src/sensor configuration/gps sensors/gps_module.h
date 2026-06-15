// gps_module.h  (replace existing file)
#ifndef GPS_MODULE_H
#define GPS_MODULE_H

#include <Arduino.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

#define GPS_RX_PIN    1
#define GPS_TX_PIN    2
#define GPS_BAUD_RATE 9600

class GPSModule {
private:
    TinyGPSPlus    gps;
    HardwareSerial gpsSerial;

public:
    GPSModule();          // uses HardwareSerial(2)

    void begin();
    void update();        // call every loop() iteration

    // Live data — read these at the exact moment of crack detection
    double getLiveLat();
    double getLiveLng();
    bool   isLiveLocationValid();
    int    getSatellites();

    // Blocks until a valid fix arrives or timeout_ms elapses.
    // Returns true if a valid fix was obtained.
    bool waitForFixWithTimeout(unsigned long timeout_ms = 60000);
};

#endif