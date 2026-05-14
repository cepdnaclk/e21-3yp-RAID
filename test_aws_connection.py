#!/usr/bin/env python3
"""
AWS IoT Connection Diagnostic Script
Tests certificate validity and endpoint connectivity before full MQTT connection
"""
import os
import sys
import socket
from datetime import datetime
from pathlib import Path
from cryptography import x509
from cryptography.hazmat.backends import default_backend

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_CA = os.path.join(BASE_DIR, "AmazonRootCA1.pem")
CERT_FILE = os.path.join(BASE_DIR, "certificate.pem.crt")
KEY_FILE = os.path.join(BASE_DIR, "private.pem.key")
IOT_ENDPOINT = "a141eqbs4ue48l-ats.iot.eu-north-1.amazonaws.com"
IOT_PORT = 8883

print("=" * 70)
print("AWS IoT Connection Diagnostic")
print("=" * 70)

# 1. Check certificate files exist
print("\n[1] Certificate Files Check:")
files_ok = True
for name, path in [("Root CA", ROOT_CA), ("Client Cert", CERT_FILE), ("Private Key", KEY_FILE)]:
    exists = os.path.isfile(path)
    status = "✓" if exists else "✗"
    print(f"  {status} {name}: {path}")
    if not exists:
        files_ok = False

if not files_ok:
    print("\n❌ Missing certificate files. You need:")
    print("   1. Download from AWS IoT Core → Certificates → Your Cert → Download")
    print("   2. Place files in: src/ directory")
    sys.exit(1)

# 2. Validate certificate dates
print("\n[2] Certificate Validity Check:")
try:
    with open(CERT_FILE, 'rb') as f:
        cert_data = x509.load_pem_x509_certificate(f.read(), default_backend())
        not_before = cert_data.not_valid_before
        not_after = cert_data.not_valid_after
        now = datetime.utcnow()
        
        print(f"  Valid From: {not_before}")
        print(f"  Valid To:   {not_after}")
        print(f"  Current:    {now}")
        
        if now < not_before:
            print(f"  ✗ Certificate not yet valid! (starts in {(not_before - now).days} days)")
        elif now > not_after:
            print(f"  ✗ Certificate EXPIRED! (expired {(now - not_after).days} days ago)")
        else:
            days_left = (not_after - now).days
            print(f"  ✓ Certificate valid ({days_left} days remaining)")
except Exception as e:
    print(f"  ✗ Error reading certificate: {e}")

# 3. Check endpoint format
print("\n[3] Endpoint Validation:")
print(f"  Endpoint: {IOT_ENDPOINT}")
print(f"  Port:     {IOT_PORT}")

if not IOT_ENDPOINT.endswith('.amazonaws.com'):
    print(f"  ⚠ Warning: Endpoint doesn't look like AWS IoT format")
    print(f"    Expected format: xxxxx-ats.iot.REGION.amazonaws.com")

# 4. Network connectivity test (DNS + port)
print("\n[4] Network Connectivity Test:")
try:
    # Try DNS resolution
    print(f"  Resolving {IOT_ENDPOINT}...")
    ip_address = socket.gethostbyname(IOT_ENDPOINT)
    print(f"  ✓ DNS resolved to: {ip_address}")
    
    # Try port connectivity (don't use TLS, just raw socket)
    print(f"  Testing port {IOT_PORT} connectivity...")
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(5)
    try:
        result = sock.connect_ex((IOT_ENDPOINT, IOT_PORT))
        sock.close()
        if result == 0:
            print(f"  ✓ Port {IOT_PORT} is reachable")
        else:
            print(f"  ✗ Port {IOT_PORT} is NOT reachable (blocked by firewall?)")
    except Exception as e:
        print(f"  ✗ Connection test failed: {e}")
        
except socket.gaierror as e:
    print(f"  ✗ DNS resolution failed: {e}")
    print(f"    Check that the endpoint is correct and AWS region is reachable")
except Exception as e:
    print(f"  ✗ Network test failed: {e}")

print("\n" + "=" * 70)
print("Fix Checklist:")
print("=" * 70)
print("""
1. ✓ Verify endpoint is correct:
   - Go to AWS IoT Core → Settings → Device data endpoint
   - Copy the exact endpoint and paste in mock_esp32.py

2. ✓ Verify certificates are valid:
   - AWS IoT Core → Manage → Certificates
   - Click your certificate → Check Status (should be ACTIVE)
   - Download fresh certificates if needed

3. ✓ Verify certificate/endpoint match:
   - The certificate must be created FOR this specific endpoint/region
   - You can't use certificates from one region in another

4. ✓ Check firewall/network:
   - Port 8883 must be open (AWS IoT Core uses this)
   - VPN or corporate network might block it

5. ✓ Check AWS IoT Policy:
   - Attach policy to certificate allowing: iot:Connect, iot:Publish, iot:Subscribe
""")
