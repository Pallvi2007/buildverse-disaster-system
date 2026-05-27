# """
# BuildVerse Disaster Management Engine - Production Observability Layer
# File: backend/app/logger.py

# This module configures the system logging engine using Loguru. It provides unified
# telemetry streaming, structures JSON formatting for production log aggregators 
# (ELK, Splunk, Datadog), establishes thread-safe file rotation for local forensic 
# auditing, and intercepts standard Python logging to ensure full platform observability.
# """

import os
import sys
import logging
from typing import List, Final, Dict, Any
from loguru import logger

from app.config import settings


class InterceptHandler(logging.Handler):
    """
    Standard Python Logging Interceptor.
    
    Intercepts logs from external third-party libraries (like Uvicorn, FastAPI, HTTPX)
    and transparently routes them through Loguru to guarantee a unified log format.
    """
    def emit(self, record: logging.LogRecord) -> None:
        # Get corresponding Loguru level if it exists
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find caller from where the logged message originated
        frame = logging.currentframe()
        depth = 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


def configure_production_logging() -> None:
    """
    Compiles and registers multi-sink telemetry log channels based on active
    deployment environment parameters.
    """
    # 1. Clear default pre-configured console log routes to prevent duplicate logs
    logger.remove()

    # Read system log filtering depth dynamically from central configurations
    assigned_log_level: Final[str] = settings.LOG_LEVEL

    # 2. CHANNEL A: SYSTEM CONSOLE STREAM (stdout)
    # Optimized configuration choosing between structured JSON or clean color-coded text
    if settings.is_production:
        # Production Sink: Streams structured JSON to stdout for instant cloud collection
        logger.add(
            sys.stdout,
            level=assigned_log_level,
            serialize=True,  # Packs logs into single-line JSON strings
            backtrace=False, # Disable heavy stack dumps in production prose logs
            diagnose=False   # Prevent sensitive variable values from leaking into production logs
        )
    else:
        # Development Sink: Formats human-readable, color-coded text for clear terminal debugging
        development_format: Final[str] = (
            "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
            "<level>{message}</level>"
        )
        logger.add(
            sys.stdout,
            level="DEBUG",  # Enforce deep observability during local development
            format=development_format,
            colorize=True
        )

    # 3. CHANNEL B: LOCAL PERSISTENT FILE SINK (The "Black Box" Audit Ledger)
    # Maintains thread-safe local backup files with automated size constraints and aging retention
    try:
        # Establish relative directory destination for persistent files
        log_directory: Final[str] = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
            "logs"
        )
        os.makedirs(log_directory, exist_ok=True)
        log_file_path: Final[str] = os.path.join(log_directory, "disaster_ops.log")

        logger.add(
            log_file_path,
            level="DEBUG",
            rotation="500 MB",     # Creates a new file automatically once size reaches 500MB
            retention="10 days",   # Clears out log historical archives older than 10 days
            compression="zip",     # Compresses archived logs to save storage space
            serialize=not settings.is_production, # Local file records use JSON only in development
            enqueue=True,          # Uses an asynchronous worker thread to prevent logging from slowing down requests
            backtrace=True,
            diagnose=True
        )
    except Exception as storage_err:
        # Non-fatal warning; allow system container execution to proceed using console streams
        logger.warning(f"[LOGGING-SETUP] Local file system logging disabled due to write restrictions: {storage_err}")

    # 4. OVERRIDE THIRD-PARTY LOGGERS
    # Force external packages to route through our InterceptHandler
    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)
    
    # Standardize explicit tracking sub-packages
    for framework_logger_name in ("uvicorn", "uvicorn.access", "uvicorn.error", "fastapi", "httpx"):
        target_logger = logging.getLogger(framework_logger_name)
        target_logger.handlers = [InterceptHandler()]
        target_logger.propagate = False

    logger.success(
        f"[OBSERVABILITY] System telemetry initialized. Mode: "
        f"{'PRODUCTION [JSON/STDOUT]' if settings.is_production else 'DEVELOPMENT [COLOR/TERMINAL]'}"
    )


# Trigger configuration routine immediately upon module loading
configure_production_logging()

# Expose global application logger instance matching your project conventions
get_logger = lambda: logger
__all__: Final[List[str]] = ["get_logger", "logger"]