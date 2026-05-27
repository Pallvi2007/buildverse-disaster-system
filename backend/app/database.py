# """
# BuildVerse Disaster Management Engine - Database Core Connectivity
# File: backend/app/database.py
# """

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Pull the auto-validated, driver-patched connection string from config settings
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# Handle database engine parameters conditionally based on driver type
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    # SQLite requires 'check_same_thread' False for FastAPI's multi-threaded requests
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    # Production databases like PostgreSQL handle pooling natively
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Configure the thread-safe session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class mapping Python objects to SQL schemas
Base = declarative_base()