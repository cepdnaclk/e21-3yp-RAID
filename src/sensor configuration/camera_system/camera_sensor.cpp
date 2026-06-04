 #include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include "esp_camera.h"
#include "soc/soc.h"           // Required for Brownout fix
#include "soc/rtc_cntl_reg.h"  // Required for Brownout fix
#include "secrets.h"           // Ensure ssid, password, botToken, chatId, and AWS certs are here

#ifndef CAMERA_POSITION
  #define CAMERA_POSITION "UNKNOWN" // Fallback just in case
#endif

const String CAMERA_ID = CAMERA_POSITION;

// --- CAMERA PINS (AI-THINKER) ---
#define PWDN_GPIO_NUM  32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM  0
#define SIOD_GPIO_NUM  26
#define SIOC_GPIO_NUM  27
#define Y9_GPIO_NUM    35
#define Y8_GPIO_NUM    34
#define Y7_GPIO_NUM    39
#define Y6_GPIO_NUM    36
#define Y5_GPIO_NUM    21
#define Y4_GPIO_NUM    19
#define Y3_GPIO_NUM    18
#define Y2_GPIO_NUM    5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM  23
#define PCLK_GPIO_NUM  22

#define HARDWARE_TRIGGER_PIN 13
volatile bool captureRequested = false;

// ── State set by the Master via MQTT cam_cmd ────────────────────────────────────
// crack_id   : unique event ID — echoed back so Master can match the DynamoDB row.
// presigned_url : time-limited S3 PUT URL from the presign Lambda.
//                Empty string means fall back to the public-PUT bucket method.
String pendingCrackId     = "";
String pendingPresignedUrl = "";

void IRAM_ATTR onHardwareTrigger() {
    captureRequested = true;
}


WiFiClientSecure net;
PubSubClient mqttClient(net);

// --- TELEGRAM UPLOAD ---
String sendPhotoToTelegram(camera_fb_t *fb) {
    WiFiClientSecure tlsClient;
    tlsClient.setInsecure(); // Telegram API works fine without CA check on ESP32
    tlsClient.setTimeout(20000); // 20 seconds timeout for mobile hotspots

    Serial.println("Connecting to Telegram API...");
    if (!tlsClient.connect("api.telegram.org", 443)) return "Connect Failed";

    String head = "--ESP32CAM\r\nContent-Disposition: form-data; name=\"photo\"; filename=\"esp32.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n";
    String tail = "\r\n--ESP32CAM--\r\n";
    uint32_t totalLen = head.length() + fb->len + tail.length();

    tlsClient.println("POST /bot" + String(botToken) + "/sendPhoto?chat_id=" + String(chatId) + " HTTP/1.1");
    tlsClient.println("Host: api.telegram.org");
    tlsClient.println("Content-Length: " + String(totalLen));
    tlsClient.println("Content-Type: multipart/form-data; boundary=ESP32CAM");
    tlsClient.println();
    tlsClient.print(head);
    
    uint8_t *fbBuf = fb->buf;
    size_t fbLen = fb->len;
    for (size_t n=0; n<fbLen; n=n+1024) {
        if (n+1024 < fbLen) tlsClient.write(fbBuf, 1024);
        else tlsClient.write(fbBuf, fbLen - n);
        fbBuf += 1024;
    }
    tlsClient.print(tail);
    return "OK";
}

// ── S3 UPLOAD (Pre-signed PUT) ───────────────────────────────────────────────────
// Sends the JPEG frame buffer to S3 using the provided PUT URL.
// - If a pre-signed URL was received via MQTT, it is used (secure, no public bucket).
// - If the pre-signed URL is empty, falls back to a direct public PUT (development mode).
// Returns the final public object URL on success, or "FAILED" on error.
String sendPhotoToS3(camera_fb_t *fb, const String &s3PutUrl) {
    WiFiClientSecure secureClient;
    secureClient.setInsecure();

    HTTPClient http;
    Serial.println("[S3] PUT → " + s3PutUrl.substring(0, 80) + "..."); // Trim for Serial

    http.begin(secureClient, s3PutUrl);
    http.addHeader("Content-Type", "image/jpeg");
    int httpResponseCode = http.PUT(fb->buf, fb->len);

    String resultUrl = "FAILED";
    if (httpResponseCode == 200 || httpResponseCode == 201 || httpResponseCode == 204) {
        // For pre-signed URLs, S3 returns 200/204 but the *public* URL is the key, not the signed URL.
        // Extract the clean object URL from the PUT URL by stripping query params.
        int qpos = s3PutUrl.indexOf('?');
        resultUrl = (qpos > 0) ? s3PutUrl.substring(0, qpos) : s3PutUrl;
        Serial.printf("[S3] ✅ Upload success (HTTP %d)\n", httpResponseCode);
    } else {
        Serial.printf("[S3] ❌ Upload failed (HTTP %d)\n", httpResponseCode);
    }

    http.end();
    return resultUrl;
}

