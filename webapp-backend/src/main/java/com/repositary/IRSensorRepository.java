package com.repositary;

import com.model.irsensorData;

import java.util.List;

/**
 * Data-access contract for IR sensor DynamoDB records.
 */
public interface IRSensorRepository {

    irsensorData save(irsensorData data);

    List<irsensorData> findAll();

    List<irsensorData> findByDeviceId(String deviceId);

}
