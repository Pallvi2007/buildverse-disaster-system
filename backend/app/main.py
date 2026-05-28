import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import asyncio
import json
import random
import hashlib

# Setup logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("buildverse")

# 1. INITIALIZE APP ONCE
app = FastAPI(title="BuildVerse Ops Engine API")

# Configure CORS for frontend cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IncidentPayload(BaseModel):
    threadId: str
    location: str

# Localized state memory storage linked to thread sessions
session_memory = {}

# Connection Manager for Streaming Telemetry
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"[WS-MANAGER] Active connection opened. Total client count: {len(self.active_connections)}")
        
    async def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"[WS-MANAGER] Connection terminated. Active client count: {len(self.active_connections)}")

ws_manager = ConnectionManager()


# 2. GENERALIZED ENGINE INTERACTION CHANNELS
@app.post("/api/v1/disaster/trigger")
async def trigger_disaster_incident(payload: IncidentPayload):
    """
    Triggers tactical response protocols for any incident zone.
    Saves the user's custom location dynamically to session memory.
    """
    logger.info(f"[TRIGGER] Incident initiated for sector: {payload.location} on thread: {payload.threadId}")
    
    # Cache whatever city string the operator submits
    session_memory[payload.threadId] = payload.location
    return {"status": "SUCCESS", "message": f"Incident response deployed to {payload.location}"}


@app.get("/api/v1/disaster/state/{thread_id}")
async def get_disaster_state(thread_id: str):
    """
    Generates dynamic operational states for any arbitrary city algorithmically.
    No predefined city lists or hardcoding required.
    """
    logger.info(f"[STATE-FETCH] Querying memory structures for context: {thread_id}")
    
    # Retrieve the triggered location, defaulting to "Punjab" if nothing has been triggered yet
    active_location = session_memory.get(thread_id, "Punjab")
    
    # --- DETERMINISTIC SEED GENERATION ---
    # Convert the city name string into a unique integer seed using an MD5 hash.
    # This guarantees that entering the same city always yields the same values, 
    # but different cities instantly get entirely different parameters.
    city_hash = hashlib.md5(active_location.strip().lower().encode('utf-8')).hexdigest()
    seed_int = int(city_hash[:6], 16) # Take first 6 characters to generate an integer seed
    
    # Create a local random generator isolated to this seed
    local_rand = random.Random(seed_int)
    
    # 1. Algorithmically determine a risk matrix category
    risk_levels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    disaster_types = ["Flood Inundation Matrix", "Monsoonal Urban Inundation", "Flash Water Retention Failure", "Atmospheric River Inundation", "Coastal Drainage Overflow"]
    
    selected_risk = local_rand.choice(risk_levels)
    selected_disaster = local_rand.choice(disaster_types)
    
    prediction_text = f"{selected_disaster} [RISK_LEVEL: {selected_risk}] - AWAITING_APPROVAL"
    
    # 2. Algorithmically scale weather parameters based on the seed
    temp = local_rand.randint(15, 42)        # Dynamic temperature window between 15°C and 42°C
    humidity = local_rand.randint(45, 98)    # Dynamic humidity index between 45% and 98%
    wind_speed = round(local_rand.uniform(5.0, 32.0), 1) # Wind speed float
    
    # 3. Dynamic operational mitigation tasks matching the risk scale
    level_index = local_rand.randint(1, 4)
    action_text = f"Level-{level_index} Deployment Protocol activated. Engaging specialized localized emergency response infrastructure configurations tailored for the {active_location} landscape topography."
    
    # 4. Generate unique contextual data telemetry insights
    insights_list = [
        f"Localized telemetry data nodes across {active_location} indicate an immediate deviation from standard baselines.",
        f"Automated sensors advise deploying immediate level-{level_index} mitigation strategies to safeguard low-lying grid corridors."
    ]

    return {
        "thread_id": thread_id,
        "location": f"{active_location} Sector Vector",
        "disaster_prediction": prediction_text,
        "action_plan": action_text,
        "weather_metrics": {
            "temp": temp,
            "humidity": humidity,
            "wind_speed": wind_speed
        },
        "insights": insights_list,
        "logs": [
            {"timestamp": "11:42:10 UTC", "sector": f"{active_location} Alpha", "severity": "CRITICAL" if selected_risk in ["HIGH", "CRITICAL"] else "INFO", "status": f"Sensors reporting micro-climate shift."},
            {"timestamp": "11:43:05 UTC", "sector": f"{active_location} Delta", "severity": "HIGH" if selected_risk != "LOW" else "SUCCESS", "status": f"Local operational matrix initialized."}
        ]
    }


# 3. REAL-TIME SYSTEM TELEMETRY WEBSOCKET ROUTE
@app.websocket("/ws/telemetry")
async def operational_websocket_telemetry_endpoint(websocket: WebSocket) -> None:
    await ws_manager.connect(websocket)
    
    sample_statuses = [
        "Hydrological throughput within standard parameters.",
        "Satellite telemetry handshake stabilized.",
        "Bypass routing matrix optimized successfully.",
        "Sensors refreshing cache register sequences.",
        "Orchestration engine heartbeat verified.",
        "Ingress packet queue flushed cleanly."
    ]
    sample_sectors = ["Sector Alpha-7", "Sector Delta-2", "Sector Gamma-4", "Sector Epsilon-9"]
    sample_severities = ["INFO", "SUCCESS", "WARNING"]

    try:
        while True:
            mock_packet = {
                "timestamp": "LIVE",
                "sector": random.choice(sample_sectors),
                "severity": random.choice(sample_severities),
                "status": random.choice(sample_statuses)
            }
            await websocket.send_text(json.dumps(mock_packet))
            await asyncio.sleep(3)
            
            try:
                client_data = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)
                logger.debug(f"[WS-STREAM] Inbound client heartbeat: {client_data}")
            except asyncio.TimeoutError:
                pass
                
    except WebSocketDisconnect:
        logger.info("[WS-STREAM] Client explicitly disconnected from telemetry socket.")
    except Exception as ws_exc:
        logger.warning(f"[WS-STREAM] Socket hit unexpected runtime exception: {ws_exc}")
    finally:
        await ws_manager.disconnect(websocket)


# 4. SERVER RUN ROUTINE
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)