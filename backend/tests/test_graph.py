# A simple local sanity check
from app.graph.workflow import app # Import your compiled graph
from langchain_core.messages import HumanMessage

async def test_run():
    # Attempt to invoke the graph with a dummy message
    result = await app.ainvoke({"messages": [HumanMessage(content="Hello")]})
    print("Graph execution successful!")

# Run this script before every major commit