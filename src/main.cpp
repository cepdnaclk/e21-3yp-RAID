#include <Arduino.h>
#include "secrets.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"
#include <time.h>

// --- IR Sensor Configuration ---
#define IRPIN 14 

#define AWS_IOT_PUBLISH_TOPIC   "ir-array1/pub" // Matches your AWS Policy prefix
#define AWS_IOT_SUBSCRIBE_TOPIC "ir-array1/sub"

int irStatus;

WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);

// --- Function Declarations (Required for PlatformIO/CPP) ---
void messageHandler(char* topic, byte* payload, unsigned int length);
void connectWiFi();
bool syncTime();
void printLocalTime();
void logMqttState();
void connectAWS();
void publishMessage();

static bool s_tlsConfigured = false;
static bool s_timeSynced = false;

void setup() {
    Serial.begin(115200);
    delay(500);
    while (!Serial && millis() < 4000) {
        delay(10);
    }

    Serial.println("Booting...");
    pinMode(IRPIN, INPUT); 
    connectAWS();
}

void loop() {
    irStatus = digitalRead(IRPIN);

    if (client.connected()) {
        publishMessage();
    } else {
        connectAWS(); // Reconnect if connection drops
    }

    client.loop();
    delay(2000); 
}

// --- Function Definitions ---

void connectAWS() {
    Serial.println("\n----------------------------");
    Serial.println("STEP 1: Connecting to Wi-Fi");

    connectWiFi();
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[ERROR] WiFi Connection Failed. Check hotspot/SSID/password.");
        Serial.println("----------------------------");
        return;
    }

    Serial.println("[SUCCESS] Wi-Fi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    if (!s_timeSynced) {
        Serial.println("STEP 1b: Syncing time (required for TLS cert validation)");
        s_timeSynced = syncTime();
        if (!s_timeSynced) {
            Serial.println("[ERROR] Time sync failed; TLS to AWS IoT will fail without valid time.");
            Serial.println("----------------------------");
            return;
        }
    }

    if (!s_tlsConfigured) {
        // Configure WiFiClientSecure with certificates (do this once)
        net.setCACert(AWS_CERT_CA);
        net.setCertificate(AWS_CERT_CRT);
        net.setPrivateKey(AWS_CERT_PRIVATE);
        net.setHandshakeTimeout(30);

        client.setServer(AWS_IOT_ENDPOINT, 8883);
        client.setCallback(messageHandler);
        client.setSocketTimeout(15);
        client.setKeepAlive(60);
        s_tlsConfigured = true;
    }

    IPAddress resolved;
    Serial.println("\nSTEP 2: Connecting to AWS IoT Core...");
    Serial.print("Endpoint: ");
    Serial.println(AWS_IOT_ENDPOINT);
    if (WiFi.hostByName(AWS_IOT_ENDPOINT, resolved)) {
        Serial.print("DNS resolved: ");
        Serial.println(resolved);
    } else {
        Serial.println("[WARN] DNS resolution failed (check Wi-Fi DNS / captive portal). ");
    }

    if (client.connect(THINGNAME)) {
        Serial.println("[SUCCESS] AWS IoT Connected!");
        client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
        Serial.println("----------------------------");
        return;
    }

    Serial.println("[ERROR] AWS IoT Connection Failed.");
    logMqttState();
    {
        char sslErr[256];
        int err = net.lastError(sslErr, sizeof(sslErr));
        Serial.printf("TLS lastError: %d (%s)\n", err, sslErr);
    }
    Serial.println("----------------------------");
}

void publishMessage() {
    StaticJsonDocument<200> doc;
    doc["device_id"] = THINGNAME;
    doc["status"] = (irStatus == LOW) ? "OBJECT_DETECTED" : "CLEAR";
    
    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer); 
    client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}

void messageHandler(char* topic, byte* payload, unsigned int length) {
    // Handle incoming messages if needed
}

void connectWiFi() {
    if (WiFi.status() == WL_CONNECTED) {
        return;
    }

    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.printf("Connecting to Wi-Fi SSID: %s\n", WIFI_SSID);

    int attempt = 0;
    while (WiFi.status() != WL_CONNECTED && attempt < 30) {
        attempt++;
        delay(500);
        Serial.print(".");
    }

    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
        Serial.printf("Wi-Fi connected. IP address: %s\n", WiFi.localIP().toString().c_str());
        return;
    }

    Serial.printf("Wi-Fi connection failed. Status code: %d\n", WiFi.status());
}

bool syncTime() {
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    Serial.println("Synchronizing time with NTP");

    time_t now = time(nullptr);
    int attempt = 0;
    while (now < 8 * 3600 * 2 && attempt < 30) {
        attempt++;
        delay(500);
        Serial.print(".");
        now = time(nullptr);
    }

    Serial.println();

    if (now < 8 * 3600 * 2) {
        Serial.println("NTP time sync failed");
        return false;
    }

    printLocalTime();
    return true;
}

void printLocalTime() {
    struct tm timeInfo;
    if (!getLocalTime(&timeInfo)) {
        Serial.println("Failed to obtain local time");
        return;
    }

    Serial.print("Current UTC time: ");
    Serial.println(&timeInfo, "%Y-%m-%d %H:%M:%S");
}

void logMqttState() {
    Serial.printf("MQTT connect failed, PubSubClient state=%d\n", client.state());

    switch (client.state()) {
        case MQTT_CONNECTION_TIMEOUT:
            Serial.println("Reason: broker timeout or TLS handshake did not complete");
            break;
        case MQTT_CONNECTION_LOST:
            Serial.println("Reason: connection was lost after being established");
            break;
        case MQTT_CONNECT_FAILED:
            Serial.println("Reason: network or TLS connection failed before MQTT CONNECT completed");
            break;
        case MQTT_DISCONNECTED:
            Serial.println("Reason: client is disconnected");
            break;
        case MQTT_CONNECT_BAD_PROTOCOL:
            Serial.println("Reason: broker rejected the MQTT protocol version");
            break;
        case MQTT_CONNECT_BAD_CLIENT_ID:
            Serial.println("Reason: AWS IoT rejected the client ID");
            break;
        case MQTT_CONNECT_UNAVAILABLE:
            Serial.println("Reason: broker unavailable");
            break;
        case MQTT_CONNECT_BAD_CREDENTIALS:
            Serial.println("Reason: certificate or private key rejected");
            break;
        case MQTT_CONNECT_UNAUTHORIZED:
            Serial.println("Reason: AWS IoT policy or certificate authorization failed");
            break;
        default:
            Serial.println("Reason: unknown MQTT state");
            break;
    }
}