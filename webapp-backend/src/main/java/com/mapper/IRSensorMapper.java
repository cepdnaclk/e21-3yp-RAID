package com.mapper;

import com.dto.sensor.IRSensorDataDTO;
import com.model.IRSensorData;
import org.springframework.stereotype.Component;

// 1. The Annotation
@Component
public class IRSensorMapper {

    // 2. The Method Signature
    public IRSensorDataDTO toDTO(IRSensorData entity) {

        // 3. The Safety Net
        if (entity == null) {
            return null;
        }

        // 4. The Data Extraction and Translation
        return new IRSensorDataDTO(
                entity.getSensorId(),
                entity.getTimestamp(),
                entity.getDeviceId(),
                entity.isCrackDetected(),
                entity.getStatus());
    }
}