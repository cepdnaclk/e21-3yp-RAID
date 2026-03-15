package com.repositary.imp;

import com.model.irsensorData;
import com.repositary.IRSensorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.Page;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class IRSensorRepositoryImpl implements IRSensorRepository {

    private final DynamoDbTable<irsensorData> table;

    public IRSensorRepositoryImpl(
            DynamoDbEnhancedClient enhancedClient,
            @Value("${app.dynamodb.table-name}") String tableName) {
        this.table = enhancedClient.table(tableName, TableSchema.fromBean(irsensorData.class));
    }

    @Override
    public irsensorData save(irsensorData data) {
        table.putItem(data);
        return data;
    }

    @Override
    public List<irsensorData> findAll() {
        return table.scan()
                .items()
                .stream()
                .collect(Collectors.toList());
    }

    @Override
    public List<irsensorData> findByDeviceId(String deviceId) {
        Map<String, AttributeValue> expressionValues = new HashMap<>();
        expressionValues.put(":deviceId", AttributeValue.builder().s(deviceId).build());

        ScanEnhancedRequest request = ScanEnhancedRequest.builder()
                .filterExpression(software.amazon.awssdk.enhanced.dynamodb.Expression.builder()
                        .expression("deviceId = :deviceId")
                        .expressionValues(expressionValues)
                        .build())
                .build();

        return table.scan(request)
                .stream()
                .map(Page::items)
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

}
