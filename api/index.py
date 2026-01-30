from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World - Backend is ALIVE"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.post("/api/login")
def login():
    return {"access_token": "fake-token", "token_type": "bearer"}

# Vercel handler
handler = app
