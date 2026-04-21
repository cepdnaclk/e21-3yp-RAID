package com.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.dto.sensor.IRSensorDataDTO;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;

@Service
public class CrackLocationQueryService {

    private final DynamoDbClient dynamoDbClient;

    @Value("${raid.dynamodb.table-name}")
    private String tableName;

    public CrackLocationQueryService(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }

    public List<IRSensorDataDTO> findAllCrackLocations() {
        ScanRequest request = ScanRequest.builder()
                .tableName(tableName)
                .build();

        ScanResponse response = dynamoDbClient.scan(request);
        return toDtos(response.items());
    }

    public List<IRSensorDataDTO> findRecentCrackLocations(int hours) {
        Instant cutoff = Instant.now().minus(hours, ChronoUnit.HOURS);

        ScanRequest request = ScanRequest.builder()
                .tableName(tableName)
                .filterExpression("attribute_exists(timestamp)")
                .build();

        ScanResponse response = dynamoDbClient.scan(request);

        List<IRSensorDataDTO> recent = new ArrayList<>();
        for (Map<String, AttributeValue> item : response.items()) {
            String ts = stringValue(item, "timestamp");
            if (ts.isEmpty()) {
                continue;
            }
            try {
                Instant itemTs = Instant.parse(ts);
                if (!itemTs.isBefore(cutoff)) {
                    recent.add(toDto(item));
                }
            } catch (Exception ignored) {
                // Skip invalid timestamp values while keeping query read-only.
            }
        }

        return recent;
    }

    private List<IRSensorDataDTO> toDtos(List<Map<String, AttributeValue>> items) {
        List<IRSensorDataDTO> results = new ArrayList<>();
        for (Map<String, AttributeValue> item : items) {
            results.add(toDto(item));
        }
        return results;
    }

    private IRSensorDataDTO toDto(Map<String, AttributeValue> item) {
        CrackLocationRecord dto = new CrackLocationRecord();

        // Attribute names exactly match IRSensorDataDTO field names.
        dto.setSensorId(stringValue(item, "sensorId"));
        dto.setTimestamp(stringValue(item, "timestamp"));
        dto.setDeviceId(stringValue(item, "deviceId"));
        dto.setCrackDetected(booleanValue(item, "crackDetected"));
        dto.setStatus(stringValue(item, "status"));

        dto.setLat(numberValue(item, "lat", numberValue(item, "latitude", 0.0d)));
        dto.setLng(numberValue(item, "lng", numberValue(item, "longitude", 0.0d)));
        dto.setSeverity(numberValue(item, "severity", 0.0d));

        return dto;
    }

    private String stringValue(Map<String, AttributeValue> item, String key) {
        AttributeValue value = item.get(key);
        if (value == null || value.s() == null) {
            return "";
        }
        return value.s();
    }

    private boolean booleanValue(Map<String, AttributeValue> item, String key) {
        AttributeValue value = item.get(key);
        if (value == null || value.bool() == null) {
            return false;
        }
        return value.bool();
    }

    private double numberValue(Map<String, AttributeValue> item, String key, double defaultValue) {
        AttributeValue value = item.get(key);
        if (value == null || value.n() == null) {
            return defaultValue;
        }
        try {
            return Double.parseDouble(value.n());
        } catch (NumberFormatException ex) {
            return defaultValue;
        }
    }

    // Returned as IRSensorDataDTO from controller signature, with GPS/severity extras.
    @SuppressWarnings("unused")
    private static class CrackLocationRecord extends IRSensorDataDTO {
        private double lat;
        private double lng;
        private double severity;

        public double getLat() {
            return lat;
        }

        public void setLat(double lat) {
            this.lat = lat;
        }

        public double getLng() {
            return lng;
        }

        public void setLng(double lng) {
            this.lng = lng;
        }

        public double getSeverity() {
            return severity;
        }

        public void setSeverity(double severity) {
            this.severity = severity;
        }
    }
}
