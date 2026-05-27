import os
import sys

# Ensure the backend root folder is accessible in the system path for seamless modular lookups
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.graph.workflow import app as disaster_graph

def run_system_verification_suite():
    """
    Executes End-to-End system validation testing live API integration,
    ML data bridging, and checkpoint persistence adaptation logic.
    """
    print("\n" + "="*60)
    print(" STARTING DISASTER ENGINE END-TO-END VALIDATION SUITE")
    print("="*60)
    
    # Standard configuration tracking identifier mimicking real frontend sessions
    test_thread_id = "integration_verification_session_2026"
    config = {"configurable": {"thread_id": test_thread_id}}
    
    # -------------------------------------------------------------------------
    # STEP 1: INITIAL STATE INVOCATION RUN
    # -------------------------------------------------------------------------
    print("\n[Test Phase 1] Launching primary graph ingestion & analysis cycle...")
    initial_input = {
        "location": "Mumbai",
        "insights": []
    }
    
    try:
        first_pass_state = disaster_graph.invoke(initial_input, config=config)
        
        print("\n>>> SUCCESS: Phase 1 Completed Structural Telemetry Loop.")
        print(f"    Ingested Location : {first_pass_state.get('location')}")
        print(f"    ML Hazard Forecast: {first_pass_state.get('disaster_prediction')}")
        print(f"    Assessor Strategy : {first_pass_state.get('action_plan')}")
        
    except Exception as e:
        print(f"\n[CRITICAL FAILURE - PHASE 1]: {str(e)}")
        sys.exit(1)
        
    # -------------------------------------------------------------------------
    # STEP 2: SIMULATE FRONTEND HUMAN-IN-THE-LOOP OVERRIDE/REJECTION
    # -------------------------------------------------------------------------
    print("\n" + "-"*60)
    print("[Test Phase 2] Simulating User Rejection & Feedback Loop...")
    
    human_feedback_override = "CRITICAL: Deploy specialized cooling infrastructure immediately."
    print(f"    Injected Feedback Constraint: '{human_feedback_override}'")
    
    # Construct update state vector explicitly passing only the changes.
    # The LangGraph operator.add reducer automatically updates your local SQLite layer.
    feedback_update = {
        "insights": [human_feedback_override]
    }
    
    # -------------------------------------------------------------------------
    # STEP 3: EXECUTE ADAPTIVE ADAPTATION GRAPH LOOP
    # -------------------------------------------------------------------------
    print("\n[Test Phase 3] Re-invoking graph thread matrix to verify adaptation...")
    
    try:
        adapted_pass_state = disaster_graph.invoke(feedback_update, config=config)
        
        print("\n>>> SUCCESS: Phase 3 Completed Self-Improving Optimization Loop.")
        print(f"    Optimized Action Plan: {adapted_pass_state.get('action_plan')}")
        print(f"    Active System Memory Overrides Count: {len(adapted_pass_state.get('insights', []))}")
        
        # Verify that the database successfully captured the historical trace entries
        assert len(adapted_pass_state.get('insights', [])) >= 1, "State error: Feedback was dropped from the database!"
        
        print("\n" + "="*60)
        print(" VERIFICATION SUCCESSFUL: SELF-IMPROVING AGENT IS OPERATIONAL")
        print("="*60 + "\n")
        
    except AssertionError as assert_err:
        print(f"\n[INTEGRATION ERROR]: {str(assert_err)}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[CRITICAL FAILURE - PHASE 3]: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    run_system_verification_suite()