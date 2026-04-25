#include "esp_camera.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "secrets.h" // Your WiFi, AWS Endpoint, and Certs are here

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

WiFiClientSecure net;
PubSubClient mqttClient(net);

// --- 1. UPLOAD LOGIC ---
void captureAndSend() {
  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    return;
  }

  Serial.println("Action: Triggering Upload to Telegram & S3...");
  // Note: Add your specific S3 and Telegram POST functions here 
  // using the 'fb->buf' and 'fb->len'
  
  esp_camera_fb_return(fb);
  Serial.println("Cycle Complete.");
}

// --- 2. AWS CALLBACK (Listening to Friend) ---
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) message += (char)payload[i];

  Serial.print("Message from Friend's IR: ");
  Serial.println(message);

  // Check if her message contains the trigger
  if (message.indexOf("\"crack_detected\": true") != -1) {
    captureAndSend();
  }
}

// --- 3. AWS CONNECTION ---
void connectAWS() {
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);
  mqttClient.setServer(aws_endpoint, 8883);
  mqttClient.setCallback(mqttCallback);

  Serial.print("Connecting to AWS IoT...");
  while (!mqttClient.connect("ESP32_CAM_NODE")) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println(" Connected!");
  
  // SUBSCRIBE to friend's topic
  mqttClient.subscribe("device/esp-001/IR_Bottom");
}

void setup() {
  // DISABLE BROWNOUT DETECTOR (Prevents overheating/crashing)
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  Serial.begin(115200);

  // --- CAMERA INIT ---
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("Camera Init Failed");
    return;
  }

  // --- WIFI INIT ---
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  
  // Sync time for SSL
  configTime(0, 0, "pool.ntp.org");

  connectAWS();
}

void loop() {
  if (!mqttClient.connected()) {
    connectAWS();
  }
  mqttClient.loop();
}