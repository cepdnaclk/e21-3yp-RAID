# import os
# import sys
# import time
# import json
# import random
# from datetime import datetime
# from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

# # ----------------- Certificate Check -----------------
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# ROOT_CA = os.path.join(BASE_DIR, "AmazonRootCA1.pem")
# CERT_FILE = os.path.join(BASE_DIR, "certificate.pem.crt")
# KEY_FILE = os.path.join(BASE_DIR, "private.pem.key")

# for path in (ROOT_CA, CERT_FILE, KEY_FILE):
#     if not os.path.isfile(path):
#         print(f"Error: certificate/key file not found at {path}")
#         sys.exit(1)

# print("All certificate files found!")

# # ----------------- MQTT Setup -----------------
# IOT_ENDPOINT = "a141eqbs4ue48l-ats.iot.eu-north-1.amazonaws.com"  # replace this
# CLIENT_ID = "esp32"
# DEVICE_ID = "esp-001"
# # Upgraded to the double wildcard format we set in the AWS Rule!
# TOPIC = f"device/{DEVICE_ID}/IR_Bottom"

# client = AWSIoTMQTTClient(CLIENT_ID)
# client.configureEndpoint(IOT_ENDPOINT, 8883)
# client.configureCredentials(ROOT_CA, KEY_FILE, CERT_FILE)
# client.configureOfflinePublishQueueing(-1)
# client.configureDrainingFrequency(2)
# client.configureConnectDisconnectTimeout(10)
# client.configureMQTTOperationTimeout(20)

# try:
#     client.connect()
#     print("Connected to AWS IoT!")
# except Exception as e:
#     import traceback
#     traceback.print_exc()
#     print(f"Failed to connect: {e}")
#     sys.exit(1)

# # ----------------- The Hybrid Heartbeat Architecture -----------------
# count = 0
# HEARTBEAT_INTERVAL = 30  # Seconds between routine check-ins

# # Initialize timer so it forces a heartbeat immediately on boot
# last_heartbeat_time = time.time() - HEARTBEAT_INTERVAL 

# print("\n🚀 Starting Edge Filtering Node...")
# print(f"Scanning track continuously. Heartbeat interval: {HEARTBEAT_INTERVAL}s\n")

# try:
#     while True:
#         # 1. The Fast Loop: Simulate the ESP32 checking the IR sensor incredibly fast
#         # (We use a 5% chance to simulate a rare crack on the track)
#         is_crack_detected = random.random() > 0.95 
#         current_time = time.time()

#         # SCENARIO A: The Interrupt (Immediate Critical Alert)
#         if is_crack_detected:
#             payload = {
#                 "deviceId": DEVICE_ID,
#                 "timestamp": datetime.now().isoformat(),
#                 "sensor": "IR_Bottom",
#                 "crack_detected": True,
#                 "status": "CRITICAL_DEFECT",
#                 "uptime": count
#             }
#             try:
#                 client.publish(TOPIC, json.dumps(payload), 1)
#                 print(f"[{time.strftime('%H:%M:%S')}] 🚨 CRITICAL ALERT PUBLISHED: {payload}")
                
#                 # Reset the heartbeat timer! We just proved the robot is alive.
#                 last_heartbeat_time = current_time
#             except Exception as e:
#                 print(f"Failed to publish alert: {e}")

#         # SCENARIO B: The Routine Heartbeat (Only runs if 30 seconds have passed)
#         elif (current_time - last_heartbeat_time) >= HEARTBEAT_INTERVAL:
#             payload = {
#                 "deviceId": DEVICE_ID,
#                 "timestamp": datetime.now().isoformat(),
#                 "sensor": "IR_Bottom",
#                 "crack_detected": False,
#                 "status": "NOMINAL_HEARTBEAT",
#                 "battery": random.randint(70, 100), # Dummy hardware data
#                 "speed": random.randint(10, 15),
#                 "uptime": count
#             }
#             try:
#                 client.publish(TOPIC, json.dumps(payload), 1)
#                 print(f"[{time.strftime('%H:%M:%S')}] 💚 Heartbeat Check-in: {payload}")
                
#                 last_heartbeat_time = current_time
#             except Exception as e:
#                 print(f"Failed to publish heartbeat: {e}")

#         count += 1
        
#         # Sleep for just 1 second. 
#         # This keeps the loop fast enough to catch cracks instantly,
#         # but prevents the Python script from maxing out your computer's CPU.
#         time.sleep(1)

# except KeyboardInterrupt:
#     print("\nStopped by user")

# finally:
#     client.disconnect()
#     print("Disconnected from AWS IoT")




import os
import sys
import time
import json
import random
import boto3
from datetime import datetime, timezone
from botocore.exceptions import ClientError
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

# ----------------- AWS & Hardware Configuration -----------------
IOT_ENDPOINT = "a141eqbs4ue48l-ats.iot.eu-north-1.amazonaws.com"
CLIENT_ID = "main_esp32_master"
DEVICE_ID = "ESP_HUB_MASTER"
TOPIC_DETECTION = "railway/cracks"
BUCKET_NAME = "rail-crack-photos"
REGION = "eu-north-1"

# Physical Calibration
ROBOT_SPEED_CMS = 10.0  # Robot moves at 10cm per second
SENSOR_GAP_CM = 5.0     # 5cm gap between IR sensor and Camera lens
OFFSET_DELAY = SENSOR_GAP_CM / ROBOT_SPEED_CMS # 0.5s delay

