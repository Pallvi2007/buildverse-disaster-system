from typing import TypedDict, List, Optional
from langchain_core.messages import BaseMessage

class DisasterState(TypedDict):
    location: str
    weather_data: dict
    prediction_result: str
    news_context: str
    action_plan: str
    human_feedback: Optional[str]
    is_approved: bool
    insights: List[str] # Memory for the self-improving loop