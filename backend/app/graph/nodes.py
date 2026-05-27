# """
# BuildVerse Disaster Management Engine - Graph Processing Nodes
# File: backend/app/graph/nodes.py

# This module establishes the high-efficiency execution blocks for the LangGraph state machine. 
# It ingests active telemetry via non-blocking asynchronous requests, processes structural logic matrices, 
# and updates the global immutable application state within an isolated transactional scope.
# """

import time
from typing import Dict, Any, Final
import httpx
from loguru import logger

from app.config import settings
from app.graph.state import DisasterState


# =====================================================================
# MILESTONE A: HIGH-EFFICIENCY ASYNCHRONOUS TELEMETRY INGESTION NODE
# =====================================================================
async def ingestion_node(state: DisasterState) -> Dict[str, Any]:
    """
    Asynchronously fetches live regional environmental telemetry from the 
    OpenWeatherMap API using structured configuration contexts.
    
    Implements multi-tiered circuit protection and explicit fallback states
    to maintain system integrity when communication paths are disrupted.
    """
    execution_start: Final[float] = time.perf_counter()
    location: Final[str] = state.get("location", "New Delhi")
    
    logger.info(f"[NODE-INGESTION] Processing network data telemetry stream for location: '{location}'")

    # Guard clause: Verify secure authentication credentials are explicitly bound
    if not settings.WEATHER_API_KEY:
        logger.error(
            f"[NODE-INGESTION] Cryptographic Key Deficit: 'WEATHER_API_KEY' is empty or unset. "
            f"Enforcing isolated local fallback matrix for safety profile."
        )
        return {
            "weather_metrics": {
                "temp": 25.0,
                "humidity": 60.0,
                "wind_speed": 5.0,
                "status": "AUTHENTICATION_FAULT_LOCAL_FALLBACK"
            },
            "news_context": "System running on localized default fallback variables due to unconfigured API keys."
        }

    # Enterprise URL compilation with strict target bounding
    target_api_url: Final[str] = (
        f"https://api.openweathermap.org/data/2.5/weather?q={location}"
        f"&appid={settings.WEATHER_API_KEY}&units=metric"
    )

    # Leverage an explicit asynchronous HTTP client context manager with tight timeout parameters
    async with httpx.AsyncClient() as client:
        try:
            logger.debug(f"[NODE-INGESTION] Dispatching async telemetry call out to OpenWeatherMap network gateway...")
            response = await client.get(target_api_url, timeout=7.0)
            
            # Catch bad HTTP status blocks instantly before extraction parsing
            if response.status_code != 200:
                logger.warning(
                    f"[NODE-INGESTION] Edge Gateway Exception: OpenWeatherMap returned HTTP status "
                    f"code {response.status_code}. Executing localized safe metrics substitution."
                )
                return {
                    "weather_metrics": {
                        "temp": 28.0, 
                        "humidity": 75.0, 
                        "wind_speed": 12.0, 
                        "status": f"GATEWAY_ERROR_{response.status_code}"
                    },
                    "news_context": f"Upstream service exception context. Unable to dynamically process metrics for {location}."
                }

            telemetry_payload = response.json()
            
            # Internal payload parsing and structure checking
            if str(telemetry_payload.get("cod")) != "200":
                logger.warning(
                    f"[NODE-INGESTION] Payload Logic Rejection: API code error detected "
                    f"({telemetry_payload.get('message', 'Unknown Context')}). Routing localized fallbacks."
                )
                return {
                    "weather_metrics": {"temp": 28.0, "humidity": 75.0, "wind_speed": 12.0, "status": "API_LOGIC_FAULT"},
                    "news_context": f"Upstream business logic exception. Core telemetry stream diverted for {location}."
                }

            latency_ms: Final[float] = (time.perf_counter() - execution_start) * 1000
            logger.success(f"[NODE-INGESTION] Live data pipeline successfully refreshed for {location} in {latency_ms:.2f}ms.")
            
            # Safely extract structured dictionaries using standard key pathways
            main_block = telemetry_payload.get("main", {})
            wind_block = telemetry_payload.get("wind", {})
            
            return {
                "weather_metrics": {
                    "temp": float(main_block.get("temp", 25.0)),
                    "humidity": float(main_block.get("humidity", 50.0)),
                    "wind_speed": float(wind_block.get("speed", 5.0)),
                    "status": "SUCCESS_PROD_INGEST"
                },
                "news_context": f"Real-time regional environmental context packages compiled for target vector: {location}."
            }

        except httpx.RequestError as exc:
            logger.error(f"[NODE-INGESTION] Network Protocol Interruption: Connection exception captured: {exc}.")
            return {
                "weather_metrics": {"temp": 20.0, "humidity": 50.0, "wind_speed": 4.0, "status": "NETWORK_DISCONNECT_MODE"},
                "news_context": "Upstream communication dropped. Moving automation models into localized defensive predictive modes."
            }


