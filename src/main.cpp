#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <time.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "sensor configuration/ir sensors/ir_sensor.h"
#include "sensor configuration/gps sensors/gps_module.h"
#include "sensor configuration/encoder_config/encoder_odometry.h"

// ================= Configuration =================
const int CAM_TRIGGERS[3] = {4, 5, 18}; // LEFT, CENTER, RIGHT Pins
const String ZONE_NAMES[3] = {"LEFT", "CENTER", "RIGHT"};
const unsigned long OFFSET_DELAY_MS = 500; // 0.5s delay for camera alignment
const char *ssid = "Dialog 4G 515";
const char *password = "2F22ECEF";
const char *mqtt_server = "a141eqbs4ue48l-ats.iot.eu-north-1.amazonaws.com";
const char *CLIENT_ID = "esp32";
const String DEVICE_ID = "esp-001";
const char *SENSOR_ID = "IR_Bottom";

String getIsoTimestamp();

int consecutiveCracks[3] = {0, 0, 0};
bool pendingTrigger[3] = {false, false, false};
unsigned long crackDetectedTime[3] = {0, 0, 0};
bool waitingForCamera[3] = {false, false, false};
unsigned long cameraWaitStart[3] = {0, 0, 0};
unsigned long lastCriticalAlert[3] = {0, 0, 0};

IRScanResult lastIrScanResult[3]; // Store values per zone while waiting for camera
MultiZoneScanResult currentZones; // Globally available for the heartbeat

// GPS module instance (uses TinyGPS++ under the hood)
GPSModule gps;

// ================= AWS IoT =================
WiFiClientSecure espClient;
PubSubClient client(espClient);

// ================= Certificates =================
const char AWS_CERT_CA[] = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
rqXRfboQnoZsG4q5WTP468SQvvG5
-----END CERTIFICATE-----
)EOF";

const char AWS_CERT_CRT[] = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDWTCCAkGgAwIBAgIUWczs0w8ikuX+Fb8swmuOTHVVanEwDQYJKoZIhvcNAQEL
BQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20g
SW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTI2MDQzMDEyNDUx
NVoXDTQ5MTIzMTIzNTk1OVowHjEcMBoGA1UEAwwTQVdTIElvVCBDZXJ0aWZpY2F0
ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJlN9g/J5vCkIf/hbru2
nPF5ZZbI9T9S0HXQ2JgmLPHc2ZYDosVpa9pGn7009IPVq8VXQKCi6sD9s8dKw/Qn
ZCRxhKSpG59ElG7V9HrqFeKL+PdOC6IVJCVx6+XNaVxuvSzp6VYmkdpg1hY0OnvK
0xLxNJsxEQDv6eZ/09O8G6CADoubfHaNYb/j/ZvXQ23pGZJba+9m8NrrFzhmUxIw
tMerY22mcMp2hRjgAqGEV2vmNVwsyveam2f4rZisxUO9PahyRbPbXVmLmT2+7OEy
By6mwcSiUP35IhrY99qk9TL9gKF81kyOwbxiaRL0f4Wp4a3mjWK6lfDxjm4LxuqU
Q5cCAwEAAaNgMF4wHwYDVR0jBBgwFoAUHgI1cDXxFr7HgJjOZletPO/pMqYwHQYD
VR0OBBYEFH3Eo6llI7/TQQQb3MftYLMYO7ZsMAwGA1UdEwEB/wQCMAAwDgYDVR0P
AQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQAM4AmFL2e4VxVAhaxWQg4F7jE2
k1sF+z/emT94RQkcZ/7y316H6P4U3i2JZwwjCK2J9WbNvqtpk3TX1wUOPlpeYW6G
gUgZmT6unz4O9cQz72gIHg6qE5oymKXHoQL95QIJsB7s/FG2ZJZ8D/H9UmTtAd4v
0Wf6vLa8OEONR3AtqPIIIWE1Ym3nRsWFqxYkpFW8nrayDXaMv6+YteCULAhpHb0m
6mFldmy2KyQ69CVOeuEUHpuK16JdCD8B4KuYd/W3YkBaMqNoPxdMDp9VNWWa+OVv
opxz2PMwH+qCEZ8FU7yPKsW1HeB2kCF/JpwnYVNq8dF6Q4zQuGxyCbDx6QvG
-----END CERTIFICATE-----
)EOF";

