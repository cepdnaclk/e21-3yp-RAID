package com.messaging;

import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.dto.sensor.IRSensorDataDTO;
import com.dto.sensor.UltrasonicSensorDataDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.service.UltrasonicSensorService;

@Component
public class MqttReceiver {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate; // The WebSocket Broadcaster
    private final UltrasonicSensorService ultrasonicSensorService;

    // Spring injects both the Mapper and the WebSocket Template
    public MqttReceiver(ObjectMapper objectMapper,
                        SimpMessagingTemplate messagingTemplate,
                        UltrasonicSensorService ultrasonicSensorService) {
        this.objectMapper = objectMapper;
        this.messagingTemplate = messagingTemplate;
        this.ultrasonicSensorService = ultrasonicSensorService;
    }

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleIncomingMqttMessage(Message<String> message) {
        String rawJsonPayload = message.getPayload();
        String mqttTopic = message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC, String.class);

        try {
            JsonNode payloadNode = objectMapper.readTree(rawJsonPayload);
            boolean ultrasonicTopic = "railway/ultrasonic".equals(mqttTopic);
            boolean crackTopic = "railway/cracks".equals(mqttTopic);

            if (ultrasonicTopic || isUltrasonicPayload(payloadNode)) {
                UltrasonicSensorDataDTO liveUltrasonicData = objectMapper.readValue(rawJsonPayload, UltrasonicSensorDataDTO.class);

                if (liveUltrasonicData == null) {
                    System.err.println("Failed to parse MQTT payload into UltrasonicSensorDataDTO");
                    return;
                }

                // Persist ultrasonic telemetry first, then broadcast the stored DTO.
                UltrasonicSensorDataDTO savedUltrasonicData = ultrasonicSensorService.saveSensorData(liveUltrasonicData);
                if (savedUltrasonicData == null) {
                    System.err.println("Ultrasonic data save returned null, skipping broadcast");
                    return;
                }

                messagingTemplate.convertAndSend("/topic/ultrasonic", savedUltrasonicData);
                System.out.println("Stored and broadcasted live ultrasonic data to Web UI: " + savedUltrasonicData.getSensorId());
                return;
            }

            if (crackTopic || isCrackPayload(payloadNode)) {
                IRSensorDataDTO liveCrackData = objectMapper.readValue(rawJsonPayload, IRSensorDataDTO.class);

                if (liveCrackData == null) {
                    System.err.println("Failed to parse MQTT payload into IRSensorDataDTO");
                    return;
                }

                messagingTemplate.convertAndSend("/topic/cracks", liveCrackData);
                System.out.println("Broadcasted live crack data to Web UI: " + liveCrackData.getSensorId());
                return;
            }

            System.err.println("Ignoring MQTT message from unsupported topic: " + mqttTopic);

        } catch (JsonProcessingException e) {
            System.err.println("Failed to process MQTT message: " + e.getMessage());
        }
    }

    private boolean isUltrasonicPayload(JsonNode payloadNode) {
        return payloadNode.path("sensorType").asText("").equalsIgnoreCase("ultrasonic")
                || payloadNode.path("sensorId").asText("").toLowerCase().contains("ultra");
    }

    private boolean isCrackPayload(JsonNode payloadNode) {
        return payloadNode.path("sensorType").asText("").equalsIgnoreCase("crack")
                || payloadNode.path("crackDetected").asBoolean(false)
                || payloadNode.path("crack_detected").asBoolean(false);
    }
}

/*
 * ===========================================================
 * MQTT RECEIVER - EXPLANATION
 * ===========================================================
 * 
 * PURPOSE:
 * --------
 * This class acts as a bridge between AWS IoT (MQTT messages)
 * and the frontend (React UI via WebSocket).
 * 
 * It listens to incoming MQTT messages from the internal
 * Spring Integration channel and broadcasts processed data
 * to connected WebSocket clients in real-time.
 * 
 * -----------------------------------------------------------
 * DATA FLOW:
 * -----------------------------------------------------------
 * ESP32 Device
 * ↓ (publishes MQTT message)
 * AWS IoT Core
 * ↓
 * MqttConfig (MQTT Adapter)
 * ↓
 * mqttInputChannel (Spring Message Channel)
 * ↓
 * MqttReceiver (THIS CLASS)
 * ↓
 * WebSocket (/topic/cracks)
 * ↓
 * React Frontend (Live UI Updates)
 * 
 * -----------------------------------------------------------
 * KEY COMPONENTS:
 * -----------------------------------------------------------
 * 
 * 1. @Component
 * - Marks this class as a Spring-managed bean.
 * 
 * 2. @ServiceActivator(inputChannel = "mqttInputChannel")
 * - Listens for messages arriving from MQTT.
 * - Automatically triggers the method when a message arrives.
 * 
 * 3. ObjectMapper
 * - Converts incoming JSON string into Java object (DTO).
 * 
 * 4. SimpMessagingTemplate
 * - Sends messages from backend to frontend via WebSocket.
 * 
 * -----------------------------------------------------------
 * METHOD LOGIC:
 * -----------------------------------------------------------
 * 
 * handleIncomingMqttMessage(Message<String> message)
 * 
 * Step 1:
 * Extract raw JSON payload from MQTT message.
 * Example:
 * {
 * "sensorId": "esp32_1",
 * "crackDetected": true
 * }
 * 
 * Step 2:
 * Convert JSON → IRSensorDataDTO using ObjectMapper.
 * 
 * Step 3:
 * Broadcast DTO to frontend using WebSocket:
 * Destination: "/topic/cracks"
 * 
 * Any frontend client subscribed to this topic
 * will instantly receive the data.
 * 
 * Step 4:
 * Log success message for debugging.
 * 
 * Step 5:
 * Handle errors (invalid JSON, parsing issues).
 * 
 * -----------------------------------------------------------
 * IMPORTANT NOTES:
 * -----------------------------------------------------------
 * 
 * - Topic "/topic/cracks" must match frontend subscription.
 * - DTO structure must match incoming JSON format.
 * - If JSON format changes, parsing will fail.
 * - This class only processes and forwards data,
 * it does NOT store data in a database.
 * 
 * -----------------------------------------------------------
 * SUMMARY:
 * -----------------------------------------------------------
 * This class enables real-time communication by:
 * ✔ Receiving MQTT messages from AWS IoT
 * ✔ Converting them into Java objects
 * ✔ Broadcasting them to the frontend via WebSocket
 * 
 * It is a critical part of the real-time IoT pipeline.
 * 
 * ===========================================================
 */