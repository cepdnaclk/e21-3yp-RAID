package com.dto.sensor;

import lombok.Data;

/**
 * Transport object used both by REST endpoints and MQTT payload parsing.
 */
@Data
public class IRSensorDataDTO {
    private String deviceId;
    private int irValue;
    private String timestamp;

}
