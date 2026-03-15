package com.service;

import com.dto.sensor.IRSensorDataDTO;
import java.util.List;

/**
 * Service contract for persisting and retrieving IR sensor readings.
 */
public interface IRSensorService {

    /**
     * Saves a single IR sensor payload for a device.
     *
     * @param dto sensor data transfer object to persist
     * @return the saved sensor data (typically including generated metadata)
     */
    IRSensorDataDTO saveIRData(IRSensorDataDTO dto);

    /**
     * Fetches every IR sensor record available in storage.
     *
     * @return list of all IR sensor data records
     */
    List<IRSensorDataDTO> getAllIRData();

    /**
     * Fetches IR sensor records associated with one device.
     *
     * @param deviceId unique identifier of the device
     * @return list of IR sensor data records for the given device
     */
    List<IRSensorDataDTO> getIRDataByDevice(String deviceId);

}
