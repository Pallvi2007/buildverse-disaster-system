from typing import TypedDict, List, Dict, Any
from typing_extensions import Annotated
import operator

class DisasterState(TypedDict):
    """
    State definition for the Autonomous Disaster Management System.
    Tracks live data streams, ML inferences, and human feedback loops.
    """
    # Core Geography Ingestion Input
    location: str
    
    # Telemetry metrics parsed from live OpenWeatherMap API streams
    weather_metrics: Dict[str, Any]
    
    # Textual data parsed from contextual regional reports
    news_context: str
    
    # Categorical structural hazard prediction output from the ML Engine
    disaster_prediction: str
    
    # The synthesized mitigation strategy output from the Cognitive Assessor
    action_plan: str
    
    # Human-In-The-Loop gate check variable (True = Dispatch, False = Reject/Route back)
    approved: bool
    
    # THE SELF-IMPROVING MEMORY LAYER
    # The Annotated operator.add reducer allows LangGraph nodes to seamlessly
    # APPEND new human feedback rules rather than wiping existing historical state data.
    insights: Annotated[List[str], operator.add]