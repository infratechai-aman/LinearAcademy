"""
Database connection module for Linear Academy API.
Supports PostgreSQL for production (Vercel + Hostinger) and SQLite for local development.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get database URL from environment variable
# For Hostinger PostgreSQL: postgresql://user:password@host:5432/linear_academy
# For local development: sqlite:///./linear_academy.db
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./linear_academy.db")

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
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    print(f"Failed to connect to database: {e}")

Base = declarative_base()

def get_db():
    if SessionLocal is None:
        raise Exception("Database connection is not available")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
