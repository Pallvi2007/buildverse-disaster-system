# """
# BuildVerse Disaster Management Engine - Graph State Schema
# File: backend/app/graph/state.py

# This module defines the central state container for the BuildVerse orchestration graph.
# It leverages advanced type annotations, explicit runtime constraints, and LangGraph
# reducer patterns to manage transactional state updates, state immutability channels,
# and the persistent human-in-the-loop self-improving memory layer.
# """

import operator
from typing import TypedDict, List, Dict, Any, Final
from typing_extensions import Annotated
from pydantic import BaseModel, Field, ValidationError
from loguru import logger


# =====================================================================
# SYSTEM LEVEL TYPE DEFINITIONS & CONSTRAINTS
# =====================================================================
class WeatherTelemetrySchema(BaseModel):
    """
    Validates and enforces strict structural types for metrics incoming from 
    external IoT/API ingestion pipelines before they map to the global graph state.
    """
    temp: float = Field(default=25.0, description="Ambient temperature in degrees Celsius.")
    humidity: float = Field(default=50.0, ge=0.0, le=100.0, description="Relative humidity percentage.")
    wind_speed: float = Field(default=5.0, ge=0.0, description="Wind velocity in meters per second.")
    status: str = Field(default="INITIALIZED", description="State tracking flag for data lineage tracing.")


# =====================================================================
# CORE LANGGRAPH STATE CHANNELS
# =====================================================================
class DisasterState(TypedDict, total=False):
    """
    State blueprint for the BuildVerse Autonomous Disaster Management Graph.
    
    This structural dict acts as an transactional data transport plane passing 
    telemetry metrics, predictive outputs, and analytical audit steps across 
    independent processing nodes.
    """
    
    # --- GEOGRAPHIC AND TELEMETRY CHANNEL ---
    location: str
    """The targeted spatial coordinates or regional location string for monitoring."""
    
    weather_metrics: Dict[str, Any]
    """Validated weather dictionary conforming structurally to WeatherTelemetrySchema."""
    
    news_context: str
    """Aggregated global or local contextual textual alerts and media inputs."""
    
    # --- INFERENCE ENGINE PLACEMENT CHANNELS ---
    disaster_prediction: str
    """The logical threat classification mapped from numerical telemetry analytics."""
    
    action_plan: str
    """The finalized, synthesized containment strategy built by the Cognitive Assessor."""
    
    # --- GOVERNANCE AND AUDIT TRAIL CHANNELS ---
    approved: bool
    """Human-In-The-Loop explicit workflow clearance vector."""
    
    # --- SELF-IMPROVING PERSISTENT MEMORY LOOP LAYER ---
    # The Annotated operator.add reducer guarantees that the graph operates as an append-only
    # transaction ledger for insights. Rather than overwriting state updates, any node returning 
    # elements in this channel merges them with the complete historical operational timeline.
    insights: Annotated[List[str], operator.add]
    """An append-only database matrix of cognitive overrides collected from the human workspace."""


# =====================================================================
# STATE MANIPULATION & VALIDATION UTILITIES
# =====================================================================
class StateValidator:
    """
    Provides highly efficient, static diagnostic helper methods to sanitize,
    validate, and enforce structural types on active graph data nodes.
    """
    
    @staticmethod
    def initialize_blank_state(target_location: str) -> DisasterState:
        """
        Creates a clean, safely default-initialized instance of the disaster state dict.
        """
        logger.debug(f"[STATE-ENGINE] Instantiating default transaction matrix for location: '{target_location}'")
        return DisasterState(
            location=target_location,
            weather_metrics={
                "temp": 25.0,
                "humidity": 50.0,
                "wind_speed": 5.0,
                "status": "INITIALIZED"
            },
            news_context="System logging initialized. Awaiting pipeline ingestion trigger.",
            disaster_prediction="PENDING_ANALYSIS",
            action_plan="AWAITING_COGNITIVE_SYNTHESIS",
            approved=False,
            insights=[]
        )

    @staticmethod
    def sanitize_telemetry(raw_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sanitizes loose data payloads passing into the graph using Pydantic validation rules.
        Ensures type conversion safety (e.g. string to float) before state injection.
        """
        try:
            validated_model = WeatherTelemetrySchema(**raw_metrics)
            return validated_model.model_dump()
        except ValidationError as val_err:
            logger.warning(
                f"[STATE-ENGINE] Telemetry Validation Divergence detected. Malformed payload fields "
                f"fallback to safe schema values. Errors observed: {val_err.errors()}"
            )
            # Re-map standard baseline telemetry if structure is broken beyond auto-casting
            return WeatherTelemetrySchema().model_dump()


# --- EXPLICIT EXPOSITION MANAGEMENT ---
__all__: Final[List[str]] = [
    "DisasterState",
    "WeatherTelemetrySchema",
    "StateValidator"
]