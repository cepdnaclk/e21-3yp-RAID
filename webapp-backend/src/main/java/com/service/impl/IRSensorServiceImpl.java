package com.service.impl;

import com.dto.sensor.IRSensorDataDTO;
import com.mapper.IRSensorMapper;
import com.model.irsensorData;
import com.repositary.IRSensorRepository;
import com.service.IRSensorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IRSensorServiceImpl implements IRSensorService {

    private final IRSensorRepository repository;

    public IRSensorServiceImpl(IRSensorRepository repository) {
        this.repository = repository;
    }

    @Override
    public IRSensorDataDTO saveIRData(IRSensorDataDTO dto) {
        irsensorData saved = repository.save(IRSensorMapper.toEntity(dto));
        return IRSensorMapper.toDto(saved);
    }

    @Override
    public List<IRSensorDataDTO> getAllIRData() {
        return repository.findAll()
                .stream()
                .map(IRSensorMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<IRSensorDataDTO> getIRDataByDevice(String deviceId) {
        return repository.findByDeviceId(deviceId)
                .stream()
                .map(IRSensorMapper::toDto)
                .collect(Collectors.toList());
    }
}
