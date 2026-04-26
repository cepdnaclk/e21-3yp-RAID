#include <Arduino.h>
#include "ultrasonic_sensor.h"

namespace
{
    constexpr int ULTRASONIC_TRIG_PIN = 18;
    constexpr int ULTRASONIC_ECHO_PIN = 19;
    constexpr double SPEED_OF_SOUND_CM_PER_US = 0.0343;
    constexpr double OBSTACLE_THRESHOLD_CM = 50.0;
} // namespace

void initUltrasonicSensor()
{
    pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
    pinMode(ULTRASONIC_ECHO_PIN, INPUT);
    digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
}

UltrasonicData readUltrasonicData()
{
    UltrasonicData data{};

    digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(ULTRASONIC_TRIG_PIN, LOW);

    unsigned long durationUs = pulseIn(ULTRASONIC_ECHO_PIN, HIGH, 30000UL);

    if (durationUs == 0)
    {
        // Timeout usually means out-of-range target; treat as clear path.
        data.distanceCm = 999.0;
        data.obstacleDetected = false;
        return data;
    }

    data.distanceCm = (durationUs * SPEED_OF_SOUND_CM_PER_US) / 2.0;
    data.obstacleDetected = data.distanceCm <= OBSTACLE_THRESHOLD_CM;
    return data;
}
