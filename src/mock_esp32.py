import os
import sys
import time
import json
import random
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

# ----------------- Certificate Check -----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_CA = os.path.join(BASE_DIR, "AmazonRootCA1.pem")
CERT_FILE = os.path.join(BASE_DIR, "certificate.pem.crt")
KEY_FILE = os.path.join(BASE_DIR, "private.pem.key")

for path in (ROOT_CA, CERT_FILE, KEY_FILE):
    if not os.path.isfile(path):
        print(f"Error: certificate/key file not found at {path}")
        sys.exit(1)

print("All certificate files found!")

# ----------------- MQTT Setup -----------------
IOT_ENDPOINT = "a141eqbs4ue48l-ats.iot.eu-north-1.amazonaws.com"  # replace this
CLIENT_ID = "mockESP32"
TOPIC = "device/esp32/data"

client = AWSIoTMQTTClient(CLIENT_ID)
client.configureEndpoint(IOT_ENDPOINT, 8883)
client.configureCredentials(ROOT_CA, KEY_FILE, CERT_FILE)
client.configureOfflinePublishQueueing(-1)  # Infinite offline queue
client.configureDrainingFrequency(2)  # 2 Hz
client.configureConnectDisconnectTimeout(10)  # 10 sec
client.configureMQTTOperationTimeout(5)  # 5 sec

try:
    client.connect()
    print("Connected to AWS IoT!")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Failed to connect: {e}")
    sys.exit(1)

# ----------------- Publish Mock Data Continuously -----------------
count = 0
try:
    while True:
        payload = {
            "deviceId": "esp-001",
            "temperature": round(20 + random.random()*5, 2),
            "humidity": round(40 + random.random()*10, 2),
            "uptime": count * 5
        }
        try:
            client.publish(TOPIC, json.dumps(payload), 1)
            print(f"[{time.strftime('%H:%M:%S')}] Published: {payload}")
        except Exception as e:
            print(f"Failed to publish: {e}")

        count += 1
        time.sleep(5)  # wait 5 seconds before next publish

except KeyboardInterrupt:
    print("Stopped by user")

finally:
    client.disconnect()
    print("Disconnected from AWS IoT")