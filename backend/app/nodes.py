from graph_state import DisasterState

def ingestion_node(state: DisasterState):
    """Simulates pulling fresh weather data."""
    print(f"--- Ingesting data for {state['location']} ---")
    # In a real app, integrate a Weather API here
    return {"weather_metrics": {"temp": 25, "humidity": 80, "wind": 15}}

def prediction_node(state: DisasterState):
    """Uses ML metrics to predict a disaster."""
    metrics = state["weather_metrics"]
    # Simple logic to represent the ML model
    prediction = "Flood" if metrics["humidity"] > 70 else "Normal"
    print(f"--- ML Model Prediction: {prediction} ---")
    return {"disaster_prediction": prediction}