// ── CAPTURE & REPORT ────────────────────────────────────────────────────────────────
// Called when captureRequested is set (by GPIO ISR or MQTT cam_cmd).
void captureAndSend() {
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
        Serial.println("[CAM] ❌ Frame buffer capture failed");
        return;
    }

    // ── Step 1: Choose the S3 PUT target URL ──────────────────────────────────
    // Priority: pre-signed URL (secure) → fallback public-PUT URL (dev mode)
    String targetUrl;
    if (pendingPresignedUrl.length() > 10) {
        targetUrl = pendingPresignedUrl;
        Serial.println("[CAM] Using pre-signed URL from Master");
    } else {
        // Fallback: construct a direct URL (requires public bucket write policy)
        String bucketName = "railway-system-photos-01-533350584731-eu-north-1-an";
        String region     = "eu-north-1";
        String fileName   = "cracks/fallback_" + String(millis()) + "_" + CAMERA_ID + ".jpg";
        targetUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fileName;
        Serial.println("[CAM] ⚠️  No presigned URL — using fallback public PUT");
    }

    // Snapshot the local crack_id before clearing (loop() may not wait)
    String localCrackId = pendingCrackId;

    // Clear pending state now — we have local copies
    pendingPresignedUrl = "";
    pendingCrackId      = "";

    // ── Step 2: Upload to S3 ────────────────────────────────────────────────────
    Serial.println("[CAM] Uploading to S3...");
    String s3Url = sendPhotoToS3(fb, targetUrl);

    // ── Step 3: Send S3 object URL + crack_id back to Master via MQTT ───────
    // Master's mqttCallback listens on device/esp-001/camera_url and will
    // then publish the full unified alert to AWS IoT Core → Lambda → DynamoDB.
    if (s3Url != "FAILED") {
        StaticJsonDocument<300> doc;
        doc["camera_id"] = CAMERA_ID;
        doc["image_url"] = s3Url;
        doc["crack_id"]  = localCrackId; // Echo back for Master correlation

        char buffer[300];
        serializeJson(doc, buffer);

        if (mqttClient.publish("device/esp-001/camera_url", buffer)) {
            Serial.println("[CAM] ✅ S3 URL reported to Master — crack_id=" + localCrackId);
        } else {
            Serial.println("[CAM] ❌ camera_url publish failed");
        }
    } else {
        Serial.println("[CAM] S3 upload failed — not reporting to Master");
    }

    esp_camera_fb_return(fb);
    Serial.println("[CAM] Cycle complete.");
}


// --- AWS CALLBACK (Listen for Friend's IR) ---
// void mqttCallback(char* topic, byte* payload, unsigned int length) {
//     Serial.print("Message arrived on topic: ");
//     Serial.println(topic);

//     String message;
//     for (int i = 0; i < length; i++) message += (char)payload[i];

//     // Listen specifically for your friend's trigger
//     if (message.indexOf("\"crackDetected\": true") != -1) {
//         Serial.println("TRIGGER: IR Sensor detected a crack!");
//         captureAndSend();
//     }
// }

