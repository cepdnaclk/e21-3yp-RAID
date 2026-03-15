package com.mapper;

import com.dto.sensor.IRSensorDataDTO;
import com.model.irsensorData;

import java.time.Instant;
import java.util.UUID;

/**
 * Mapper between API/MQTT DTOs and DynamoDB entity objects.
 */
public final class IRSensorMapper {

    private IRSensorMapper() {
    }

    public static irsensorData toEntity(IRSensorDataDTO dto) {
        irsensorData entity = new irsensorData();

        // Create a unique partition key for each sensor reading.
        entity.setId(UUID.randomUUID().toString());
        entity.setDeviceId(dto.getDeviceId());
        entity.setIrValue(dto.getIrValue());
        entity.setTimestamp(resolveTimestamp(dto.getTimestamp()));

        return entity;
    }

    public static IRSensorDataDTO toDto(irsensorData entity) {
        IRSensorDataDTO dto = new IRSensorDataDTO();
        dto.setDeviceId(entity.getDeviceId());
        dto.setIrValue(entity.getIrValue());
        dto.setTimestamp(entity.getTimestamp());
        return dto;
    }

    private static String resolveTimestamp(String incomingTimestamp) {
        if (incomingTimestamp == null || incomingTimestamp.isBlank()) {
            return Instant.now().toString();
        }
        return incomingTimestamp;
    }
}
