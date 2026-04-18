package com.repositary;

import com.model.IRSensorData;
import java.util.List;

public interface IRSensorRepository {
    // A simple contract: Whoever implements this must provide a way to get all data
    List<IRSensorData> getAllData();

    List<IRSensorData> getCracksByDeviceAndSensor(String deviceId, String sensorId);
}

// Key Purpose:
// ------------
// - It declares WHAT operations can be performed (e.g., getAllData),
// but NOT HOW they are implemented.

// Define what data operations are allowed
// Hide how data is fetched
// Make your code flexible, clean, and testable