# ----------------- Certificate Check -----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_CA = os.path.join(BASE_DIR, "AmazonRootCA1.pem")
CERT_FILE = os.path.join(BASE_DIR, "certificate.pem.crt")
KEY_FILE = os.path.join(BASE_DIR, "private.pem.key")

for path in (ROOT_CA, CERT_FILE, KEY_FILE):
    if not os.path.isfile(path):
        print(f"Error: certificate file not found at {path}")
        sys.exit(1)

# ----------------- S3 Pre-signed URL Helper -----------------
def create_presigned_url(object_name, expiration=300):
    """Generate a pre-signed URL to share with a Camera Node"""
    s3_client = boto3.client('s3', region_name=REGION)
    try:
        response = s3_client.generate_presigned_url('put_object',
                                                    Params={'Bucket': BUCKET_NAME,
                                                            'Key': object_name,
                                                            'ContentType': 'image/jpeg'},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        print(f"Error generating URL: {e}")
        return None
    return response

# ----------------- MQTT Setup -----------------
client = AWSIoTMQTTClient(CLIENT_ID)
client.configureEndpoint(IOT_ENDPOINT, 8883)
client.configureCredentials(ROOT_CA, KEY_FILE, CERT_FILE)

# Increase connection timeout and add retry logic
client.configureConnectDisconnectTimeout(30)  # 30 second timeout (was default 10s)
client.configureMQTTOperationTimeout(20)      # 20 second MQTT operation timeout
client.configureOfflinePublishQueueing(-1)    # Unlimited queue
client.configureDrainingFrequency(2)           # Drain queued messages every 2 seconds

print(f"📡 Connecting to AWS IoT Core...")
print(f"   Endpoint: {IOT_ENDPOINT}")
print(f"   Client ID: {CLIENT_ID}")
print(f"   Timeout: 30 seconds")

try:
    client.connect()
    print("✅ Master ESP32 Connected to AWS IoT!")
except Exception as e:
    print(f"\n❌ Connection Failed: {e}")
    print("\nTroubleshooting steps:")
    print("1. Run: python test_aws_connection.py  (diagnostic script)")
    print("2. Verify endpoint is correct in AWS IoT Core → Settings")
    print("3. Verify certificates are ACTIVE and in src/ directory")
    print("4. Check that certificates match this endpoint/region")
    sys.exit(1)

# ----------------- Simulation Loop -----------------
current_lat = 6.9271
current_lng = 79.8612

print(f"\n🚀 Simulation Running: Gap Delay={OFFSET_DELAY}s")
print("Robot is patrolling tracks. Waiting for IR trigger...\n")

try:
    while True:
        # Simulate robot movement
        current_lat += random.uniform(0.00001, 0.00003)
        current_lng += random.uniform(0.00001, 0.00003)
 # 5% chance of crack detection
        if random.random() > 0.95:
            triggering_cam = random.choice(["LEFT", "CENTER", "RIGHT"])
            
            print(f"\n🚨 [IR TRIGGER] {triggering_cam} side detected an anomaly!")
            print(f"⏳ Aligning Camera (Offset Delay: {OFFSET_DELAY}s)...")
            
            # 1. Physics Delay (Waiting for camera to reach the crack spot)
            time.sleep(OFFSET_DELAY)
            
            # 2. Halt & Snapshot
            print(f"🛑 BRAKES APPLIED. Locking GPS Coordinates.")
            locked_lat = round(current_lat, 6)
            locked_lng = round(current_lng, 6)
            
            # 3. Generate Filename and S3 Permission
            ts_obj = datetime.now(timezone.utc)
            timestamp_str = ts_obj.isoformat()
            file_name = f"crack_{ts_obj.strftime('%Y%m%d_%H%M%S')}_{triggering_cam.lower()}.jpg"
            
            upload_url = create_presigned_url(file_name)
            
            if upload_url:
                print(f"🔗 Pre-signed URL generated for {triggering_cam} Camera.")
                # print(f"DEBUG URL: {upload_url}") # Uncomment to see the full "Pass"
                
                # 4. Simulate the Camera Node uploading the photo
                print(f"📸 Camera Node uploading {file_name} directly to S3...")
                time.sleep(2.0) 
                
                # 5. Build Payload aligned with your DynamoDB Schema
                payload = {
                    "SensorID": triggering_cam,             # Matches Partition Key
                    "timestamp": timestamp_str,             # Matches Sort Key
                    "crack_id": file_name.replace(".jpg", ""),
                    "deviceId": DEVICE_ID,
                    "image_url": f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{file_name}",
                    "latitude": locked_lat,
                    "longitude": locked_lng,
                    "status": "CRITICAL",
                    "crack_detected": True,
                    "severity": random.randint(7, 10)
                }
                
                # 6. Publish to IoT Core
                client.publish(TOPIC_DETECTION, json.dumps(payload), 1)
                print(f"📡 Metadata Published to {TOPIC_DETECTION}. AWS Rule will trigger Lambda.")
                print(f"🟢 RESUMING PATROL...\n")
            else:
                print("❌ S3 Authorization failed. Data not sent.")

        time.sleep(1) # Simulated scan frequency

except KeyboardInterrupt:
    print("\n🛑 Simulation stopped by user.")
finally:
    client.disconnect()
    print("Disconnected.")