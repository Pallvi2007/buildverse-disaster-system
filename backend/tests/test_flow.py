# """
# BuildVerse Disaster Management Engine - End-to-End System Validation Suite
# File: backend/tests/test_flow.py

# This verification tool executes integration tests simulating your multi-tiered
# asynchronous LangGraph runtime engine. It evaluates async api ingestion streams, USGS data 
# aggregations, risk logic routing matrix configurations, checkpoint persistence, 
# and automated recovery pauses at the manual human-in-the-loop review gate.
# """

import os
import sys
import asyncio
import time
from typing import Dict, Any, Final, List

# Ensure the backend root folder is accessible in the system path for seamless modular lookups
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from loguru import logger
from app.graph.workflow import app as disaster_graph


async def run_system_verification_suite() -> None:
    """
    Executes an asynchronous End-to-End simulation testing data orchestration loops, 
    conditional branch decision pathways, and manual execution state resumption metrics.
    """
    logger.info("=====================================================================")
    logger.info("🚀 IGNITING BUILDVERSE AGENTIC SYSTEM VERIFICATION LOOP")
    logger.info("=====================================================================")

    # Standard configuration tracking identifier mimicking real frontend sessions
    test_session_id: Final[str] = f"test_integration_session_{int(time.time())}"
    execution_config: Final[Dict[str, Any]] = {"configurable": {"thread_id": test_session_id}}
    
    # -------------------------------------------------------------------------
    # TEST PHASE 1: SYSTEM TRIGGER AND DATA INGESTION INITIALIZATION
    # -------------------------------------------------------------------------
    logger.info("[PHASE-1] Triggering initial graph entry node for location target: 'Mumbai'")
    initial_graph_state: Final[Dict[str, Any]] = {
        "location": "Mumbai",
        "insights": []
    }

    try:
        # Since the graph contains an `interrupt_before=["assess_mitigation"]` directive,
        # 'ainvoke' will process weather, geological details, risk predictions, and then safely freeze.
        logger.debug(f"[PHASE-1] Dispatching async thread execution queue on session key: '{test_session_id}'")
        first_pass_result = await disaster_graph.ainvoke(
            initial_graph_state, 
            config=execution_config
        )
        
        # Pull current running state details to inspect the interruption point
        graph_runtime_snapshot = await disaster_graph.aget_state(config=execution_config)
        pending_nodes: Final[List[str]] = list(graph_runtime_snapshot.next)
        
        logger.success("[PHASE-1] Initial processing pass executed down to checkpoint matrix boundaries.")
        logger.debug(f" -> Current Location Captured    : {first_pass_result.get('location')}")
        logger.debug(f" -> Internal Forecast Resolution  : {first_pass_result.get('disaster_prediction')}")
        logger.debug(f" -> Checkpoint Interrupted At Node: {pending_nodes}")

        # Assert verification check: Confirm the engine halted precisely at your manual review gate
        assert "assess_mitigation" in pending_nodes, (
            f"Governance Deficit: Engine failed to pause before the mitigation assessment node! "
            f"Active queue returned: {pending_nodes}"
        )
        logger.success("✅ ASSERTION PASSED: LangGraph execution successfully halted at the manual approval gate.")

    except AssertionError as assert_err:
        logger.error(f"❌ ASSERTION TRACE REJECTION - PHASE 1: {assert_err}")
        sys.exit(1)
    except Exception as exc_err:
        logger.critical(f"💥 CRITICAL PIPELINE BREAKDOWN - PHASE 1: Unhandled exception captured: {exc_err}")
        sys.exit(1)

    # -------------------------------------------------------------------------
    # TEST PHASE 2: SIMULATE FRONTEND MAN-IN-THE-LOOP OVERRIDE FEEDBACK
    # -------------------------------------------------------------------------
    logger.info("---------------------------------------------------------------------")
    logger.info("[PHASE-2] Simulating manual workspace review override submission...")
    
    human_feedback_override: Final[str] = "CRITICAL METRIC: Deploy localized cooling infrastructure arrays immediately."
    logger.info(f" -> Injecting human feedback string: '{human_feedback_override}'")

    # Frame the incremental state data package. 
    # The 'operator.add' reducer configuration inside state.py automatically merges this string.
    feedback_state_update: Final[Dict[str, Any]] = {
        "insights": [human_feedback_override]
    }

    try:
        # Use update_state to push modifications directly into the persistent SQLite tracking layer
        logger.debug(f"[PHASE-2] Writing feedback parameters out to thread session id '{test_session_id}'")
        await disaster_graph.aupdate_state(
            config=execution_config,
            values=feedback_state_update,
            as_node="predict_hazards"  # Updates state history from the perspective of the preceding block
        )
        
        # Verify the database successfully registered the record
        refreshed_snapshot = await disaster_graph.aget_state(config=execution_config)
        registered_insights: Final[List[str]] = refreshed_snapshot.values.get("insights", [])
        
        logger.debug(f" -> Total Memory Logs Extracted From DB: {len(registered_insights)}")
        assert human_feedback_override in registered_insights, "State Storage Fault: Feedback update missed."
        logger.success("✅ ASSERTION PASSED: Manual workspace logs verified inside the persistent SQLite memory block.")

    except AssertionError as assert_err:
        logger.error(f"❌ ASSERTION TRACE REJECTION - PHASE 2: {assert_err}")
        sys.exit(1)
    except Exception as exc_err:
        logger.critical(f"💥 CRITICAL PIPELINE BREAKDOWN - PHASE 2: {exc_err}")
        sys.exit(1)

    # -------------------------------------------------------------------------
    # TEST PHASE 3: EXECUTE ADAPTIVE ADAPTATION RESUMPTION RUN
    # -------------------------------------------------------------------------
    logger.info("---------------------------------------------------------------------")
    logger.info("[PHASE-3] Re-awakening graph transaction context loop to finalize tasks...")

    try:
        # Resuming execution requires passing None as the input value while reusing the config context.
        # This tells LangGraph to pick up exactly where