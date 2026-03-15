#include <Arduino.h>
#include "ir_sensor.h"

#define IR_SENSOR_PIN 16

void initIRSensors() {
    // Configure the selected GPIO pin as an input from the IR module.
    pinMode(IR_SENSOR_PIN, INPUT);
}

int readIRSensor() {
    // Read HIGH/LOW value from the sensor and return it to caller logic.
    return digitalRead(IR_SENSOR_PIN);
}