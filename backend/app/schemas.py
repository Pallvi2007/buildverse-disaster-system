# """
# BuildVerse Disaster Management Engine - Data Serialization Contracts
# File: backend/app/schemas.py

# This module establishes the immutable data transfer objects (DTO) for the BuildVerse architecture.
# Using explicit Pydantic v2 field mappings, it enforces data normalization rules, pattern constraints, 
# and documentation examples for both incoming HTTP payloads and real-time WebSocket frames.
# """

from enum import Enum
from datetime import datetime
from typing import List, Optional, Any, Dict, Final
from pydantic import BaseModel, Field, field_validator


# =====================================================================
# CORE ENUMERATIONS (DOMAIN ENFORCEMENT)
# =====================================================================
class ThreatSeverity(str, Enum):
    """Enumerated hazard severity tiers to enforce strict system compliance matrix rules."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


# =====================================================================
# REST & WEBSOCKET DATA TRANSFER PAYLOADS
# =====================================================================
class DisasterTriggerRequest(BaseModel):
    """
    Validation schema managing incoming execution commands to initiate automated risk routing pipelines.
    """
    location: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="The target geographic sector, town, or city vector to cross-examine.",
        examples=["Tokyo", "Mumbai"]
    )
    thread_id: str = Field(
        ...,
        min_length=8,
        max_length=64,
        description="Unique session identifier assigned to track this operational runtime session inside the checkpointer layer.",
        examples=["session_tokyo_alpha_2026"]
    )

    model_config = {
        "populate_by_name": True,
        "str_strip_whitespace": True,  # Automatically cleans stray spaces from raw string inputs
        "json_schema_extra": {
            "example": {
                "location": "Mumbai",
                "thread_id": "session_mumbai_quadrant_4"
            }
        }
    }


class TelemetryUpdate(BaseModel):
    """
    High-efficiency serialization packet broadcasted across real-time WebSockets to update dashboard displays.
    """
    timestamp: str = Field(
        default_factory=lambda: datetime.utcnow().strftime("%H:%M:%S UTC"),
        description="Atomic timestamp identifying when this telemetry state shift occurred."
    )
    sector: str = Field(
        ...,
        description="The exact geographic context sector map linked to this runtime message frame."
    )
    severity: ThreatSeverity = Field(
        ...,
        description="System-calculated or human-overridden hazard tier string profile."
    )
    status: str = Field(
        ...,
        description="Operational action status flag detail message.",
        examples=["INGESTION_COMPLETED", "GOVERNANCE_HOLD"]
    )
    metrics_payload: Optional[Dict[str, Any]] = Field(
        default=None,
        alias="data", # Maintains retro-compatibility with original front-end variable paths
        description="Optional detailed telemetry dict values containing weather, seismic updates, or action logs."
    )

    @field_validator("status")
    @classmethod
    def normalize_status_string(cls, val: str) -> str:
        """Enforces clean uppercase formatting across system event status logs."""
        return val.upper().strip()

    model_config = {
        "use_enum_values": True,       # Converts ThreatSeverity to a raw string during serialization
        "populate_by_name": True,       # Allows matching both 'data' and 'metrics_payload' fields smoothly
        "json_schema_extra": {
            "example": {
                "timestamp": "14:22:05 UTC",
                "sector": "Tokyo",
                "severity": "HIGH",
                "status": "GOVERNANCE_HOLD",
                "data": {"temp": 24.5, "humidity": 82.0, "wind_speed": 18.4}
            }
        }
    }


class EngineResponse(BaseModel):
    """
    Standardized, high-level JSON API envelope response contract returned to the web dashboard clients.
    """
    success: bool = Field(
        default=True,
        description="System transaction success confirmation flag identifier."
    )
    message: str = Field(
        ...,
        description="Human-readable informational action text string confirming task completion metrics."
    )
    thread_id: str = Field(
        ...,
        description="The historical session thread key mapped directly to the local persistent database layer."
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="The generation timestamp tracking when this exact structural wrapper model was rendered."
    )

    @field_validator("timestamp")
    @classmethod
    def ensure_utc_timezone(cls, val: datetime) -> datetime:
        """Enforces clean timestamp structures across global client instances."""
        return val.astimezone() if val.tzinfo else val

    model_config = {
        "json_schema_extra": {
            "example": {
                "success": True,
                "message": "Disaster management evaluation completed. Structural analysis compiled safely.",
                "thread_id": "session_tokyo_alpha_2026",
                "timestamp": "2026-05-27T18:00:24.000Z"
            }
        }
    }


# Expose clean export names to keep out extra utility methods
__all__: Final[List[str]] = [
    "DisasterTriggerRequest",
    "TelemetryUpdate",
    "EngineResponse",
    "ThreatSeverity"
]