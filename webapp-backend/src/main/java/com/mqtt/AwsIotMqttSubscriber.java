package com.mqtt;

import com.dto.sensor.IRSensorDataDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.service.IRSensorService;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

/**
 * Subscribes to AWS IoT Core MQTT topic and forwards each payload into
 * IRSensorService.
 */
@Component
public class AwsIotMqttSubscriber {

    private static final Logger log = LoggerFactory.getLogger(AwsIotMqttSubscriber.class);

    private final IRSensorService irSensorService;
    private final ObjectMapper objectMapper;

    @Value("${app.mqtt.enabled:false}")
    private boolean enabled;

    @Value("${app.mqtt.broker-uri:}")
    private String brokerUri;

    @Value("${app.mqtt.client-id:webapp-backend-ir-subscriber}")
    private String clientId;

    @Value("${app.mqtt.topic:railsafe/ir-sensor/data}")
    private String topic;

    @Value("${app.mqtt.ca-cert-path:}")
    private String caCertPath;

    @Value("${app.mqtt.client-cert-path:}")
    private String clientCertPath;

    @Value("${app.mqtt.private-key-path:}")
    private String privateKeyPath;

    public AwsIotMqttSubscriber(IRSensorService irSensorService, ObjectMapper objectMapper) {
        this.irSensorService = irSensorService;
        this.objectMapper = objectMapper;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void subscribeOnStartup() {
        if (!enabled) {
            log.info("MQTT subscriber disabled (app.mqtt.enabled=false)");
            return;
        }

        try {
            MqttClient client = new MqttClient(brokerUri, clientId, new MemoryPersistence());

            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setSocketFactory(buildSocketFactory());

            client.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {
                    log.warn("MQTT connection lost", cause);
                }

                @Override
                public void messageArrived(String incomingTopic, MqttMessage message) {
                    String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
                    try {
                        IRSensorDataDTO dto = objectMapper.readValue(payload, IRSensorDataDTO.class);
                        irSensorService.saveIRData(dto);
                        log.info("Saved MQTT IR payload for device={} from topic={}", dto.getDeviceId(), incomingTopic);
                    } catch (Exception ex) {
                        log.error("Failed to parse/process MQTT payload: {}", payload, ex);
                    }
                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                    // No-op: subscriber does not publish messages.
                }
            });

            client.connect(options);
            client.subscribe(topic, 1);
            log.info("Subscribed to MQTT topic '{}' using broker '{}'.", topic, brokerUri);
        } catch (Exception ex) {
            log.error("MQTT subscriber startup failed", ex);
        }
    }

    private javax.net.SocketFactory buildSocketFactory() throws Exception {
        if (caCertPath.isBlank() || clientCertPath.isBlank() || privateKeyPath.isBlank()) {
            throw new IllegalStateException("MQTT TLS certificate paths are required when MQTT is enabled.");
        }

        X509Certificate caCert = readCertificate(caCertPath);
        X509Certificate clientCert = readCertificate(clientCertPath);
        PrivateKey privateKey = readPrivateKey(privateKeyPath);

        KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
        trustStore.load(null, null);
        trustStore.setCertificateEntry("ca-cert", caCert);

        TrustManagerFactory trustManagerFactory = TrustManagerFactory
                .getInstance(TrustManagerFactory.getDefaultAlgorithm());
        trustManagerFactory.init(trustStore);

        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStore.load(null, null);
        keyStore.setCertificateEntry("client-cert", clientCert);
        keyStore.setKeyEntry("private-key", privateKey, new char[0], new Certificate[] { clientCert });

        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        keyManagerFactory.init(keyStore, new char[0]);

        SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
        sslContext.init(keyManagerFactory.getKeyManagers(), trustManagerFactory.getTrustManagers(), null);
        return sslContext.getSocketFactory();
    }

    private X509Certificate readCertificate(String certPath) throws Exception {
        String certContent = Files.readString(Path.of(certPath), StandardCharsets.UTF_8)
                .replace("-----BEGIN CERTIFICATE-----", "")
                .replace("-----END CERTIFICATE-----", "")
                .replaceAll("\\s", "");

        byte[] certBytes = Base64.getDecoder().decode(certContent);
        CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
        return (X509Certificate) certificateFactory.generateCertificate(new java.io.ByteArrayInputStream(certBytes));
    }

    private PrivateKey readPrivateKey(String keyPath) throws Exception {
        String keyContent = Files.readString(Path.of(keyPath), StandardCharsets.UTF_8)
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");

        byte[] keyBytes = Base64.getDecoder().decode(keyContent);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(keySpec);
    }
}
