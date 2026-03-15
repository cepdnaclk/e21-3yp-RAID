package com.controller;

import com.dto.sensor.IRSensorDataDTO;
import com.service.IRSensorService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ir-sensors")
public class irsensorController {

    private final IRSensorService irSensorService;

    public irsensorController(IRSensorService irSensorService) {
        this.irSensorService = irSensorService;
    }

    // 1. Receive IR sensor data from ESP32
    @PostMapping("/data")
    public IRSensorDataDTO saveIRSensorData(@RequestBody IRSensorDataDTO dto) {
        return irSensorService.saveIRData(dto);
    }

    // 2. Get all IR sensor readings
    @GetMapping("/all")
    public List<IRSensorDataDTO> getAllIRData() {
        return irSensorService.getAllIRData();
    }

    // 3. Get IR readings for a specific device
    @GetMapping("/device/{deviceId}")
    public List<IRSensorDataDTO> getIRDataByDevice(@PathVariable String deviceId) {
        return irSensorService.getIRDataByDevice(deviceId);
    }

}
