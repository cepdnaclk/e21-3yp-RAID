#ifndef ULTRASONIC_SENSOR_H
#define ULTRASONIC_SENSOR_H

struct UltrasonicData
{
    double distanceCm;
    bool obstacleDetected;
};

// Initializes GPIO pins used by the ultrasonic module.
void initUltrasonicSensor();

// Reads sensor distance and returns obstacle detection status.
UltrasonicData readUltrasonicData();

#endif