const char AWS_CERT_PRIVATE[] = R"EOF(
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAmU32D8nm8KQh/+Fuu7ac8Xlllsj1P1LQddDYmCYs8dzZlgOi
xWlr2kafvTT0g9WrxVdAoKLqwP2zx0rD9CdkJHGEpKkbn0SUbtX0euoV4ov4904L
ohUkJXHr5c1pXG69LOnpViaR2mDWFjQ6e8rTEvE0mzERAO/p5n/T07wboIAOi5t8
do1hv+P9m9dDbekZkltr72bw2usXOGZTEjC0x6tjbaZwynaFGOACoYRXa+Y1XCzK
95qbZ/itmKzFQ709qHJFs9tdWYuZPb7s4TIHLqbBxKJQ/fkiGtj32qT1Mv2AoXzW
TI7BvGJpEvR/hanhreaNYrqV8PGObgvG6pRDlwIDAQABAoIBAFEgQXtfc9eac+eN
62RooarjfBAMLkQhVfFS4Ju7cANZxMcvC17+h7WNtBCTSmXNl8Wpg6i+Lg6M8yse
dI3qnoLuk6vzVYu15fq1PFgjMgud2NU+NsfB+kvaemQ0jHH+pBt1eSY+6OYwYnqD
jwNddM9MV3NcxsvBKfzxXi5pGBGZgORorYBlfZGAA9lmjwPU7bcpDwcPR+WABXGH
G0ahFNBMq21OMUaBGRjkuWM8OmIGMk36qp8wB/T99vfq4jnSDEoZb8d4sl1B3jUx
5KvwDI4QyKOMRPNIip5lx08vZ9G5wmly3Sdv43CZeX1MzB1gdj5W5vl5zx1hUB4I
M3tcqekCgYEAybT8ZwJ51uT4/g1WQr1Xv3gDbKuLvqst1xYMLA+u1SCosm2KjKgJ
b7mo6XAzQQy7Fr5lVxGQHi7swQVjxpJSpM5Z6XYxPuHqHfgJ97DfskXIQkCVtYmH
1Tm3Gr0eCpRFOPrh4qso4vvCmdDrjxsVDydhqewEaAV6/N3B38d8SkUCgYEAwpG1
14G9WwPrEcseSTXwM3WzGzuhgmsWb1t9IK+M+OT/UAs0zLUncP3xOtaOTjYfZxKM
W99oUpCKc6in5gpxg0ZICAZ5+GS/PZWHxNGRCM/waHBIN5IijfSrGLbfrCBwbT5a
egY8tiDKubDQt9P2soNZ8LX5Jd9ar00ojJc2QisCgYAO3yk87xHMplU1ZgZWJV+y
3kZiXMOQ604V7ao4FW/uhtnpTepJNJp9glLR41PkF+wzYRZXtRPLJeqO0LbqjR9K
x2wZqn03BbEdRIx3lrLnkf2R5PEk0V8SeY7micsNPKFd8iF1dOku0yEl9iFoC7ch
xuWMgbpRcRYATtlchnjDgQKBgAdtlKmjlF0TKzhEruVQn9j3F11ky2e1OugJcB99
VD50T6L4qo1eJSFVMI50fn5R5qUCukUPpGXyirabq71GjMrcNgfIZ4OqJPru6H4F
Giph9eWm07r7Y0JUIuwQnz1tB53EEaQy9MJnQhYQwAckmnh6N0bPS7G8czPaGEA1
zaZ9AoGBAInfBOVvekLSTCUNvDAGnCsSilI9QMFsk4YpYuXa0hiDSewVLdnynPqq
fwbNWMM5b7gidfyKPdyxZCNVCRkxxrjmRCF+f0ajxOdxY6kZUwrA4CWlLRxG56yT
4aKhun1FZf2CL702AnL9HtAG0hHoS6ZYAoBWlbq0axAma/QKgCiW
-----END RSA PRIVATE KEY-----
)EOF";

