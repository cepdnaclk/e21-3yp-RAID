package com.model;

import lombok.Data;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

/**
 * DynamoDB entity for IR sensor rows.
 */
@Data
@DynamoDbBean
public class irsensorData {

    private String id;
    private String deviceId;
    private int irValue;
    private String timestamp;

    @DynamoDbPartitionKey
    @DynamoDbAttribute("id")
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("deviceId")
    public String getDeviceId() {
        return deviceId;
    }

    @DynamoDbAttribute("irValue")
    public int getIrValue() {
        return irValue;
    }

    @DynamoDbAttribute("timestamp")
    public String getTimestamp() {
        return timestamp;
    }

}
