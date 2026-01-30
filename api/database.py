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
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # PostgreSQL settings
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
