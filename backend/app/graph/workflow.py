# """
# BuildVerse Disaster Management Engine - Unified State Graph Orchestration
# File: backend/app/graph/workflow.py

# This module compiles the absolute single source of truth for the BuildVerse LangGraph.
# It blends asynchronous weather ingestion, live USGS geological telemetry streams,
# predictive risk classification, data-driven conditional execution gates, and strict 
# Human-In-The-Loop (HITL) checkpoints sustained via persistent SQLite state layers.
# """

import os
import sqlite3
from typing import Dict, Any, Final, List
import httpx
from loguru import logger
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import StateGraph, END

# Explicit inner-package state dependencies
from app.config import settings
from app.graph.state import DisasterState
from app.graph.nodes import ingestion_node, prediction_node, cognitive_assessor_node


# =====================================================================
# SYSTEM LEVEL STORAGE & CHECKPOINTING INITIALIZATION
# =====================================================================
def _initialize_production_database() -> SqliteSaver:
    """
    Creates an isolated database context manager and registers the thread-safe
    LangGraph checkpoint saver to maintain state persistence across transactions.
    """
    try:
        db_path: Final[str] = os.path.join(os.path.dirname(os.path.dirname(__file__)), "disaster_system.db")
        logger.info(f"[GRAPH-COMPILER] Binding persistent state engine to storage path: {db_path}")
        
        # check_same_thread=False is crucial to allow multi-threaded async executions inside FastAPI
        connection = sqlite3.connect(db_path, check_same_thread=False)
        return SqliteSaver(connection)
    except sqlite3.Error as sql_err:
        logger.critical(f"[GRAPH-COMPILER] Storage Engine Crash: Checkpointer failed to instantiate: {sql_err}")
        raise sql_err

# Instantiate persistent memory bank
state_checkpointer: Final[SqliteSaver] = _initialize_production_database()


# =====================================================================
# INTEGRATED GEOLOGICAL DATA STREAM (USGS SEISMIC EXTENSION)
# =====================================================================
async def geological_stream_node(state: DisasterState) -> Dict[str, Any]:
    """
    Connects to the United States Geological Survey (USGS) API to stream live seismic 
    activity data within a 100km radius of the targeted geocode parameters.
    
    Dynamically maps region names to coordinates and pushes insights into the memory stream.
    """
    target_location: Final[str] = state.get("location", "Mumbai")
    logger.info(f"[NODE-GEOLOGICAL] Streaming real-time USGS seismic feeds for coordinate vector: {target_location}")

    # Standardized real-world location-to-coordinate mapping framework
    coordinate_matrix: Final[Dict[str, tuple]] = {
        "Mumbai": (19.0760, 72.8777),
        "Tokyo": (35.6762, 139.6503),
        "San Francisco": (37.7749, -122.4194),
        "New Delhi": (28.6139, 77.2090)
    }

    lat, lon = coordinate_matrix.get(target_location, (19.0760, 72.8777))
    logger.debug(f"[NODE-GEOLOGICAL] Resolved coordinates for target: Lat={lat}, Lon={lon}")

    usgs_endpoint: Final[str] = (
        f"https://earthquake.usgs.gov/fdsnws/event/1/query?"
        f"format=geojson&latitude={lat}&longitude={lon}&maxradiuskm=100"
    )

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(usgs_endpoint, timeout=8.0)
            if response.status_code != 200:
                logger.warning(f"[NODE-GEOLOGICAL] USGS server communication exception code: {response.status_code}")
                return {"insights": ["Geological monitoring interface offline. Using local predictive matrices."]}
            
            payload = response.json()
            seismic_features: List[Dict[str, Any]] = payload.get("features", [])
            event_count: Final[int] = len(seismic_features)
            
            logger.info(f"[NODE-GEOLOGICAL] Discovery phase complete. {event_count} micro-seismic structural variations mapped.")

            # Append structured logs directly to append-only learning history
            telemetry_insight = f"USGS Geological Feed: Collected {event_count} active anomalies for coordinate bounds."
            return {
                "insights": [telemetry_insight]
            }

        except httpx.RequestError as exc:
            logger.error(f"[NODE-GEOLOGICAL] Critical network exception captured during USGS execution: {exc}")
            return {"insights": ["USGS Stream failure due to communication drop. Operating defensive protocols."]}


# =====================================================================
# DATA DRIVEN ASYNCHRONOUS CONDITIONAL ROUTER
# =====================================================================
def runtime_threat_router(state: DisasterState) -> str:
    """
    Anomalous condition assessment function. Examines current structural outputs
    and determines whether to bypass standard paths or advance to high-level action routing.
    """
    prediction: Final[str] = state.get("disaster_prediction", "Stable Weather Configuration")
    insights: Final[List[str]] = state.get("insights", [])
    
    logger.info(f"[ROUTER-GATEWAY] Evaluating execution metrics. Hazard status: '{prediction}'")

    # Business rule verification pattern
    if "Stable" in prediction and len(insights) == 0:
        logger.success("[ROUTER-GATEWAY] Path clear. Low threat metrics matched. Diverting execution to endpoint termination.")
        return "bypass_containment"
    
    logger.warning("[ROUTER-GATEWAY] Threat conditions detected. Elevating workflow track to Cognitive Assessment.")
    return "escalate_to_assess"


# =====================================================================
# COMPILATION OF ADVANCED FLOW TOPOLOGY
# =====================================================================
# Initialize core structural builder mapping explicitly to state channels
builder = StateGraph(DisasterState)

# Step 1: Bind compute operational nodes
builder.add_node("ingest_weather", ingestion_node)
builder.add_node("ingest_geological", geological_stream_node)
builder.add_node("predict_hazards", prediction_node)
builder.add_node("assess_mitigation", cognitive_assessor_node)

# Step 2: Establish workflow progression matrix
builder.set_entry_point("ingest_weather")

# Concurrent collection bridge simulation
builder.add_edge("ingest_weather", "ingest_geological")
builder.add_edge("ingest_geological", "predict_hazards")

# Step 3: Integrate data-driven conditional logic engine
builder.add_conditional_edges(
    "predict_hazards",
    runtime_threat_router,
    {
        "escalate_to_assess": "assess_mitigation",
        "bypass_containment": END
    }
)

# Step 4: Map mitigation tracking directly to the terminal state node
builder.add_edge("assess_mitigation", END)


# =====================================================================
# PRODUCTION ENGINE STATE ENGINE COMPILATION
# =====================================================================
# The 'interrupt_before' statement tells LangGraph to execute everything, 
# build the action plan, and hold state inside SQLite right before hitting the 
# cognitive assessment node. This forces an explicit human confirmation state.
app = builder.compile(
    checkpointer=state_checkpointer,
    interrupt_before=["assess_mitigation"]
)

logger.success("BuildVerse Disaster Orchestration Graph compiled successfully with active checkpoint monitors.")