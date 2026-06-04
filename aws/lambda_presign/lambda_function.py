"""
lambda_presign/lambda_function.py
-----------------------------------
Pre-signed S3 PUT URL generator for the RAID camera pipeline.

Flow:
  ESP32-S3 Master  ─── HTTPS GET /presign?key=cracks/<crack_id>.jpg ───▶  This Lambda
  This Lambda       ─── 200 OK, plain-text URL ───────────────────────▶  Master
  Master            ─── MQTT cam_cmd/<ZONE> {crack_id, presigned_url} ─▶  ESP32-CAM
  ESP32-CAM         ─── HTTPS PUT <presigned_url>  (image/jpeg body)  ─▶  S3 Bucket
  ESP32-CAM         ─── MQTT camera_url {crack_id, image_url}         ─▶  Master
  Master            ─── MQTT IR_Bottom  (unified payload)              ─▶  IoT Core → Lambda → DynamoDB

Deploy as a Lambda Function URL (no API Gateway needed):
  1. Create Lambda with this code.
  2. Enable Function URL → Auth type = NONE (the URL is short-lived and not secret).
  3. Paste the Function URL into PRESIGN_LAMBDA_URL in main.cpp.
  4. Attach an IAM policy that grants s3:PutObject on the bucket.

Required IAM policy for this Lambda's execution role:
  {
    "Effect": "Allow",
    "Action": "s3:PutObject",
    "Resource": "arn:aws:s3:::railway-system-photos-01-533350584731-eu-north-1-an/cracks/*"
  }
"""

import json
import boto3
from urllib.parse import parse_qs
from botocore.exceptions import ClientError

s3 = boto3.client("s3")

# ── Configuration ────────────────────────────────────────────────────────────
BUCKET_NAME       = "railway-system-photos-01-533350584731-eu-north-1-an"
ALLOWED_PREFIX    = "cracks/"          # Only sign keys under this prefix
EXPIRATION_SECS   = 120               # 2 minutes — plenty of time for ESP32-CAM to upload
MAX_KEY_LENGTH    = 200


def _parse_key(event: dict) -> str | None:
    """Extract the 'key' query parameter from both Function URL and API GW v1/v2 formats."""
    # Lambda Function URL (HTTP API) sends rawQueryString
    raw_qs = event.get("rawQueryString", "")
    if raw_qs:
        params = parse_qs(raw_qs)
        keys = params.get("key", [])
        return keys[0] if keys else None

    # API Gateway v1 and v2
    qsp = event.get("queryStringParameters") or {}
    return qsp.get("key")


def lambda_handler(event, context):
    """
    GET /presign?key=cracks/crack_esp-001_<millis>.jpg
    Returns a pre-signed S3 PUT URL as plain text (Content-Type: text/plain).
    The ESP32 reads this with http.getString() directly.
    """
    print("[PRESIGN] Event:", json.dumps(event, default=str))

    # ── 1. Extract & validate the key ────────────────────────────────────────
    object_key = _parse_key(event)

    if not object_key:
        return {"statusCode": 400, "body": "Missing 'key' query parameter"}

    # Sanitize: no traversal, must be under allowed prefix, reasonable length
    if (
        ".." in object_key
        or object_key.startswith("/")
        or not object_key.startswith(ALLOWED_PREFIX)
        or len(object_key) > MAX_KEY_LENGTH
    ):
        print(f"[PRESIGN] Rejected key: {object_key!r}")
        return {"statusCode": 400, "body": f"Invalid key. Must start with '{ALLOWED_PREFIX}'"}

    # ── 2. Generate pre-signed PUT URL ───────────────────────────────────────
    try:
        presigned_url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket":      BUCKET_NAME,
                "Key":         object_key,
                "ContentType": "image/jpeg",
            },
            ExpiresIn=EXPIRATION_SECS,
            HttpMethod="PUT",
        )
        print(f"[PRESIGN] ✅ Signed URL for key='{object_key}' (expires in {EXPIRATION_SECS}s)")
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*",   # CORS: safe because URL is ephemeral
            },
            "body": presigned_url,
        }

    except ClientError as e:
        print(f"[PRESIGN] ❌ S3 ClientError: {e}")
        return {"statusCode": 500, "body": f"S3 Error: {str(e)}"}
    except Exception as e:
        print(f"[PRESIGN] ❌ Unexpected error: {e}")
        return {"statusCode": 500, "body": str(e)}
