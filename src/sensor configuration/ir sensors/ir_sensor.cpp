#include <Arduino.h>
#include "ir_sensor.h"

#define IR_SENSOR_PIN 16

void initIRSensors() {
    pinMode(IR_SENSOR_PIN, INPUT);
}

int readIRSensor() {
    return digitalRead(IR_SENSOR_PIN);
}