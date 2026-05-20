package com.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.sensor.IRSensorDataDTO;
import com.service.IRSensorService;

// 1. The Class Annotations
@RestController
@RequestMapping("/api/cracks")
@CrossOrigin(originPatterns = "*")
public class irsensorController {

    // 2. The Dependency
    private final IRSensorService service;

    // 3. Dependency Injection
    public irsensorController(IRSensorService service) {
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

    @GetMapping("/{crackId}")
    public org.springframework.http.ResponseEntity<IRSensorDataDTO> getCrackById(@PathVariable String crackId) {
        IRSensorDataDTO data = service.getCrackById(crackId);
        if (data == null) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        return org.springframework.http.ResponseEntity.ok(data);
    }

}

// /api/cracks/{deviceId}/{sensorId} - endpoint
// http://localhost:8080/api/cracks/esp-001/IR_Bottom -URL