#ifndef GPS_SENSOR_H
#define GPS_SENSOR_H

struct GPSData
{
    bool valid;
    double latitude;
    double longitude;
    int satellites;
};

// Initializes the GPS UART and parser.
void initGPSSensor();

// Consumes bytes from GPS serial and updates parser state.
void updateGPSStream();

// Returns latest known GPS fix details.
GPSData readGPSData();

#endif
