"""
Minimal test endpoint to verify Vercel Python runtime is working.
"""
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok", "message": "API is running"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.post("/api/login")
def login():
    return {"access_token": "test-token", "token_type": "bearer"}

# Vercel handler
handler = app
