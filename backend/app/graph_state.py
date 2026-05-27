from typing import TypedDict, List, Optional

class DisasterState(TypedDict):
    location: str
    weather_metrics: dict         # ML Model Output
    disaster_prediction: str      # ML Model Classification
    news_context: str             # From News Agent
    action_plan: str              # Drafted by Department Agent
    human_feedback: Optional[str] # HITL Interaction
    insights: List[str]           # Memory/Self-Improving Rules
    approved: bool