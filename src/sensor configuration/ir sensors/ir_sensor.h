#ifndef IR_SENSOR_H
#define IR_SENSOR_H

constexpr int IR_SENSOR_COUNT = 8;

struct IRScanResult
{
  bool crackDetected;
  int minValue;
  int minValueIndex; // Add this line
  int values[IR_SENSOR_COUNT];
};

//A wrapper to hold all 3 zones (Left = 0, Center = 1, Right = 2)
struct MultiZoneScanResult {
    IRScanResult zone[3]; 
};

// Initializes the MUX control pins and IR emitter drive pin.
void initIRSensors();

// Scans all 8 sensors and applies pair-based crack detection.
MultiZoneScanResult scanAllZones();

#endif