// ================= Helper: MQTT State to String =================
String mqttStateToString(int state)
{
  switch (state)
  {
  case -4:
    return "MQTT_CONNECTION_TIMEOUT";
  case -3:
    return "MQTT_CONNECTION_LOST";
  case -2:
    return "MQTT_CONNECT_FAILED";
  case -1:
    return "MQTT_DISCONNECTED";
  case 0:
    return "MQTT_CONNECTED";
  case 1:
    return "MQTT_CONNECT_BAD_PROTOCOL";
  case 2:
    return "MQTT_CONNECT_BAD_CLIENT_ID";
  case 3:
    return "MQTT_CONNECT_UNAVAILABLE";
  case 4:
    return "MQTT_CONNECT_BAD_CREDENTIALS";
  case 5:
    return "MQTT_CONNECT_UNAUTHORIZED";
  default:
    return "UNKNOWN (" + String(state) + ")";
  }
}

// ================= WiFi Connection =================
void connectWiFi()
{
  Serial.println("\n========== WiFi ==========");
  Serial.print("Target SSID  : ");
  Serial.println(ssid);
  Serial.print("Chip MAC     : ");
  Serial.println(WiFi.macAddress());
  Serial.println("Starting WiFi connection...");

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    attempts++;
    Serial.printf("  [%2ds] Status: %d", attempts, WiFi.status());
    // Status codes: 0=IDLE, 1=NO_SSID, 3=CONNECTED, 4=CONNECT_FAILED, 6=DISCONNECTED
    switch (WiFi.status())
    {
    case WL_NO_SSID_AVAIL:
      Serial.print(" -> SSID NOT FOUND");
      break;
    case WL_CONNECT_FAILED:
      Serial.print(" -> WRONG PASSWORD / AUTH FAILED");
      break;
    case WL_CONNECTION_LOST:
      Serial.print(" -> CONNECTION LOST");
      break;
    case WL_DISCONNECTED:
      Serial.print(" -> DISCONNECTED (trying...)");
      break;
    default:
      break;
    }
    Serial.println();

    if (attempts >= 30)
    {
      Serial.println("  !! TIMEOUT after 30s. Restarting ESP32...");
      ESP.restart();
    }
  }
  Serial.println("  >> WiFi CONNECTED!");
  Serial.print("  IP Address  : ");
  Serial.println(WiFi.localIP());
  Serial.print("  Gateway     : ");
  Serial.println(WiFi.gatewayIP());
  Serial.print("  DNS         : ");
  Serial.println(WiFi.dnsIP());
  Serial.print("  Signal (dBm): ");
  Serial.println(WiFi.RSSI());
  Serial.println("==========================\n");
}
// ================= AWS IoT Connection =================
void connectAWS()
{
  Serial.println("========== AWS IoT ==========");
  Serial.print("Broker       : ");
  Serial.println(mqtt_server);
  Serial.print("Port         : 8883");
  Serial.println();
  Serial.print("Client ID    : ");
  Serial.println(CLIENT_ID);

  Serial.println("Loading TLS certificates...");
  espClient.setCACert(AWS_CERT_CA);
  espClient.setCertificate(AWS_CERT_CRT);
  espClient.setPrivateKey(AWS_CERT_PRIVATE);
  Serial.println("  CA Cert    : Loaded");
  Serial.println("  Device Cert: Loaded");
  Serial.println("  Private Key: Loaded");

  client.setServer(mqtt_server, 8883);
  client.setBufferSize(1024);
  Serial.println("MQTT server configured. Attempting connection...");

  int attempt = 0;
  while (!client.connected())
  {
    attempt++;
    Serial.printf("\n  [Attempt %d] Connecting to AWS IoT...\n", attempt);

    if (client.connect(CLIENT_ID))
    {
      Serial.println("  >> MQTT CONNECTED to AWS IoT Core!");
    }
    else
    {
      int rc = client.state();
      Serial.print("  !! FAILED. State code: ");
      Serial.println(mqttStateToString(rc));

      if (rc == -2)
      {
        Serial.println("     >> TLS Handshake likely failed.");
        Serial.println("        Check: certificate validity, endpoint URL, clock sync.");
      }
      else if (rc == 5)
      {
        Serial.println("     >> Unauthorized. Check AWS IoT Policy allows clientId & actions.");
      }
      else if (rc == 2)
      {
        Serial.println("     >> Bad Client ID. Ensure CLIENT_ID matches your AWS IoT Policy.");
      }

      Serial.println("  Retrying in 5 seconds...");
      delay(5000);

      if (attempt >= 5)
      {
        Serial.println("  !! 5 failed attempts. Restarting ESP32...");
        ESP.restart();
      }
    }
  }
  Serial.println("=============================\n");
}

