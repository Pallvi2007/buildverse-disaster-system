import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import StateGraph, END

# Use clear relative package imports to protect execution namespaces
from .state import DisasterState
from .nodes import ingestion_node, prediction_node, cognitive_assessor_node

# 1. Initialize Thread-Safe Persistent State Storage Engine
# SqliteSaver handles automated serialization checkpoints across execution boundaries.
# We enable check_same_thread=False to support safe async operations within FastAPI.
conn = sqlite3.connect("disaster_system.db", check_same_thread=False)
memory = SqliteSaver(conn)

# 2. Instantiate state-driven graph machine using our system contract configuration
workflow = StateGraph(DisasterState)

# 3. Register Independent Processing Compute Components (Nodes)
workflow.add_node("ingest", ingestion_node)
workflow.add_node("predict", prediction_node)
workflow.add_node("assess", cognitive_assessor_node)

# 4. Construct Execution Flow Control Topology (Edges)
workflow.set_entry_point("ingest")

# Step-by-Step Data Flow Bridge
workflow.add_edge("ingest", "predict")   # Stream live API details into ML predictive matrix
workflow.add_edge("predict", "assess")   # Route quantitative output into Cognitive Reasoning context
workflow.add_edge("assess", END)         # Hold state for Human-In-The-Loop evaluation gate check

# 5. Compile Global Architecture with Active Memory Matrix
# This generates the executable runner, tracking application states inside the database.
app = workflow.compile(checkpointer=memory)