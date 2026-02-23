import os
import firebase_admin
from firebase_admin import credentials, firestore, auth

init_error = None

def initialize_firebase():
    global init_error
    if not firebase_admin._apps:
        try:
            # First check for an environment variable (used in Vercel)
            firebase_creds_str = os.environ.get("FIREBASE_CREDENTIALS")
            
            if firebase_creds_str:
                import json
                cred_dict = json.loads(firebase_creds_str)
                cred = credentials.Certificate(cred_dict)
                print("Firebase Admin initialized from environment variable.")
            else:
                # Fallback to local file
                cred_path = os.path.join(os.path.dirname(__file__), "firebase_credentials.json")
                cred = credentials.Certificate(cred_path)
                print("Firebase Admin initialized from local JSON file.")
                
            firebase_admin.initialize_app(cred)
        except Exception as e:
            import traceback
            init_error = traceback.format_exc()
            print(f"Error initializing Firebase: {e}")

# Initialize when imported
initialize_firebase()

def get_db():
    try:
        return firestore.client()
    except Exception as e:
        print(f"Error getting Firestore client: {e}")
        return None
