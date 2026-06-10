# RAID — Autonomous IoT-Based Railway Track Crack Detection Robot
### 3YP Final Presentation · 2026 · University of Peradeniya — E/21 Batch

> **Repository:** `cepdnaclk/e21-3yp-RAID`

**Tech Stack:**
`ESP32-S3 + ESP32-CAM` · `AWS IoT Core` · `MQTT over TLS 1.2` · `DynamoDB + S3` · `Spring Boot` · `React + TypeScript` · `Real-Time WebSocket`

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Solution Architecture](#2-solution-architecture)
3. [Data & Control Flow](#3-data--control-flow)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Sensors & Actuators](#6-sensors--actuators)
7. [Controller Platforms](#7-controller-platforms)
8. [Network Technologies & Protocols](#8-network-technologies--protocols)
9. [Back-End Technologies](#9-back-end-technologies)
10. [Front-End Technologies](#10-front-end-technologies)
11. [Summary](#11-summary)

---

## 1. System Overview

Railway infrastructure safety is critical for preventing accidents and ensuring reliable transportation. RAID is an **autonomous IoT-based robot** designed to detect cracks and structural defects in railway tracks in real time, reducing the need for risky manual inspections.

### Core Mission

| # | Capability | Description |
|---|-----------|-------------|
| 🤖 | **Autonomous Patrolling** | Robot traverses the railway line continuously without human intervention |
| 🔍 | **Multi-Zone Crack Detection** | 3 IR sensor arrays (LEFT / CENTER / RIGHT) scan each rail for structural anomalies |
| 📸 | **Photo Evidence** | 3 ESP32-CAM modules capture JPEG images uploaded directly to AWS S3 via pre-signed URLs |
| 📡 | **Real-Time Telemetry** | MQTT → AWS IoT → Spring Boot → WebSocket → React dashboard in < 2 seconds |

### Key Statistics

| Metric | Value |
|--------|-------|
| Sensor Arrays | 3 (LEFT / CENTER / RIGHT) |
| Camera Units | 3 (ESP32-CAM per zone) |
| Heartbeat Interval | Every 30 seconds |
| Alert Latency | < 2 seconds (detection to dashboard) |
| IR Scan Rate | 20 Hz (50 ms interval) |
| Crack Confirmation | 6 consecutive positive reads (~300 ms) |

### Event Pipeline

```
IR detects crack
       ↓
GPS coordinates frozen at detection point
       ↓
500 ms physics offset delay (camera alignment)
       ↓
Pre-signed S3 URL fetched from Lambda
       ↓
Camera triggered (MQTT command + GPIO pulse)
       ↓
JPEG uploaded to AWS S3
       ↓
Unified alert published to AWS IoT Core
       ↓
Operator dashboard notified in real time
```

---

## 2. Solution Architecture

The system is built on a 4-layer architecture:

```
┌──────────────────────────────────────────────────────────────────────┐
│  ⚙️  PHYSICAL / EMBEDDED LAYER                                        │
│                                                                        │
│  ESP32-S3 (Master)  │  IR Sensor Arrays ×9   │  GPS Module (NEO-6M)  │
│  ESP32-CAM ×3       │  Buzzer (YXDZ)         │  LCD 20×4 (I²C)       │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
              WiFi WPA2 · MQTT/TLS 1.2 (Port 8883) · HTTPS
                              │
┌─────────────────────────────▼────────────────────────────────────────┐
│  ☁️  AWS CLOUD LAYER (eu-north-1)                                      │
│                                                                        │
│  AWS IoT Core (MQTT Broker)  │  IoT Rule Engine  │  DynamoDB          │
│  S3 Bucket (JPEG Images)     │  Lambda (Pre-sign URL Generator)       │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
          MQTT/Eclipse Paho · AWS SDK v2 · mTLS PKCS12 Certificates
                              │
┌─────────────────────────────▼────────────────────────────────────────┐
│  🖥️  SPRING BOOT BACKEND LAYER (Java 17)                               │
│                                                                        │
│  MQTT Receiver  │  Spring Integration  │  IRSensorService             │
│  DynamoDB Repository  │  WebSocket STOMP Broker  │  REST API          │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
             WebSocket (STOMP + SockJS) · HTTP REST · CORS secured
                              │
┌─────────────────────────────▼────────────────────────────────────────┐
│  🌐  REACT FRONTEND LAYER (TypeScript + Vite)                          │
│                                                                        │
│  Mission Control Dashboard  │  Live Map (Leaflet.js)  │  Reports      │
│  useTelemetry Hook          │  Supabase Auth          │  PDF Export    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data & Control Flow

### Complete End-to-End Flow

```
┌─────────────────────────────────────────────────────────┐
│  🚂  Robot Moves Along Railway Track                     │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 1 — IR Sensor Scanning                             │
│  • 50 ms scan interval (20 Hz)                           │
│  • 3 zones: LEFT / CENTER / RIGHT                        │
│  • ADC 12-bit range: 0–4095                              │
│  • 6 consecutive positives required → confirmed crack    │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 2 — ESP32-S3 Detects Crack                         │
│  • Generates unique crack_id                             │
│    Format: crack_esp-001_ZONE_millis                     │
│  • Activates buzzer (1 second pulse, GPIO Pin 4)         │
│  • LCD displays: "!! CRACK DETECTED !!"                  │
└───────────────┬─────────────────────┬───────────────────┘
                ↓                     ↓
       GPS Frozen              Fetch Pre-signed URL
  (coordinates locked          from Lambda (HTTPS GET,
   at crack moment)             8 s timeout)
                ↓                     ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 3 — Camera Triggered (after 500 ms offset delay)   │
│  • MQTT command to: device/esp-001/cam_cmd/ZONE          │
│    Payload: { crack_id, presigned_url }                  │
│  • GPIO hardware pulse (20 ms) as reliable backup        │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 4 — ESP32-CAM Captures & Uploads                   │
│  • OV2640 captures JPEG (PSRAM buffered, 4 MB)           │
│  • HTTPS PUT to S3 pre-signed URL                        │
│  • S3 object key: cracks/crack_id.jpg                    │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 5 — Camera Confirms Upload                         │
│  • Publishes to: device/esp-001/camera_url               │
│    Payload: { camera_id, image_url, crack_id }           │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 6 — ESP32-S3 Publishes Unified Alert               │
│  • Topic: device/esp-001/IR_Bottom                       │
│  • Payload contains:                                     │
│    - crack_id, SensorId, deviceId, timestamp             │
│    - crack_detected: true, status: CRITICAL_DEFECT       │
│    - irSensor (minValue), irArray[]                      │
│    - image_url (S3 link)                                 │
│    - latitude, longitude, locationValid, satellites      │
│    - severity (0–100 scale)                              │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 7 — AWS IoT Core Routes Message                    │
│  • Validates X.509 device certificate                    │
│  • IoT Rule → DynamoDB (saves crack record)              │
│  • Spring Boot MQTT subscriber receives via Paho         │
└───────────────┬─────────────────────┬───────────────────┘
                ↓                     ↓
       DynamoDB Stores           Spring Boot Broadcasts
   SensorID (PK)                 MqttReceiver
   timestamp (SK)                    ↓
   crack_detected               IRSensorService
   image_url                        ↓
   latitude / longitude        SimpMessagingTemplate
   severity / uptime               ↓
   deviceId / status          /topic/alerts  (WebSocket)
                                    ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 8 — React Frontend Updates                         │
│  • useTelemetry hook receives STOMP message              │
│  • Dashboard live crack list prepends new event          │
│  • Map marker appears at GPS coordinates                 │
│  • Severity colour: RED ≥70% / AMBER 40-70% / BLUE <40% │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 9 — Operator Reviews & Acts                        │
│  • Views crack image from S3                             │
│  • Sees GPS location + severity score                    │
│  • Exports PDF inspection report                         │
│  • Dispatches maintenance crew                           │
└─────────────────────────────────────────────────────────┘
```

### MQTT Topic Map

| Topic | Direction | Purpose |
|-------|-----------|---------|
| `device/esp-001/IR_Bottom` | ↑ Publish | Crack alerts + 30 s heartbeats |
| `device/esp-001/command` | ↓ Subscribe | Control commands to robot |
| `device/esp-001/cam_cmd/LEFT` | ↓ Subscribe | Camera trigger — left zone |
| `device/esp-001/cam_cmd/CENTER` | ↓ Subscribe | Camera trigger — center zone |
| `device/esp-001/cam_cmd/RIGHT` | ↓ Subscribe | Camera trigger — right zone |
| `device/esp-001/camera_url` | ↑ Publish | S3 URL confirmation from camera |

---

## 4. Functional Requirements

### Robot / Embedded

| ID | Requirement | Detail |
|----|-------------|--------|
| FR-01 | **Autonomous Navigation** | Robot traverses rail line continuously on its own motor drive system |
| FR-02 | **Multi-Zone IR Scanning** | Scans LEFT/CENTER/RIGHT at 50 ms intervals; 6 consecutive positives (~300 ms) confirms a crack |
| FR-03 | **GPS Geo-Tagging** | GPS coordinates "frozen" at crack detection moment; published in every alert payload |
| FR-04 | **Camera Triggering** | Master ESP32 triggers correct zone camera via MQTT + GPIO pulse with 500 ms physics offset |
| FR-05 | **Local LCD Display** | 20×4 I²C LCD shows system status, crack zone, and channel number in real time |
| FR-06 | **Heartbeat Publishing** | Device sends `NOMINAL_HEARTBEAT` every 30 s with GPS + IR telemetry when no crack detected |

### Cloud & Application

| ID | Requirement | Detail |
|----|-------------|--------|
| FR-07 | **Secure Image Upload** | Lambda generates pre-signed S3 PUT URLs; camera uploads JPEG without exposing credentials |
| FR-08 | **Persistent Storage** | All crack events stored in DynamoDB with SensorID (PK) + timestamp (SK) + image URL |
| FR-09 | **Real-Time Dashboard** | Spring Boot re-broadcasts MQTT data over WebSocket (STOMP); React updates live without refresh |
| FR-10 | **Live Geo-Map** | Leaflet.js renders real-time crack markers coloured by severity on OpenStreetMap |
| FR-11 | **PDF Report Export** | Operators export Daily/Weekly/Monthly reports as PDF using jsPDF + html2canvas |
| FR-12 | **Authenticated Access** | Supabase auth gates the dashboard; ProtectedRoute redirects unauthenticated users |

---

## 5. Non-Functional Requirements

### 🛡️ Dependability

| Mechanism | Implementation |
|-----------|----------------|
| WiFi Auto-Roaming | `WiFiMulti` rotates across 4 registered APs automatically |
| MQTT Reconnect | Reconnects on disconnect; ESP32 restarts after 5 consecutive failures |
| Crack Debounce | 6 consecutive IR readings required — eliminates vibration false positives |
| Camera Watchdog | 60 s timeout — publishes alert without image if camera fails |
| NTP Time Sync | `pool.ntp.org` + `time.nist.gov` at boot ensures accurate timestamps |
| WebSocket Reconnect | 5 s auto-reconnect in frontend keeps dashboard live |

### ⚡ Efficiency

| Metric | Value |
|--------|-------|
| IR Scan Interval | 50 ms (interrupt-free main loop) |
| LCD Refresh Rate | 250 ms |
| MQTT Buffer Size | 1024 bytes (tuned for JSON payload size) |
| Frontend Event Cache | Max 100 live events per sensor stream |
| Data Strategy | Historical data loaded once on mount; incremental real-time updates |

### 📈 Scalability

| Aspect | Approach |
|--------|----------|
| Multi-device Fleet | Dashboard supports N devices; DynamoDB PK = SensorID per zone |
| Load Balancing View | Mission Control shows load distribution across all active robots |
| Image Storage | AWS S3 — effectively unlimited, no capacity planning required |
| Database Scaling | DynamoDB auto-scaling — no manual shard management |
| Testing | `esp-002-mock` and `esp-003-mock` simulate additional robots |

### 🔒 Security

| Layer | Mechanism |
|-------|-----------|
| Device ↔ AWS IoT | X.509 client certificate + private key embedded in firmware (TLS 1.2, port 8883) |
| Backend ↔ AWS IoT | PKCS12 keystore (`backend-keystore.p12`), TLS 1.2 via SSLContext |
| Camera → S3 | Pre-signed PUT URLs from Lambda — no AWS credentials on device |
| Dashboard | Supabase JWT authentication; ProtectedRoute wrapper |
| CORS | Explicit allowlist in Spring Boot — no wildcard origins |

### 🎨 User Experience

| Feature | Detail |
|---------|--------|
| Live Status | Animated pulse badges show real-time connectivity of each robot |
| Severity Colour Coding | Map markers RED (≥70%) / AMBER (40–70%) / BLUE (<40%) |
| PDF Export | One-click report download — no backend call needed |
| Responsive Layout | Mobile-first with bottom navigation bar |
| Graceful Errors | "No GPS" / "No Image (Timeout)" shown instead of blank fields |

---

## 6. Sensors & Actuators

### IR Sensor Arrays — Crack Detection

Three arrays of IR sensors positioned at LEFT, CENTER, and RIGHT zones (9 sensors total).

| Parameter | Value |
|-----------|-------|
| ADC Range | 0 – 4095 (12-bit resolution) |
| Scan Interval | 50 ms (20 Hz polling) |
| Confirmation Threshold | 6 consecutive positive reads (~300 ms) |
| Severity Formula | `constrain(map(minValue, 0, 4095, 100, 0), 0, 100)` |
| Interface | Analog GPIO on ESP32-S3 |
| Power | 3.3 V / 5 V via onboard LDO |

> **Interpretation:** Lower ADC reading = more light passing through gap = larger crack = higher severity

### ESP32-CAM Modules — Photo Evidence

Three ESP32-CAM modules at LEFT, CENTER, and RIGHT zones.

| Parameter | Value |
|-----------|-------|
| Image Sensor | OV2640 2MP |
| Image Format | JPEG (PSRAM buffered) |
| Upload Method | HTTPS PUT → S3 Pre-signed URL |
| Trigger Method | MQTT command + 20 ms GPIO HIGH pulse |
| Master Timeout | 60 seconds (watchdog) |
| PSRAM | 4 MB (`BOARD_HAS_PSRAM` flag enabled) |

**Camera trigger flow:**
```
crack_detected → 500ms delay → fetchPresignedUrl(objectKey)
                             → MQTT publish: device/esp-001/cam_cmd/ZONE
                             → GPIO HIGH (20ms) → GPIO LOW
```

### GPS Module

| Parameter | Value |
|-----------|-------|
| Library | TinyGPS++ v1.0.3 |
| Interface | UART (Hardware Serial) |
| Strategy | `gps.freezeCoordinates()` at detection moment |
| Fallback | Live location if frozen coordinates invalid |
| Heartbeat | Satellite count + validity published every 30 s |

### Other Actuators

| Device | Interface | Behaviour |
|--------|-----------|-----------|
| YXDZ Buzzer | GPIO Pin 4 | 1 second HIGH pulse on crack detection |
| LCD 20×4 | I²C (SDA=8, SCL=9, addr=0x27) | 250 ms refresh; fault → "!! CRACK DETECTED !!" |
| Camera GPIO Triggers | GPIO 15 (L) / 16 (C) / 17 (R) | 20 ms pulse; fallback if MQTT slow |

### Component Interfacing Summary

- **Main Hub:** ESP32-S3 orchestrates all hardware and network communications.
- **IR Arrays (Analog & Digital):** 3 analog inputs (Pins 4, 5, 6) multiplexed via 3 digital pins (10, 11, 12).
- **ESP32-CAMs (Hybrid):** Fast hardware GPIO trigger (Pins 15-17) combined with an MQTT JSON command containing the S3 URL.
- **Feedback (I²C & GPIO):** LCD connects via I²C (SDA=8, SCL=9 at 100kHz). Buzzer directly driven by digital Pin 13.
- **Cloud Link (WiFi & MQTT):** Encrypted MQTT (Port 8883) over WiFi, authenticated with embedded X.509 certificates.

---

## 7. Controller Platforms

### ESP32-S3-DevKitC-1 — Master Controller

| Attribute | Specification |
|-----------|---------------|
| CPU | Xtensa LX7 Dual-Core @ 240 MHz |
| Flash | 8 MB (OTA capable) |
| SRAM | 512 KB + external PSRAM support |
| WiFi | 802.11 b/g/n (2.4 GHz) |
| Bluetooth | BLE 5.0 |
| GPIO | 45 programmable I/O pins |
| ADC | 2× 12-bit SAR ADC (20 channels) |
| UART | 3× (GPS, debug, spare) |
| I²C | 2× (LCD on SDA=8, SCL=9, 100 kHz) |
| Security | Secure Boot, Flash Encryption, eFuse |
| Framework | Arduino via PlatformIO |
| Monitor Speed | 115200 baud |
| Approx. Cost | ~$10–$15 USD |

**Key Libraries:**

| Library | Version | Purpose |
|---------|---------|---------|
| PubSubClient | 2.8 | MQTT client |
| ArduinoJson | 6.21.5 | JSON serialization |
| TinyGPSPlus | 1.0.3 | GPS NMEA parsing |
| LiquidCrystal_I2C | 1.1.4 | I²C LCD control |
| UniversalTelegramBot | 1.3.0 | Telegram alerts |

### ESP32-CAM — Camera Sub-Modules (×3)

| Attribute | Specification |
|-----------|---------------|
| CPU | Xtensa LX6 Dual-Core @ 240 MHz |
| Flash | 4 MB |
| PSRAM | 4 MB |
| Camera | OV2640 2MP (up to UXGA resolution) |
| WiFi | 802.11 b/g/n |
| Trigger | GPIO ISR on RISING edge + MQTT subscribe |
| Positions | LEFT (`cam_left`), CENTER (`cam_center`), RIGHT (`cam_right`) |
| Approx. Cost | ~$7–$12 USD × 3 |

### PlatformIO Build Environments

```ini
[env:esp32-s3-devkitc-1]   ; Master controller (IR + GPS)
[env:camera_left]           ; ESP32-CAM LEFT zone
[env:camera_center]         ; ESP32-CAM CENTER zone
[env:camera_right]          ; ESP32-CAM RIGHT zone
[env:esp32dev_testing]      ; Standard ESP32 for development/testing
```

---

## 8. Network Technologies & Protocols

### Protocol Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| Physical | WiFi 802.11 b/g/n | WPA2, 2.4 GHz |
| Resilience | WiFiMulti | 4 registered APs, auto-connects to strongest available |
| Device → Cloud | MQTT over TLS 1.2 | Port 8883, QoS 1, mTLS X.509 |
| Camera → S3 | HTTPS PUT | Pre-signed URL, no AWS credentials on device |
| Backend → Cloud | MQTT (Eclipse Paho) | PKCS12 keystore, TLS 1.2 |
| Backend ↔ Frontend | WebSocket (STOMP/SockJS) | Port 8080, `/raid-websocket` endpoint |
| REST API | HTTP/1.1 | `/api/cracks/**`, CORS-restricted |

### Security Properties

| Path | Security Mechanism |
|------|--------------------|
| ESP32 ↔ AWS IoT | X.509 client certificate + Amazon Root CA (TLS 1.2) |
| Backend ↔ AWS IoT | PKCS12 keystore (`backend-keystore.p12`), password-protected |
| Camera → S3 | Short-lived pre-signed PUT URL (8 s Lambda timeout) |
| Browser ↔ Backend | Supabase JWT on REST calls; CORS allowlist |

### Network Reliability

- **WiFi:** `WiFiMulti` registers up to 4 APs; auto-selects strongest signal
- **MQTT:** Keep-alive 60 s; reconnects on loss; ESP restarts after 5 failed attempts
- **WebSocket:** 5 s reconnect delay in React `@stomp/stompjs` client
- **Camera upload:** 8 s HTTP timeout for Lambda cold starts; 60 s watchdog on master

---

## 9. Back-End Technologies

### Spring Boot Application (Java 17)

| Component | Technology |
|-----------|-----------|
| Framework | Spring Boot 3.5.13 |
| MQTT Client | Eclipse Paho MQTT v3 1.2.5 |
| MQTT Integration | Spring Integration MQTT |
| WebSocket | Spring WebSocket + STOMP protocol |
| Database Client | AWS SDK v2 DynamoDB Enhanced 2.25.28 |
| REST API | Spring Web (MVC) |
| Build Tool | Maven 3 (`mvnw` wrapper) |
| Language | Java 17 + Lombok |
| TLS Auth | PKCS12 keystore (`backend-keystore.p12`) |

### Package Architecture

```
com/
├── config/
│   ├── MqttConfig.java          # MQTT broker connection + SSL factory
│   ├── DynamoDbConfig.java      # AWS DynamoDB Enhanced Client setup
│   ├── WebSocketConfig.java     # STOMP broker + SockJS endpoint
│   └── CorsConfig.java          # CORS origin allowlist
├── messaging/
│   └── MqttReceiver.java        # @ServiceActivator — bridges MQTT → WebSocket
├── service/
│   ├── IRSensorService.java     # Business logic + DynamoDB persistence
│   ├── CrackEventHandler.java   # Event routing
│   └── CrackLocationQueryService.java  # Geo-query for map
├── controller/
│   ├── irsensorController.java  # GET /api/cracks/{deviceId}/{sensorId}
│   ├── CrackLocationController.java    # GET /api/crack-locations
│   └── EspCamController.java    # Camera data endpoints
├── model/
│   └── irsensorData.java        # @DynamoDbBean entity
├── dto/
│   ├── IRSensorDataDTO.java     # MQTT → Java deserialization
│   └── EspCamDetectionDTO.java  # Camera detection DTO
└── repositary/
    └── (DynamoDB repository interfaces)
```

### AWS Services

| Service | Role | Details |
|---------|------|---------|
| **AWS IoT Core** | MQTT Broker | Endpoint: `*.iot.eu-north-1.amazonaws.com:8883`; device policy controls pub/sub |
| **DynamoDB** | Crack Record Store | PK: `SensorID` (LEFT/CENTER/RIGHT) · SK: `timestamp` (ISO-8601) |
| **S3 Bucket** | Image Storage | Keys: `cracks/crack_esp-001_ZONE_millis.jpg`; no public ACL |
| **Lambda** | Pre-sign URL Generator | Python function; generates S3 PUT URLs on GET request |

### DynamoDB Schema

| Attribute | Type | Role |
|-----------|------|------|
| `SensorID` | String | Partition Key (LEFT / CENTER / RIGHT) |
| `timestamp` | String | Sort Key (ISO-8601 format) |
| `deviceId` | String | Device identifier (`esp-001`) |
| `crack_detected` | Boolean | Detection flag |
| `status` | String | `CRITICAL_DEFECT` or `NOMINAL_HEARTBEAT` |
| `image_url` | String | S3 object URL or `No Image (Timeout)` |
| `latitude` | Number | GPS latitude at detection |
| `longitude` | Number | GPS longitude at detection |
| `uptime` | Number | Device uptime in seconds |
| `irSensor` | Number | Minimum ADC reading across zone |

---

## 10. Front-End Technologies

### React Application Stack

| Category | Library | Version | Purpose |
|----------|---------|---------|---------|
| Framework | React + TypeScript | 19 + 5.9 | SPA core |
| Build Tool | Vite | 7.3 | Fast HMR bundler |
| Routing | React Router DOM | v7 | SPA navigation |
| Real-Time | @stomp/stompjs + SockJS | 7.3 + 1.6 | WebSocket live feed |
| HTTP | fetch() + TanStack Query | — + 5.90 | REST + caching |
| Auth | Supabase JS | v2 | JWT authentication |
| Map | Leaflet.js | 1.9.4 | Geo-visualization |
| Charts | Recharts | 3.8 | Analytics graphs |
| UI Components | Radix UI + Tailwind CSS | — + 3.4 | Component system |
| Icons | Lucide React | 0.577 | Icon set |
| PDF Export | jsPDF + html2canvas | 4.2 + 1.4 | Report generation |

### Application Pages

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/dashboard` | Mission Control — 3 device cards, load distribution, live crack feed |
| **Live Map** | `/map` | Leaflet.js with severity-coloured circle markers on OpenStreetMap |
| **Reports** | `/reports` | Daily/Weekly/Monthly tabs; evidence images; one-click PDF export |
| **Login** | `/login` | Supabase email/password auth |
| **Crack Details** | (modal) | Full crack detail modal with S3 image, GPS, severity |

### useTelemetry Hook — Data Architecture

The `useTelemetry(deviceId, sensorId)` hook provides a unified cold + hot data path:

```typescript
// COLD PATH — REST fetch on mount
fetch(`/api/cracks/${deviceId}/${sensorId}`)
  → normalizes DynamoDB types (S, N, BOOL, M, L wrappers)
  → sets initial liveCracks state

// HOT PATH — Real-time WebSocket
STOMP client → /topic/alerts          // IR crack events
             → /topic/camera-detections  // S3 image URLs

// STATE
liveCracks: CrackEvent[]   // newest-first, max 100 events
isConnected: boolean       // WebSocket connection status
```

### Data Visualization

- **Dashboard:** 3 device cards with load percentage bars, animated pulse status indicators
- **Map:** Circle markers coloured RED (severity ≥70%), AMBER (40–70%), BLUE (<40%)
- **Reports:** Crack cards with sensor zone badges (◀ LEFT / ● CENTER / ▶ RIGHT)

---

## 11. Summary

### What RAID Built

| Achievement | Description |
|-------------|-------------|
| ✅ Autonomous Detection Pipeline | End-to-end: IR crack detection → GPS tagging → S3 image → cloud alert → dashboard — fully automated |
| ⚡ Sub-2-Second Alert Latency | MQTT → IoT Core → Spring Boot → WebSocket → React in under 2 seconds |
| 🔒 Zero-Trust Security | mTLS on every hop; no plaintext credentials; pre-signed URLs for camera uploads |
| 📈 Cloud-Native Scalability | DynamoDB + S3 scale automatically; N-device fleet architecture built-in |
| 📊 Rich Operator Dashboard | Real-time map, fleet load balancing view, PDF report export |

### Complete Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Embedded** | ESP32-S3 (Master) + ESP32-CAM ×3, PlatformIO / Arduino framework |
| **Sensors** | IR arrays ×9, GPS NEO-6M (TinyGPS++), OV2640 camera |
| **Actuators** | YXDZ Buzzer, I²C LCD 20×4, GPIO camera triggers |
| **Protocol** | MQTT/TLS 1.2 (QoS 1), HTTPS, WebSocket STOMP/SockJS |
| **Cloud** | AWS IoT Core, DynamoDB, S3, Lambda (eu-north-1) |
| **Backend** | Spring Boot 3.5, Java 17, Spring Integration, Eclipse Paho |
| **Frontend** | React 19, TypeScript, Vite, Leaflet.js, Recharts, Supabase |
| **Mapping** | Leaflet.js + OpenStreetMap |
| **Export** | jsPDF + html2canvas |

---

> **University of Peradeniya — Department of Computer Engineering — E/21 Batch · 2026**
> 
> Repository: `cepdnaclk/e21-3yp-RAID`
