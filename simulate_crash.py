import os
import sys

# Simulate the Vercel environment with the problematic connection string
os.environ["DATABASE_URL"] = "postgresql://LinearAcademy:Macbook@M4@192.168.1.1:5432/linear_academy"

print(" Attempting to import api.index with bad DATABASE_URL...")

try:
    # We need to make sure we can import from the api folder
    # Assuming this script is run from the root 'linear-classes' folder
    from api import index
    print(" Import SUCCESS! App loaded without crashing.")
except Exception as e:
    print(" CRASHED on import!")
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