// ================= Unified AWS Publisher =================
void publishUnifiedAlert(String imageUrl, String sensorId, const IRScanResult &irData)
{
  StaticJsonDocument<512> doc;
  doc["SensorId"] = sensorId;
  doc["deviceId"] = DEVICE_ID;
  doc["timestamp"] = getIsoTimestamp();
  doc["crackDetected"] = true;
  doc["crack_detected"] = true;

  doc["status"] = "CRITICAL_DEFECT";
  doc["irSensor"] = irData.minValue;
  doc["image_url"] = imageUrl;
  // Prefer frozen coordinates if available (captured at trigger time),
  // otherwise fall back to the current live location.
  bool useFrozen = gps.isFrozenValid();
  double lat = useFrozen ? gps.getFrozenLat() : gps.getBestLatitude();                         // ← CHANGED
  double lng = useFrozen ? gps.getFrozenLng() : gps.getBestLongitude();                        // ← CHANGED
  bool valid = useFrozen ? gps.isFrozenValid() : (gps.isLiveLocationValid() || enc_originSet); // ← CHANGED

  doc["latitude"] = valid ? lat : 0.0;
  doc["longitude"] = valid ? lng : 0.0;
  doc["gps_valid"] = valid;
  doc["locationSource"] = gps.isPositionFromEncoder() ? "ENCODER" : "GPS"; // ← NEW
  doc["gpsSats"] = gps.getSatellites();                                    // ← NEW

  JsonArray irArray = doc.createNestedArray("irArray");
  for (int i = 0; i < IR_SENSOR_COUNT; ++i)
  {
    irArray.add(irData.values[i]);
  }

  String payload;
  serializeJson(doc, payload);
  String topic = "device/" + DEVICE_ID + "/IR_Bottom";

  if (client.publish(topic.c_str(), payload.c_str()))
  {
    Serial.println("\n🚨 UNIFIED ALERT PUBLISHED: " + payload);
  }
  else
  {
    Serial.println("❌ Failed to publish unified alert.");
  }
}

// ================= MQTT Callback =================

void mqttCallback(char *topic, byte *payload, unsigned int length)
{
  if (String(topic) == "device/esp-001/camera_url")
  {
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, payload, length);

    if (!error)
    {
      String camId = doc["camera_id"].as<String>(); // "LEFT", "CENTER", or "RIGHT"
      String url = doc["image_url"].as<String>();

      // Map the string ID to our array index (0, 1, or 2)
      int z = -1;
      if (camId == "LEFT")
        z = 0;
      else if (camId == "CENTER")
        z = 1;
      else if (camId == "RIGHT")
        z = 2;

      // If we found a valid zone and were actually waiting for it
      if (z != -1 && waitingForCamera[z])
      {
        Serial.println("Received S3 URL from Camera: " + camId);
        publishUnifiedAlert(url, camId, lastIrScanResult[z]);
        waitingForCamera[z] = false;
      }
    }
  }
}

