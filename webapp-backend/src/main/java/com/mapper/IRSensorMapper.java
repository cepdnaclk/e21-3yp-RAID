package com.mapper;

import org.springframework.stereotype.Component;

import com.dto.sensor.IRSensorDataDTO;
import com.dto.sensor.LocationDTO;
import com.model.IRSensorData;

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
                entity.getStatus(),
                new LocationDTO(entity.getLatitude(), entity.getLongitude()));
    }

    public IRSensorData toEntity(IRSensorDataDTO dto) {
        if (dto == null) {
            return null;
        }

        IRSensorData entity = new IRSensorData();
        entity.setSensorId(dto.getSensorId());
        entity.setTimestamp(dto.getTimestamp());
        entity.setDeviceId(dto.getDeviceId());
        entity.setCrackDetected(dto.isCrackDetected());
        entity.setStatus(dto.getStatus());

        if (dto.getLocation() != null) {
            entity.setLatitude(dto.getLocation().getLat());
            entity.setLongitude(dto.getLocation().getLng());
        }

        return entity;
    }
}