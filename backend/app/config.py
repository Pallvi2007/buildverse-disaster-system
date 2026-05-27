# """
# BuildVerse Disaster Management Engine - Central Configuration Architecture
# File: backend/app/config.py

# This module establishes the single source of truth for application settings. 
# Using Pydantic Settings, it securely handles environment variable parsing, 
# runs strict type casting validations at engine startup, manages system security 
# credentials, and isolates staging/production runtime modes.
# """

from typing import List, Dict, Any, Final, Optional
from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from loguru import logger


class Settings(BaseSettings):
    """
    Enterprise Application Settings Manager.
    
    Loads configuration settings directly from system environment variables or local 
    cross-root configuration files, injecting deep security defaults and automated
    validation safeguards into the app runtime environment.
    """
    
    # --- ENVIRONMENT ENVIRONMENT IDENTIFIER ---
    ENVIRONMENT: str = Field(
        default="development",
        validation_alias="ENV",
        description="The operational state of the runner instance (e.g., development, production)."
    )

    # --- CRYPTOGRAPHIC & SECURITY CONTROLS ---
    # SecretStr explicitly shields credentials from leaking into stringified dictionary print statements or logs
    SECRET_KEY: SecretStr = Field(
        ...,
        description="The cryptographic anchor string utilized for signing and verifying OAuth2/JWT session identifiers."
    )
    
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60,
        gt=0,
        description="The duration window (in minutes) during which a newly issued JWT token remains valid."
    )

    # --- EXTERNAL NETWORK API GATEWAY ROUTING CONFIGURATIONS ---
    WEATHER_API_KEY: Optional[str] = Field(
        default=None,
        description="The mandatory API access key required to authenticate outbound pipelines with OpenWeatherMap IoT gateways."
    )

    USGS_API_BASE_URL: str = Field(
        default="https://earthquake.usgs.gov/fdsnws/event/1/query",
        description="The endpoint target location for syncing streaming geological event data feeds."
    )

    # --- OBSERVABILITY & MONITORING METRICS ---
    LOG_LEVEL: str = Field(
        default="INFO",
        description="The granular execution logging filter depth (e.g., DEBUG, INFO, WARNING, ERROR, CRITICAL)."
    )

    # =====================================================================
    # PYDANTIC VALIDATION & SANITIZATION GATEWAYS
    # =====================================================================
    @field_validator("LOG_LEVEL")
    @classmethod
    def validate_log_level(cls, val: str) -> str:
        """Enforces uppercase standardization against a strict whitelist of telemetry logging filters."""
        normalized = val.upper()
        allowed_filters: Final[List[str]] = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if normalized not in allowed_filters:
            logger.warning(f"[CONFIG] Enforcing default INFO level. Unknown logging filter supplied: '{val}'")
            return "INFO"
        return normalized

    @field_validator("ENVIRONMENT")
    @classmethod
    def normalize_env_string(cls, val: str) -> str:
        """Standardizes environmental labels to maintain strict profile consistency across testing platforms."""
        return val.lower().strip()

    # =====================================================================
    # OPERATIONAL CONVENIENCE METRICS
    # =====================================================================
    @property
    def is_production(self) -> bool:
        """Helper tool checking if the runtime engine is flagged within a live production container."""
        return self.ENVIRONMENT == "production"

    @property
    def safe_weather_key_loaded(self) -> bool:
        """Helper checking if weather keys are configured without exposing the token payload."""
        return self.WEATHER_API_KEY is not None and len(self.WEATHER_API_KEY.strip()) > 0

    # =====================================================================
    # ENGINE RUNTIME MAPPING SPECIFICATIONS
    # =====================================================================
    # Pydantic Settings Config replaces the old inner 'Class Config' layout with a cleaner model dictionary structure
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"  # Gracefully ignores stray environment variables rather than crashing
    )


# =====================================================================
#