// ── MQTT CALLBACK ──────────────────────────────────────────────────────────────────
void mqttCallback(char* topic, byte* payload, unsigned int length) {
    String topicStr = String(topic);
    Serial.println("[MQTT] Received on: " + topicStr);

    StaticJsonDocument<768> doc;
    DeserializationError error = deserializeJson(doc, payload, length);
    if (error) {
        Serial.println("[MQTT] JSON parse failed: " + String(error.c_str()));
        return;
    }

    // ── Handler 1: Master sends cam_cmd with crack_id + presigned_url ────────────
    // Topic: device/esp-001/cam_cmd/<CAMERA_ID>  (e.g. .../cam_cmd/LEFT)
    String camCmdTopic = "device/esp-001/cam_cmd/" + CAMERA_ID;
    if (topicStr == camCmdTopic) {
        pendingCrackId      = doc["crack_id"].as<String>();
        pendingPresignedUrl = doc["presigned_url"].as<String>();

        Serial.println("[MQTT] ✅ cam_cmd received:");
        Serial.println("       crack_id     = " + pendingCrackId);
        Serial.println("       presigned    = (" + String(pendingPresignedUrl.length()) + " chars)");

        // Set the capture flag — loop() will call captureAndSend()
        // GPIO ISR may also fire; both paths converge on the same flag.
        captureRequested = true;
        return;
    }

    // ── Handler 2: Generic crack_detected broadcast (legacy / test path) ───────
    if (doc["crack_detected"] == true || doc["crackDetected"] == true) {
        Serial.println("[MQTT] Legacy crack_detected trigger received");
        captureRequested = true;
    }
}
// ── AWS IoT CONNECT ───────────────────────────────────────────────────────────────
void connectAWS() {
    net.setCACert(AWS_CERT_CA);
    net.setCertificate(AWS_CERT_CRT);
    net.setPrivateKey(AWS_CERT_PRIVATE);
    mqttClient.setServer(aws_endpoint, 8883);
    mqttClient.setCallback(mqttCallback);

    Serial.print("[AWS] Connecting MQTT...");
    String clientId = "ESP32_CAM_" + CAMERA_ID;
    while (!mqttClient.connect(clientId.c_str())) {
        Serial.print(".");
        delay(1000);
    }
    Serial.println(" Connected!");

    // Subscribe to the per-camera command topic so the Master can send
    // {crack_id, presigned_url} directly to this camera node.
    String camCmdTopic = "device/esp-001/cam_cmd/" + CAMERA_ID;
    mqttClient.subscribe(camCmdTopic.c_str());
    Serial.println("[AWS] Subscribed to cam_cmd: " + camCmdTopic);

    // Also subscribe to the legacy IR broadcast topic (for test triggers)
    mqttClient.subscribe("device/esp-001/IR_Bottom");
    Serial.println("[AWS] Subscribed to IR_Bottom broadcast");
}

void setup() {
    // 1. DISABLE BROWNOUT (Crucial for heat/stability)
    WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

    pinMode(HARDWARE_TRIGGER_PIN, INPUT_PULLDOWN);
    attachInterrupt(digitalPinToInterrupt(HARDWARE_TRIGGER_PIN), onHardwareTrigger, RISING);


    Serial.begin(115200);

    // 2. CAMERA CONFIG
    camera_config_t config;
    config.ledc_channel = LEDC_CHANNEL_0;
    config.ledc_timer = LEDC_TIMER_0;
    config.pin_d0 = Y2_GPIO_NUM; config.pin_d1 = Y3_GPIO_NUM;
    config.pin_d2 = Y4_GPIO_NUM; config.pin_d3 = Y5_GPIO_NUM;
    config.pin_d4 = Y6_GPIO_NUM; config.pin_d5 = Y7_GPIO_NUM;
    config.pin_d6 = Y8_GPIO_NUM; config.pin_d7 = Y9_GPIO_NUM;
    config.pin_xclk = XCLK_GPIO_NUM; config.pin_pclk = PCLK_GPIO_NUM;
    config.pin_vsync = VSYNC_GPIO_NUM; config.pin_href = HREF_GPIO_NUM;
    config.pin_sccb_sda = SIOD_GPIO_NUM; config.pin_sccb_scl = SIOC_GPIO_NUM;
    config.pin_pwdn = PWDN_GPIO_NUM; config.pin_reset = RESET_GPIO_NUM;
    config.xclk_freq_hz = 20000000;
    config.pixel_format = PIXFORMAT_JPEG;
    config.frame_size = FRAMESIZE_QVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;

    if (esp_camera_init(&config) != ESP_OK) {
        Serial.println("Camera init failed");
        return;
    }

    WiFi.mode(WIFI_STA); 
    Serial.println("\nScan started");
    int n = WiFi.scanNetworks();
    Serial.printf("%d networks found\n", n);
    for (int i = 0; i < n; ++i) {
    Serial.println(WiFi.SSID(i));
    }
    // 3. WIFI & TIME SYNC
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
    Serial.println("\nWiFi Connected");

    configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    Serial.print("Syncing Time");
    while (time(nullptr) < 100000) { delay(500); Serial.print("."); }
    Serial.println("\nTime Synced!");

    connectAWS();
}

void loop() {
    if (!mqttClient.connected()) {
        connectAWS();
    }
    mqttClient.loop();

    if (captureRequested) {
        captureRequested = false; // Reset the flag immediately
        Serial.println("\n🚨 TRIGGER ACTIVATED! Capturing Photo...");
        captureAndSend();
    }

    // Debug SNAP via Serial
    if (Serial.available()) {
        String cmd = Serial.readStringUntil('\n');
        cmd.trim();
        if (cmd == "SNAP") captureAndSend();
    }
}