void syncTime()
{
  Serial.println("Syncing time with NTP...");

  configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2)
  {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }

  Serial.println("\nTime synchronized!");

  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);

  Serial.print("Current time: ");
  Serial.println(asctime(&timeinfo));
}

String getIsoTimestamp()
{
  time_t now = time(nullptr);
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);

  char buffer[32];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}

unsigned long lastHeartbeat = 0;

char mqtt_topic[64]; // Permanent buffer for the MQTT topic
                     // Counter to filter out sensor noise
unsigned long lastSensorScan = 0;

constexpr unsigned long SENSOR_SCAN_INTERVAL_MS = 50;
constexpr int REQUIRED_CONSECUTIVE_CRACKS = 6; // ~300ms stable crack indication
// ================= Setup =================
void setup()
{
  // CRITICAL: Disable brownout detector to prevent restart loops when camera + WiFi power on simultaneously
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);
  for (int i = 0; i < 3; i++)
  {
    pinMode(CAM_TRIGGERS[i], OUTPUT);
    digitalWrite(CAM_TRIGGERS[i], LOW);
  }

  Serial.begin(115200);
  delay(1000); // Let Serial stabilize

  Serial.println("\n\n##############################");
  Serial.println("#   ESP32 AWS IoT Boot       #");
  Serial.println("##############################");
  Serial.print("SDK Version : ");
  Serial.println(ESP.getSdkVersion());
  Serial.print("Free Heap   : ");
  Serial.println(ESP.getFreeHeap());
  Serial.print("Chip Model  : ");
  Serial.println(ESP.getChipModel());
  Serial.println();
  Serial.println("[BOOT] Brownout detector disabled for camera+WiFi operation.");

  connectWiFi();
  syncTime();
  connectAWS();
  initIRSensors();
  Wire.begin(14, 15); // ← NEW: AS5600 I2C pins (GPIO 14=SDA, GPIO 15=SCL)
  encoder_init();     // ← NEW: initialise encoder baseline
  gps.begin();

  client.setCallback(mqttCallback);
  // Prepare MQTT Topic
  snprintf(mqtt_topic, sizeof(mqtt_topic), "device/%s/IR_Bottom", DEVICE_ID.c_str());

  // Subscribe to command topic
  String commandTopic = "device/" + DEVICE_ID + "/command";
  Serial.print("Subscribing to: ");
  Serial.println(commandTopic);

  if (client.subscribe(commandTopic.c_str()))
  {
    Serial.println("  >> Subscription SUCCESSFUL");
  }
  if (client.subscribe("device/esp-001/camera_url"))
  {
    Serial.println("  >> Camera URL Subscription SUCCESSFUL");
  }
  else
  {
    Serial.println("  !! Subscription FAILED");
  }

  snprintf(mqtt_topic, sizeof(mqtt_topic), "device/%s/IR_Bottom", DEVICE_ID.c_str());

  Serial.println("\n>>> Setup complete. Entering loop...\n");
}

// ================= Loop =================

