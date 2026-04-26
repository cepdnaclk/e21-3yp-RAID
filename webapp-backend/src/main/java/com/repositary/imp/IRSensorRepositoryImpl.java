package com.repositary.imp;

import com.repositary.IRSensorRepository;
import com.model.IRSensorData;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryEnhancedRequest;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.enhanced.dynamodb.Expression;
import java.util.List;
import java.util.stream.Collectors;

// @Repository tells Spring Boot this class is responsible for database operations
@Repository
public class IRSensorRepositoryImpl implements IRSensorRepository {

    private final DynamoDbTable<IRSensorData> table;

    // Spring Boot automatically passes the DynamoDB client you configured earlier
    // into this constructor
    public IRSensorRepositoryImpl(DynamoDbEnhancedClient enhancedClient) {
        // We tell the client exactly which table to look at ("ir_sensor_logs")
        // and which Java class maps to it (IRSensorData.class)
        this.table = enhancedClient.table("ir_cracks_detection", TableSchema.fromBean(IRSensorData.class));
    }

    @Override
    public List<IRSensorData> getAllData() {
        // .scan() reads the whole table.
        // We then convert the AWS results into a standard Java List.
        return table.scan().items().stream().collect(Collectors.toList());
    }

    @Override
    public List<IRSensorData> getCracksByDeviceAndSensor(String deviceId, String sensorId) {

        // 1. The Query: Jump directly to the physical partition for this SensorID
        // (Fast!)
        QueryConditional queryConditional = QueryConditional
                .keyEqualTo(k -> k.partitionValue(sensorId));

        // 2. The Filter: Once inside that partition, only grab rows matching this
        // deviceId
        Expression filterExpression = Expression.builder()
                .expression("deviceId = :devId")
                .putExpressionValue(":devId", AttributeValue.builder().s(deviceId).build())
                .build();

        // 3. Combine them and execute (scanIndexForward(false) sorts newest-first)
        QueryEnhancedRequest request = QueryEnhancedRequest.builder()
                .queryConditional(queryConditional)
                .filterExpression(filterExpression)
                .scanIndexForward(false)
                .build();

        // Run the query and return as a List
        return table.query(request).items().stream().toList();
    }
}

// This class provides the actual implementation of the IRSensorRepository
// interface and handles communication with AWS DynamoDB.