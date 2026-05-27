from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from ..graph.workflow import app as disaster_graph

router = APIRouter()

# --- Structured Request/Response Schemas ---

class PipelineInvokeRequest(BaseModel):
    location: str = Field(..., example="Mumbai")
    thread_id: str = Field(..., example="session_abc_123")

class PipelineRefineRequest(BaseModel):
    thread_id: str = Field(..., example="session_abc_123")
    feedback: str = Field(..., example="Prioritize emergency hospital routes.")


# --- Production API Endpoints ---

@router.post("/invoke")
async def invoke_pipeline(payload: PipelineInvokeRequest):
    """
    Triggers the Ingestion -> Prediction -> Assessment execution chain.
    State checkpoints are indexed persistently using the supplied thread_id.
    """
    config = {"configurable": {"thread_id": payload.thread_id}}
    
    # Initialize basic input fields. 
    # State values like disaster_prediction and action_plan will be filled by the graph nodes.
    initial_state = {
        "location": payload.location, 
        "insights": []
    }
    
    try:
        # Run state machine under the designated thread configuration
        result = disaster_graph.invoke(initial_state, config=config)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph Invocation Failure: {str(e)}")


@router.post("/refine")
async def refine_plan(payload: PipelineRefineRequest):
    """
    Appends corrective human feedback into the persistent SQLite state layer
    and triggers an automated adaptive re-evaluation run of the graph.
    """
    config = {"configurable": {"thread_id": payload.thread_id}}
    
    try:
        # 1. Fetch current persistent state snapshot directly from the database
        state_snapshot = disaster_graph.get_state(config)
        if not state_snapshot or not state_snapshot.values:
            raise HTTPException(
                status_code=404, 
                detail=f"No existing execution state found for thread_id: {payload.thread_id}"
            )
        
        # 2. Extract current state values safely
        current_values = state_snapshot.values
        
        # 3. Supply the fresh human feedback insight payload to the graph.
        # The LangGraph operator.add reducer automatically appends it smoothly.
        update_payload = {
            "insights": [payload.feedback]
        }
        
        # 4. Stream updated parameters back through the graph execution chain
        # to generate a newly adapted response plan.
        updated_result = disaster_graph.invoke(update_payload, config=config)
        return updated_result
        
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph Optimization Failure: {str(e)}")