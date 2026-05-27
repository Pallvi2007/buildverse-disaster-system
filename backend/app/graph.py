from langgraph.graph import StateGraph, END
from graph_state import DisasterState
from nodes import ingestion_node, prediction_node

workflow = StateGraph(DisasterState)

# Add nodes
workflow.add_node("ingest", ingestion_node)
workflow.add_node("predict", prediction_node)

# Define the flow
workflow.set_entry_point("ingest")
workflow.add_edge("ingest", "predict")
workflow.add_edge("predict", END)

app = workflow.compile()