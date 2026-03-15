#ifndef IR_SENSOR_H
#define IR_SENSOR_H

// Initializes all configured IR input pins.
void initIRSensors();

// Returns the latest digital reading from the configured IR sensor pin.
int readIRSensor();

#endif