package com.messaging;

import com.dto.sensor.IRSensorDataDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class MqttReceiver {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate; // The WebSocket Broadcaster

    // Spring injects both the Mapper and the WebSocket Template
    public MqttReceiver(ObjectMapper objectMapper, SimpMessagingTemplate messagingTemplate) {
        this.objectMapper = objectMapper;
        this.messagingTemplate = messagingTemplate;
    }

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleIncomingMqttMessage(Message<String> message) {
        String rawJsonPayload = message.getPayload();

        try {
            // 1. Convert MQTT JSON to Java DTO
            IRSensorDataDTO liveCrackData = objectMapper.readValue(rawJsonPayload, IRSensorDataDTO.class);

            // 2. Check if conversion was successful (null safety)
            if (liveCrackData == null) {
                System.err.println("Failed to parse MQTT payload into IRSensorDataDTO");
                return;
            }

            // 3. BROADCAST TO REACT: Push the DTO down the WebSocket to anyone listening
            messagingTemplate.convertAndSend("/topic/cracks", liveCrackData);

            System.out.println("Broadcasted live crack data to Web UI: " + liveCrackData.getSensorId());

        } catch (Exception e) {
            System.err.println("Failed to process MQTT message: " + e.getMessage());
        }
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