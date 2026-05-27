from fastapi import APIRouter
from graph import app as disaster_graph # Import your compiled graph

router = APIRouter()

@router.post("/run-disaster-check")
async def run_check(location: str):
    # Initialize the state with the user's input
    initial_state = {"location": location}
    
    # Run the graph
    result = disaster_graph.invoke(initial_state)
    return result