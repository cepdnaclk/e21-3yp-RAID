"""
AWS Lambda — crack_handler.py
==========================================
Triggered by: AWS IoT Rules Engine
  Rule SQL:   SELECT * FROM 'railway/cracks'
  Action:     Lambda invocation

Writes to DynamoDB using EXACTLY the attribute names declared in
irsensorData.java via @DynamoDbAttribute so Spring Boot can deserialise
items without any remapping.

DynamoDB table:
  Table name:    ir_cracks_detection
  Partition key: SensorID   (String)   ← @DynamoDbPartitionKey @DynamoDbAttribute("SensorID")
  Sort key:      timestamp  (String)   ← @DynamoDbSortKey     @DynamoDbAttribute("timestamp")

Mapped attributes (irsensorData.java):
  SensorID       → getSensorId()      @DynamoDbAttribute("SensorID")
  timestamp      → getTimestamp()     @DynamoDbAttribute("timestamp")
  deviceId       → getDeviceId()      @DynamoDbAttribute("deviceId")
  crack_detected → isCrackDetected()  @DynamoDbAttribute("crack_detected")
  status         → getStatus()        @DynamoDbAttribute("status")
  image_url      → getImageUrl()      @DynamoDbAttribute("image_url")
  uptime         → getUptime()        @DynamoDbAttribute("uptime")
  latitude       → getLatitude()      @DynamoDbAttribute("latitude")
  longitude      → getLongitude()     @DynamoDbAttribute("longitude")

NOTE: 'severity' is NOT a field in irsensorData.java — it is intentionally
      omitted from the DynamoDB item so the backend can read items cleanly.
"""

import json
import os
import time
import boto3
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation

# ── DynamoDB setup ────────────────────────────────────────────────────────────
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'ir_cracks_detection')
table = dynamodb.Table(TABLE_NAME)

# ── Telegram alert (optional) ─────────────────────────────────────────────────
TELEGRAM_TOKEN = os.environ.get('TELEGRAM_TOKEN', '8453673141:AAHxgehOW__-7LuVvlmm7xqpEcW9zXRj3QA')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID', '1681826822')

def send_telegram(message: str) -> None:
    """Fire-and-forget Telegram notification. Failures are logged, not raised."""
    try:
        safe_message = urllib.parse.quote(message)
        url = (
            f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
            f"?chat_id={TELEGRAM_CHAT_ID}&text={safe_message}"
        )
        urllib.request.urlopen(url, timeout=5)
    except Exception as exc:
        print(f"[WARNING] Telegram notification failed: {exc}")


def to_decimal(value, default: str = "0.0") -> Decimal:
    """Safely convert any numeric-ish value to a Decimal for DynamoDB."""
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return Decimal(default)


def lambda_handler(event, context):
    try:
        print("[INFO] Incoming event:", json.dumps(event))

        # ── 1. SensorID (Partition Key) ───────────────────────────────────────
        # Accept multiple key spellings the ESP32 firmware might send.
        sensor_id = (
            event.get("SensorID")
            or event.get("sensorId")
            or event.get("sensor_id")
            or event.get("CrackID")
            or event.get("crack_id")
            or f"unknown_sensor_{int(time.time())}"
        )

        # ── 2. timestamp (Sort Key) ───────────────────────────────────────────
        raw_ts = event.get("timestamp") or event.get("Timestamp") or ""
        timestamp = raw_ts if raw_ts else datetime.now(timezone.utc).isoformat()

        # ── 3. deviceId ───────────────────────────────────────────────────────
        device_id = event.get("deviceId") or event.get("device_id") or "unknown_device"

        # ── 4. crack_detected (boolean) ───────────────────────────────────────
        crack_detected = bool(
            event.get("crackDetected", event.get("crack_detected", True))
        )

        # ── 5. status ─────────────────────────────────────────────────────────
        status = str(event.get("status", "CRACK"))

        # ── 6. image_url ──────────────────────────────────────────────────────
        image_url = str(event.get("image_url") or event.get("imageUrl") or "")

        # ── 7. uptime (integer seconds) ───────────────────────────────────────
        try:
            uptime = int(event.get("uptime", 0))
        except (TypeError, ValueError):
            uptime = 0

        # ── 8. latitude / longitude ───────────────────────────────────────────
        location = event.get("location", {})

        raw_lat = (
            event.get("lat")
            or event.get("latitude")
            or location.get("lat")
            or location.get("latitude")
            or 0.0
        )
        raw_lng = (
            event.get("lng")
            or event.get("longitude")
            or location.get("lng")
            or location.get("longitude")
            or 0.0
        )

        latitude = to_decimal(raw_lat)
        longitude = to_decimal(raw_lng)

        # ── 9. Build DynamoDB item ─────────────────────────────────────────────
        # Attribute names MUST match @DynamoDbAttribute values in irsensorData.java
        # exactly — including capitalisation — so Spring Boot can read them back.
        item = {
            "SensorID":      sensor_id,      # PK  — @DynamoDbAttribute("SensorID")
            "timestamp":     timestamp,      # SK  — @DynamoDbAttribute("timestamp")
            "deviceId":      device_id,      #      @DynamoDbAttribute("deviceId")
            "crack_detected": crack_detected, #     @DynamoDbAttribute("crack_detected")
            "status":        status,         #      @DynamoDbAttribute("status")
            "image_url":     image_url,      #      @DynamoDbAttribute("image_url")
            "uptime":        uptime,         #      @DynamoDbAttribute("uptime")
            "latitude":      latitude,       #      @DynamoDbAttribute("latitude")
            "longitude":     longitude,      #      @DynamoDbAttribute("longitude")
            # NOTE: 'severity' is intentionally excluded — no matching field
            #        exists in irsensorData.java.
        }

        # Remove empty strings — DynamoDB rejects them as attribute values
        item = {k: v for k, v in item.items() if v != ""}

        # ── 10. Write to DynamoDB ─────────────────────────────────────────────
        print(f"[INFO] Writing to DynamoDB table '{TABLE_NAME}': {item}")
        table.put_item(Item=item)
        print(f"[SUCCESS] Saved → SensorID={sensor_id} | timestamp={timestamp}")

        # ── 11. Telegram alert ────────────────────────────────────────────────
        alert = (
            f"🚨 Crack Detected!\n"
            f"Sensor:  {sensor_id}\n"
            f"Device:  {device_id}\n"
            f"Status:  {status}\n"
            f"Lat: {latitude}, Lng: {longitude}"
        )
        if image_url:
            alert += f"\nImage: {image_url}"
        send_telegram(alert)

        return {"statusCode": 200, "body": json.dumps("Success")}

    except Exception as exc:
        print(f"[ERROR] Failed to process event: {exc}")
        raise  # Re-raise so Lambda marks invocation as failed → triggers retry/DLQ
