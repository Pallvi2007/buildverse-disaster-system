# """
# BuildVerse Disaster Management Engine - REST API Routing Layer
# File: backend/app/routes/disaster_router.py

# This module exposes the web-facing REST interfaces for the disaster orchestration engine.
# It handles payload schemas, injects security dependencies, governs session threads,
# and orchestrates transactional execution contexts with the background LangGraph runner.
# """

from typing import Dict, Any, Final, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from loguru import logger

# Internal core dependencies 
from app.config import settings
from app.graph.workflow import app as disaster_graph
from app.graph.state import StateValidator
from app.dependencies import get_current_active_user  # Your existing security dependency


# =====================================================================
# REQUEST & RESPONSE VALIDATION SCHEMAS
# =====================================================================
class DisasterTriggerRequest(BaseModel):
    """Enforces strict structural validation on inbound disaster analysis execution tasks."""
    location: str = Field(
        ..., 
        min_length=2, 
        max_length=100, 
        example="San Francisco", 
        description="The geographic target city or sector to analyze for cascading safety risks."
    )
    thread_id: Optional[str] = Field(
        None, 
        example="session_user_9921a", 
        description="Unique execution context tracking key. If omitted, an atomic identifier is auto-assigned."
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "location": "Tokyo",
                "thread_id": "tokyo_quadrant_alpha_2026"
            }
        }
    }


class DisasterWorkflowResponse(BaseModel):
    """Structured, sanitized response contract returned to the frontend UI client."""
    success: bool = Field(..., description="Status flag indicating safe transaction lifecycle processing.")
    thread_id: str = Field(..., description="The unique session key linked to the SQLite checkpoint layer.")
    current_state: Dict[str, Any] = Field(..., description="The complete, extracted active execution state variables.")
    is_held_for_review: bool = Field(..., description="Flag informing UI if workflow is paused awaiting a Human clearance gate click.")


# =====================================================================
# API ROUTER CONFIGURATION
# =====================================================================
router = APIRouter(
    prefix="/api/v1/disaster",
    tags=["Disaster Orchestration Platform"],
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Missing or cryptographically malformed JWT Token."},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Upstream graph engine computational exception."}
    }
)


@router.post(
    "/trigger", 
    response_model=DisasterWorkflowResponse, 
    status_code=status.HTTP_202_ACCEPTED
)
async def trigger_disaster_orchestration(
    payload: DisasterTriggerRequest,
    current_user: Any = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """
    Asynchronously injects an administrative location target into the system graph.
    
    Validates credentials, establishes thread-isolated state trackers, processes 
    ingestion workflows, and securely returns the running checkpoint snapshot.
    """
    logger.info(
        f"[API-TRIGGER] Disaster evaluation initialized by user: '{getattr(current_user, 'username', 'SYSTEM_ADMIN')}' "
        f"for target spatial zone: '{payload.location}'"
    )

    # 1. Enforce or dynamically establish a thread identifier for state persistence mapping
    assigned_thread_id: Final[str] = payload.thread_id or f"session_{payload.location.lower().replace(' ', '_')}"
    execution_config: Final[Dict[str, Any]] = {"configurable": {"thread_id": assigned_thread_id}}
    
    logger.debug(f"[API-TRIGGER] Binding transaction memory context to thread state ID: '{assigned_thread_id}'")

    # 2. Compile type-safe initial state dict matrix via our structural State Validator
    initial_graph_state: Final[Dict[str, Any]] = StateValidator.initialize_blank_state(
        target_location=payload.location
    )

    try:
        # 3. Asynchronously execute the graph engine using non-blocking event-loop handlers
        # Since LangGraph compilation includes an 'interrupt_before' statement on our assessment node,
        # it will process through ingestion and predictions, then safely pause state inside SQLite.
        logger.debug(f"[API-TRIGGER] Dispatching transaction thread to LangGraph Execution Core...")
        
        updated_state_snapshot = await disaster_graph.ainvoke(
            initial_graph_state, 
            config=execution_config
        )

        # 4. Determine current checkpoint placement positioning
        # If the graph has pending nodes next in queue, it means it is successfully held at a human gate.
        current_graph_runner = await disaster_graph.aget_state(config=execution_config)
        is_paused: Final[bool] = len(current_graph_runner.next) > 0

        if is_paused:
            logger.warning(
                f"[API-TRIGGER] Transaction '{assigned_thread_id}' entered active GOVERNANCE HOLD. "
                f"Awaiting human validation click before executing: {list(current_graph_runner.next)}"
            )

        return {
            "success": True,
            "thread_id": assigned_thread_id,
            "current_state": updated_state_snapshot,
            "is_held_for_review": is_paused
        }

    except Exception as graph_err:
        logger.critical(
            f"[API-TRIGGER] Computational Engine Failure: Internal processing exception captured "
            f"during execution on thread '{assigned_thread_id}': {str(graph_err)}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Disaster automation engine failed to process transaction safely. Details: {str(graph_err)}"
        )