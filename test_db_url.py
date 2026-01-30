from sqlalchemy import create_engine
import os

# Simulating the user's environment variable with @ in password
url = "postgresql://LinearAcademy:Macbook@M4@192.168.1.1:5432/linear_academy"
print(f"Testing URL: {url}")

try:
    engine = create_engine(url)
    print("Engine created successfully (unexpectedly)")
    # Try to connect (this will fail due to fake IP, but we want to see if create_engine itself crashes or parses wrong)
    try:
        engine.connect()
    except Exception as e:
        print(f"Connection failed as expected, but engine creation worked: {e}")
except Exception as e:
    print(f"CRASH: create_engine failed: {e}")
