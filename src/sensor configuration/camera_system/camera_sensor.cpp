#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Arduino.h>
#include "esp_camera.h"

// --- 1. CREDENTIALS ---
const char* ssid = "Redmi Note 10";
const char* password = "200170201635";
const char* botToken = "8453673141:AAHxgehOW__-7LuVvlmm7xqpEcW9zXRj3QA";
const char* chatId = "1681826822";
const char* aws_endpoint = "a141eqbs4ue48l-ats.iot.eu-north-1.amazonaws.com";

// --- 2. AWS CERTIFICATES ---
const char* AWS_CERT_CA = R"EOF(
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

const char* AWS_CERT_CRT = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDWTCCAkGgAwIBAgIURXz9Sqb+vDNCYidANotELwc6HAgwDQYJKoZIhvcNAQEL
BQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20g
SW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTI2MDQyNDE4MTA1
OVoXDTQ5MTIzMTIzNTk1OVowHjEcMBoGA1UEAwwTQVdTIElvVCBDZXJ0aWZpY2F0
ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMWrQehTK8nJPJYoyw0k
w7GsGesumopDRyyTJHYTR4iUmxxMOqORErBbTbEjCW8yTHzzHk8xaYvBu2coZkyn
mhoLDbuCWjfXrawcmV0tuXpGHiJVq4t6z1+O3GXAG3trf5jJuPXM3B/RCXiHUdZG
Kw50qhQ2jtIcSX51/RaILZR8htLHl6wV9sWwv+uj8iGIBehXDEerzrL2KN4s+AAV
URNVuCd8jDRM4PEEAfam4i5WaN5XTMj+4Qg6Yx7okE/GR5ZHAI6EYCQfoFlQ0QJy
r234uuVyzaAazBlyogJOaqNbjwg+XU+Afj4m0H50Xw04NaM8wUYD2FYKMXPb/UsU
evsCAwEAAaNgMF4wHwYDVR0jBBgwFoAUSCEyqaE+BhPJ9AI9M6AKS/l07NcwHQYD
VR0OBBYEFHms8xMWzqTa1oj5H0kvXhQmmbq8MAwGA1UdEwEB/wQCMAAwDgYDVR0P
AQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQB2IDRxOL3Hun5UsuJcYG2+FLEu
9Eld0ZyhkbnMXSQ3VIdY2XVlneW0hVORyxUBIZtOLxRnzyJ6E393zmOIs+FmVkoM
fRPHfKtXf8wHk7knhbPMtWHILJ8c3nixUunGbp+sU7TNOj8acx+DR6n5V4frd/rd
Pdg3zoVa+qN819/ZakjmrYfGwY/tS8EsHXd6D0fq6MDp+I0nFohf/VKYV48yIaVL
MuxAIov1ZL0t3i0WMtaA1wGRCEv6KPUiGfXOj1p1ok8iMFvmK2yA1MlZUn3sJPkB
pg1ulSaHgOEYMMV1NVP8MEoNTV4+nwOFhNi8Ec0LaGxEoX4/bDCsdLYB6GGL
-----END CERTIFICATE-----
)EOF";

