package com.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;

@DynamoDBTable(tableName = "ir_cracks_detection")
public class EspCamDetection {

    @DynamoDBHashKey(attributeName = "SensorID")
    private String sensorId; // This matches your friend's Partition Key

    @DynamoDBRangeKey(attributeName = "timestamp")
    private String timestamp; // This matches your friend's Sort Key

    @DynamoDBAttribute
    private String imageUrl;

    @DynamoDBAttribute
    private String status;

    // Default Constructor
    public EspCamDetection() {}

    // Getters and Setters
    public String getSensorId() { return sensorId; }
    public void setSensorId(String sensorId) { this.sensorId = sensorId; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}