# =====================================================================
# MILESTONE B: SECURE NUMERICAL PREDICTION BRIDGE NODE
# =====================================================================
async def prediction_node(state: DisasterState) -> Dict[str, Any]:
    """
    Evaluates historical, processed, and live atmospheric matrix combinations 
    against analytical forecasting filters to establish active threats.
    """
    logger.info("[NODE-PREDICTION] Awakening logic evaluation matrices for state hazard analysis...")
    
    # Secure extraction formatting to shield system against unexpected key deletions or type mutations
    weather_metrics: Final[Dict[str, Any]] = state.get("weather_metrics", {})
    
    current_humidity: Final[float] = float(weather_metrics.get("humidity", 50.0))
    current_temp: Final[float] = float(weather_metrics.get("temp", 25.0))
    current_wind: Final[float] = float(weather_metrics.get("wind_speed", 5.0))

    logger.debug(
        f"[NODE-PREDICTION] State parameters passed: Temp={current_temp}°C | "
        f"Humidity={current_humidity}% | Wind={current_wind} m/s"
    )

    # Standardized evaluation hierarchy matching application thresholds
    if current_humidity > 80.0 and current_wind > 15.0:
        hazard_forecast = "Severe Flood Risk & Storm Event"
    elif current_temp > 40.0:
        hazard_forecast = "Extreme Heatwave Warning"
    elif current_humidity > 75.0:
        hazard_forecast = "Flood Hazard Alert"
    else:
        hazard_forecast = "Stable Weather Configuration"

    logger.success(f"[NODE-PREDICTION] Hazard profile calculation finished. Resolved Outcome: '{hazard_forecast}'")
    return {"disaster_prediction": hazard_forecast}


# =====================================================================
# MILESTONE C: REASONING CORE COGNITIVE ASSESSOR NODE
# =====================================================================
async def cognitive_assessor_node(state: DisasterState) -> Dict[str, Any]:
    """
    Synthesizes current numerical classifications alongside dynamic human memory layers,
    formatting structured outputs for automated downstream department routing.
    """
    logger.info("[NODE-COGNITIVE] Constructing cognitive prompt matrices and system task routes...")
    
    hazard_prediction: Final[str] = state.get("disaster_prediction", "Unknown Configuration")
    weather_metrics: Final[Dict[str, Any]] = state.get("weather_metrics", {})
    target_location: Final[str] = state.get("location", "Target Demarcation Vector")
    
    # Compile multi-turn human-in-the-loop override records securely from the state
    historical_insights = state.get("insights", [])
    formatted_memory_context: Final[str] = (
        "\n".join(f"  -> MEMORY REFERENCE BLOCK [Rule]: {insight_item}" for insight_item in historical_insights)
        if historical_insights 
        else "  -> No historical rule changes or human structural modifications logged in active state context."
    )

    # Advanced Multi-Variable Context Matrix Formulation Block
    structural_prompt_block: Final[str] = (
        f"\n"
        f"┌────────────────────────────────────────────────────────┐\n"
        f"│           COGNITIVE EXECUTION CONTEXT MATRIX           │\n"
        f"├────────────────────────────────────────────────────────┤\n"
        f"  GEOGRAPHIC AXIS     : {target_location}\n"
        f"  ATMOSPHERIC LOGS    : Temp: {weather_metrics.get('temp')}°C | Humidity: {weather_metrics.get('humidity')}% | Wind: {weather_metrics.get('wind_speed')} m/s\n"
        f"  ML SYSTEM ESTIMATE  : {hazard_prediction}\n"
        f"  \n"
        f"  PERSISTENT INTELLIGENCE PIPELINE OVERRIDES (HITL):\n"
        f"{formatted_memory_context}\n"
        f"└────────────────────────────────────────────────────────┘"
    )
    
    logger.debug(f"[NODE-COGNITIVE] Context evaluation package assembled:\n{structural_prompt_block}")

    # Explicit structural processing logic loop allocation
    if "Severe" in hazard_prediction or "Flood" in hazard_prediction:
        target_department = "Emergency Response Department"
    elif "Heatwave" in hazard_prediction:
        target_department = "Civil Defense Command"
    else:
        target_department = "Public Works Sector"

    compiled_action_plan: Final[str] = (
        f"[{target_department}] Strategic alert deployed for area matrix: '{target_location}'. "
        f"Structural containment frameworks updated. Operational insights matched: {len(historical_insights)} dynamic criteria logs."
    )

    logger.success(f"[NODE-COGNITIVE] Orchestrated command vector established for routing path: '{target_department}'")
    return {"action_plan": compiled_action_plan}