void loop()
{
  static bool irScanReady = false;
  encoder_update(); // ← NEW: must run every loop tick for accurate ticks
  gps.update();

  if (!client.connected())
  {
    Serial.println("\n!! MQTT connection LOST. Reconnecting...");
    connectAWS();
    String commandTopic = "device/" + DEVICE_ID + "/command";
    client.subscribe(commandTopic.c_str());
    client.subscribe("device/esp-001/camera_url");
  }

  client.loop();
  unsigned long now = millis();

  // =========================================================
  // 1. SCAN SENSORS & TRACK DELAYS
  // =========================================================
  if (!irScanReady || (now - lastSensorScan >= SENSOR_SCAN_INTERVAL_MS))
  {
    lastSensorScan = now;
    currentZones = scanAllZones(); // Read all 3 arrays
    irScanReady = true;

    for (int z = 0; z < 3; z++)
    {
      // Debounce logic per zone
      if (currentZones.zone[z].crackDetected)
      {
        consecutiveCracks[z]++;
      }
      else
      {
        consecutiveCracks[z] = 0;
      }

      bool crack_detected = (consecutiveCracks[z] >= REQUIRED_CONSECUTIVE_CRACKS);

      // PHASE 1: Detect Crack -> Start Offset Delay Timer
      if (crack_detected && !pendingTrigger[z] && !waitingForCamera[z] && (now - lastCriticalAlert[z] > 3000))
      {
        pendingTrigger[z] = true;
        crackDetectedTime[z] = now;
        lastIrScanResult[z] = currentZones.zone[z]; // Save the IR state for when camera returns
        gps.freezeCoordinates();                    // Lock GPS at exact detection point

        Serial.println("🚨 CRACK DETECTED [" + ZONE_NAMES[z] + "]! Waiting " + String(OFFSET_DELAY_MS) + "ms to align camera...");
      }
    }
  }

  // =========================================================
  // 2. PROCESS PENDING TRIGGERS (The Physics Offset Delay)
  // =========================================================
  for (int z = 0; z < 3; z++)
  {
    // PHASE 2: Delay passed -> Fire Camera Trigger
    if (pendingTrigger[z] && (now - crackDetectedTime[z] >= OFFSET_DELAY_MS))
    {
      pendingTrigger[z] = false;
      waitingForCamera[z] = true;
      cameraWaitStart[z] = now;
      lastCriticalAlert[z] = now;
      lastHeartbeat = now; // Reset heartbeat

      // FIRE THE SPECIFIC CAMERA
      digitalWrite(CAM_TRIGGERS[z], HIGH);
      delay(50);
      digitalWrite(CAM_TRIGGERS[z], LOW);

      Serial.println("📸 Hardware triggered [" + ZONE_NAMES[z] + "]! Waiting for S3 URL...");
    }

    // PHASE 3: Timeout if Camera Crashes or WiFi fails
    if (waitingForCamera[z] && (now - cameraWaitStart[z] > 60000))
    {
      Serial.println("❌ Camera upload timed out for [" + ZONE_NAMES[z] + "]. Publishing alert without image.");
      publishUnifiedAlert("No Image (Timeout)", ZONE_NAMES[z], lastIrScanResult[z]);
      waitingForCamera[z] = false;
    }
  }

  // =========================================================
  // 3. HYBRID HEARTBEAT LOGIC
  // =========================================================
  if (now - lastHeartbeat >= 30000)
  {
    lastHeartbeat = now;
    StaticJsonDocument<512> doc;

    doc["deviceId"] = DEVICE_ID;
    doc["timestamp"] = getIsoTimestamp();
    doc["crack_detected"] = false;
    doc["status"] = "NOMINAL_HEARTBEAT";
    doc["uptime"] = now / 1000;

    // Find the absolute lowest IR reading across all 3 zones for the heartbeat metric
    int minHeartbeatIr = 4095;
    for (int z = 0; z < 3; z++)
    {
      if (currentZones.zone[z].minValue < minHeartbeatIr)
      {
        minHeartbeatIr = currentZones.zone[z].minValue;
      }
    }
    doc["irSensor"] = minHeartbeatIr;

    bool liveValid = gps.isLiveLocationValid() || enc_originSet; // ← CHANGED
    doc["latitude"] = liveValid ? gps.getBestLatitude() : 0.0;   // ← CHANGED
    doc["longitude"] = liveValid ? gps.getBestLongitude() : 0.0; // ← CHANGED
    doc["gps_valid"] = liveValid;
    doc["locationSource"] = gps.isPositionFromEncoder() ? "ENCODER" : "GPS"; // ← NEW
    doc["gpsSats"] = gps.getSatellites();                                    // ← NEW

    String payload;
    serializeJson(doc, payload);
    String topic = "device/" + DEVICE_ID + "/IR_Bottom"; // Your general topic

    if (client.publish(topic.c_str(), payload.c_str()))
    {
      Serial.println("\n💚 Heartbeat Check-in: " + payload);
    }
  }
}