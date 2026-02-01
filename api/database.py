"""
Database connection module for Linear Academy API.
Supports PostgreSQL for production (Vercel + Hostinger) and SQLite for local development.
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException, status

# Get database URL from environment variable
# Defaults to SQLite only if DATABASE_URL is explicitly missing
# In production (Vercel), DATABASE_URL should be set to the PostgreSQL URL
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    print("WARNING: DATABASE_URL not found. Defaulting to local SQLite.")
    DATABASE_URL = "sqlite:///./linear_academy.db"

# Handle special case for some PostgreSQL URLs (Vercel/Heroku format)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine with appropriate settings
engine = None
SessionLocal = None

try:
    if DATABASE_URL.startswith("sqlite"):
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    else:
        # PostgreSQL settings
        try:
            # pool_pre_ping=True helps verify connections before using them
            engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=10, max_overflow=20)
        except Exception as e:
            print(f"Failed to create PostgreSQL engine: {e}")
            engine = None
    
    if engine:
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    else:
        SessionLocal = None
except Exception as e:
    print(f"Critical Database Error: {e}")

Base = declarative_base()

def get_db():
    if SessionLocal is None:
        print("ERROR: Database session could not be created (SessionLocal is None).")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection is currently unavailable. Please try again later."
        )
    
    db = SessionLocal()
    try:
        # Optional: verify connection is actually alive
        # db.execute(text("SELECT 1"))
        yield db
    except Exception as e:
        print(f"Database session error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="Database operation failed"
        )
    finally:
        db.close()