const char* AWS_CERT_PRIVATE = R"EOF(
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAtYtlI7l5+9cp/mN7LntRmqumRy7OLUVfst3AczOVOuvEZCVZ
XZ8Pvm7gTsY5V9yuX1kCyPyx5yP/bdYy95TzvHPVSG2Zqe1HBfPqOOk/1XI6ReoP
seN9aHFdbqgiSG5l82uFpxHpx8Fz1XyK6N5s8vbypOJ0fzjt36g+2RLt9GpHKGT3
UsGx2V2qzyH7caSK3RlzFURGvu/X+L9lg4jqm89DmQYT+Zk/c9Nqnarnymxkjk7q
6ExsV/Z2OfWw86N1wC6ljPItLA6PDiAmWxvnIY8JkzrGAcgGRXwOlMHeRA560qIN
bZ0npjN5bHupXptRgGxjpLv0wLr9BfTbKgQofwIDAQABAoIBAHrX2hY0WUB6NaY3
NpEbTPq2D4u3NjgX60ujFaheTSpTgs6pHzFkgki/yfRD2WWEpFFMb8AEjXT0PNDb
0h0Jo2vvjXC3CPWc4yQ6ClF8M3+BDcFlQj2Cy8cyfqB0EM6mNUJjjUqhqmlKk9Dv
tycf6uT1CPddbKrxoLRoqi5EytNJOuiAST/1PtQK/Qs+Ml+y/i6pKhQc3eUaUn40
SCndXrgJhToKIDVHYeKDZxwDYtGwLD0SrGmVywsT8akEEDLpOcRFaOFGEuE+eP//
W6KFheLNW5P9Eiw33pUn1I7DhFVS/HoPm7Dt0T+i7AbUS5BtpO3+7NvlUIiHVi6D
XoBxcnECgYEA4BO0lKSpEIkMpwt/xi7rohFw1Ujnt9Cx7piSEePV/GYKdZe6ZIJG
ClwGMk0ihGsItuHI7s0PpvkPtUgQxnaRuu1F8AXj2uyjvOx6DfagCLrXxLkaqDrR
oEVUd2wyJKiBFEt0ruQlGDpx8lSl8fLPIPQntHBXZAIRs3LyH2YnYN0CgYEAz2h9
zkWYKHJ+Dyt9jZW6IkV60of1yodwVV60z9SLtPKJmm77ehUzmbaXju7O5GZVhiJ6
r0Tkg1MzNEeWSJo5o4/77QL7Cg6kFeDOiqL8I0HVB//FlifLg3h1Bz1L/guAjSo/
FOVurDOQC5pj68miEETBf6e+YD4i/yn1yPZ3iwsCgYEAx0gfKLdMeJ06OHHcoDfo
bgmOzND665paNHVSK0DydXeWw8A+D9dgTSRMin3ZPeUnKeah2edbjUch9jpyWN7o
elM9CNtkKracZI/3eOWmrDznWli5YXZ2KlCeb1s1OS73JUJ6MnRKnUKVRkyMDSLB
nXAmw63JuvKwJWUL+mrSiK0CgYAQ5LfqhyyfjsPJxIcTczCX/gTFBSH1/xYdPfuI
Og2vDVo74/JDvVpYmNC7aaQcYmFw7XoEsJ3UPICdL3+EJluvgNjKM0XzScH/rjHk
hOX4kTIi1qhnVJJ1AOi3UDzSUmmEFf7RWuaqzABdkZO17tRucss39JfDCwyar/Y/
CiQuhQKBgQDR5PJMxcT2ca2WxLOJUOOsEkgZCh4Ybkp4tyRvt7VUQ9jq9PN/Kka8
SDFxfKE+qwUiPm05dJAiwnJht/aIoU44m4H+1jSm04OX6K9mNj0MLET3NG6gE/Jz
krMtsh2qcmRX7yFXzYXiFNWahWMUvgJb1bE02EtOawY8itbItBJ6eg==
-----END RSA PRIVATE KEY-----
)EOF";

// --- 3. CAMERA PINS (AI-THINKER) ---
#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22

WiFiClientSecure net;
PubSubClient mqttClient(net);

// Custom function to send photo to Telegram without using the library function
String sendPhotoToTelegram(camera_fb_t *fb) {
  WiFiClientSecure client;
  client.setInsecure(); // Skip certificate validation for Telegram
  
  if (!client.connect("api.telegram.org", 443)) return "Connect Failed";

  String head = "--ESP32CAM\r\nContent-Disposition: form-data; name=\"photo\"; filename=\"esp32.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n";
  String tail = "\r\n--ESP32CAM--\r\n";
  uint32_t totalLen = head.length() + fb->len + tail.length();

  client.println("POST /bot" + String(botToken) + "/sendPhoto?chat_id=" + String(chatId) + " HTTP/1.1");
  client.println("Host: api.telegram.org");
  client.println("Content-Length: " + String(totalLen));
  client.println("Content-Type: multipart/form-data; boundary=ESP32CAM");
  client.println();
  client.print(head);
  
  uint8_t *fbBuf = fb->buf;
  size_t fbLen = fb->len;
  for (size_t n=0; n<fbLen; n=n+1024) {
    if (n+1024 < fbLen) client.write(fbBuf, 1024);
    else client.write(fbBuf, fbLen - n);
    fbBuf += 1024;
  }
  client.print(tail);
  
  return "OK";
}

void setup() {
  Serial.begin(115200);

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
  config.pin_pclk = PCLK_GPIO_NUM;
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

  esp_camera_init(&config);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }

  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  mqttClient.setServer(aws_endpoint, 8883);
}

void captureAndSend() {
  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) return;

  Serial.println("Sending to Telegram...");
  sendPhotoToTelegram(fb);
  
  StaticJsonDocument<200> doc;
  doc["SensorID"] = "IR_Bottom";
  doc["status"] = "CRACK FOUND";
  doc["uptime"] = millis() / 1000;

  char buffer[512];
  serializeJson(doc, buffer);
  mqttClient.publish("device/data", buffer);

  esp_camera_fb_return(fb);
  Serial.println("Capture Cycle Complete");
}

void loop() {
  if (!mqttClient.connected()) {
    mqttClient.connect("ESP32_CAM");
  }
  mqttClient.loop();

  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    if (command == "SNAP") {
      captureAndSend();
    }
  }
}