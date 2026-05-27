# """
# BuildVerse Disaster Management Engine - Core Gateway Architecture
# File: backend/app/main.py
# """

import os
import time
from typing import List, Final
import uvicorn
from fastapi import FastAPI, WebSocket, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Centralized infrastructure dependencies
from app.config import settings
from app.logger import logger  # Invokes the global log interceptor
from app.dependencies import manager as ws_manager  # Single source of truth socket engine
from app.routes.disaster_router import router as disaster_router
from app.database import engine, Base

# =====================================================================
# CORE APPLICATION INITIALIZATION & DB BINDING
# =====================================================================
# Ensure tables are verified/created via SQLAlchemy when FastAPI spins up
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BuildVerse Autonomous Disaster Engine",
    description="State-Driven Agentic Graph Orchestration Engine featuring Human-In-The-Loop memory synthesis channels.",
    version="2.0.0",
    docs_url=None if settings.is_production else "/docs",  # Disable documentation layout in production
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json"
)

# =====================================================================
# CORS INFRASTRUCTURE POLICY CONFIGURATION
# =====================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if not settings.is_production else ["https://buildverse-disaster.render.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================================
# HIGH-EFFICIENCY LOGGING & TELEMETRY MIDDLEWARE
# =====================================================================
@app.middleware("http")
async def track_http_transaction_telemetry(request: Request, call_next):
    start_time: Final[float] = time.perf_counter()
    request_id: Final[str] = f"tx_{int(start_time * 1000)}"
    
    with logger.contextualize(request_id=request_id, client_ip=request.client.host if request.client else "UNKNOWN"):
        logger.info(f"[HTTP-IN] Inbound request captured: {request.method} -> Target: {request.url.path}")
        
        try:
            response = await call_next(request)
            
            execution_latency_ms: Final[float] = (time.perf_counter() - start_time) * 1000
            response.headers["X-Runtime-Latency-MS"] = f"{execution_latency_ms:.2f}"
            
            logger.info(
                f"[HTTP-OUT] Processing complete for path {request.url.path}. "
                f"Status: {response.status_code} | Latency: {execution_latency_ms:.2f}ms"
            )
            return response
            
        except Exception as unhandled_middleware_err:
            execution_latency_ms = (time.perf_counter() - start_time) * 1000
            logger.critical(
                f"[HTTP-CRASH] Pipeline disrupted mid-execution on path: {request.url.path}. "
                f"Error profile: {str(unhandled_middleware_err)} | Latency: {execution_latency_ms:.2f}ms"
            )
            raise unhandled_middleware_err

# =====================================================================
# GLOBAL ERROR BOUNDARY INTERCEPTORS
# =====================================================================
@app.exception_handler(Exception)
async def system_global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(f"[GLOBAL-FAULT-GUARD] Intercepted operational exception on route {request.url.path}: {str(exc)}")
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "FATAL_SYSTEM_ERROR",
            "message": "An internal system fault occurred within the core state engine. Transaction safely halted.",
            "trace_id": "BUILDVERSE_CORE_ERR_001",
            "location_context": request.url.path
        }
    )

# =====================================================================
# APPLICATION INTERFACES & BACKEND ROUTER INJECTIONS
# =====================================================================
app.include_router(disaster_router)

@app.get("/health", status_code=status.HTTP_200_OK)
async def platform_health_audit_check() -> dict:
    database_file_path: Final[str] = os.path.join(os.path.dirname(__file__), "..", "disaster_system.db")
    is_database_stable: Final[bool] = os.path.exists(database_file_path)
    
    system_status: Final[str] = "OPERATIONAL" if is_database_stable else "DEGRADED"
    logger.debug(f"[HEALTH] Performing verification check. Result status code resolved: {system_status}")
    
    return {
        "status": system_status,
        "engine": "LangGraph Active State Machine Engine",
        "persistence_layer": {
            "status": "CONNECTED" if is_database_stable else "DISCONNECTED_MISSING",
            "engine": "SQLite Secure Shared Thread Checkpointer"
        },
        "version": "2.0.0-PROD"
    }

# =====================================================================
# REAL-TIME SYSTEM TELEMETRY WEBSOCKET ROUTE
# =====================================================================
@app.websocket("/ws/telemetry")
async def operational_websocket_telemetry_endpoint(websocket: WebSocket) -> None:
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception as ws_disconnect_exc:
        logger.debug(f"[WS-STREAM] Network context close event handled on active socket: {ws_disconnect_exc}")
    finally:
        await ws_manager.disconnect(websocket)

# =====================================================================
# PRODUCTION RUNNER VECTOR INITIALIZATION
# =====================================================================
if __name__ == "__main__":
    logger.info("[STARTUP] Ignition sequence initialized. Spawning server sub-processes...")
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=not settings.is_production, 
        workers=1 if not settings.is_production else 4  
    )