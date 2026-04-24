package com.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dto.sensor.UltrasonicSensorDataDTO;
import com.service.UltrasonicSensorService;

@RestController
@RequestMapping("/api/ultrasonic")
@CrossOrigin(originPatterns = "*")
public class UltrasonicSensorController {
	private final UltrasonicSensorService service;

	public UltrasonicSensorController(UltrasonicSensorService service) {
		this.service = service;
	}

	@GetMapping
	public List<UltrasonicSensorDataDTO> getAllSensorData() {
		return service.getAllSensorData();
	}

	@GetMapping("/{deviceId}/{sensorId}")
	public List<UltrasonicSensorDataDTO> getSensorDataByDeviceAndSensor(
			@PathVariable String deviceId,
			@PathVariable String sensorId) {
		return service.getSpecificSensorData(deviceId, sensorId);
	}

	@PostMapping
	public UltrasonicSensorDataDTO saveSensorData(@RequestBody UltrasonicSensorDataDTO data) {
		return service.saveSensorData(data);
	}
}
