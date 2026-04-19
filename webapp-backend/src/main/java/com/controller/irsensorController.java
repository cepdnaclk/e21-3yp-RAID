package com.controller;

import com.dto.sensor.IRSensorDataDTO;
import com.service.IRSensorService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// 1. The Class Annotations
@RestController
@RequestMapping("/api/cracks")
@CrossOrigin(originPatterns = "*")
public class IRSensorController {

    // 2. The Dependency
    private final IRSensorService service;

    // 3. Dependency Injection
    public IRSensorController(IRSensorService service) {
        this.service = service;
    }

    // 4. The Endpoint Definition
    @GetMapping("/{deviceId}/{sensorId}")
    public List<IRSensorDataDTO> getCracksByDeviceAndSensor(
            @PathVariable String deviceId,

            @PathVariable String sensorId) {

        // Hand the variables off to the Service layer
        return service.getSpecificCracks(deviceId, sensorId);
    }

}

// /api/cracks/{deviceId}/{sensorId} - endpoint
// http://localhost:8080/api/cracks/esp-001/IR_Bottom -URL