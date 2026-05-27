import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Standardized relative import mapping from your package structure
from .routes.disaster import router as disaster_router

# Initialize the primary FastAPI Application instance
app = FastAPI(
    title="Autonomous Disaster Management System",
    description="State-Driven Agentic Graph Orchestration Engine with HITL Learning Loops.",
    version="2.0.0"
)

# --- CRITICAL UI-UX SECURITY CONNECTIVITY LAYER (CORS) ---
# This ensures your glassmorphic frontend can communicate seamlessly with the backend endpoints.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with your specific frontend origin URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the refactored, thread-safe disaster workflow routing matrix
app.include_router(disaster_router, prefix="/api/v1/disaster", tags=["Disaster Orchestration"])


@app.get("/health")
async def health_check():
    """
    Core system baseline heartbeat monitoring endpoint.
    """
    return {
        "status": "Healthy",
        "engine": "LangGraph Active State Machine",
        "persistence_layer": "SQLite Checked Threads"
    }


if __name__ == "__main__":
    # Allows direct native initialization of the application layer via Python interpreter executions
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)