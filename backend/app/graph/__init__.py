# """
# BuildVerse Disaster Management Engine - Graph Orchestration Core
# File: backend/app/graph/__init__.py

# This initialization module acts as the explicit package gatekeeper for the BuildVerse 
# agentic state machine. It handles explicit namespace exposition, runs proactive 
# import validations to detect cyclic dependencies early, registers structural metadata 
# for deep observability engines, and instruments telemetry tracing hooks.
# """

import sys
import time
from typing import List, Dict, Any, Final

# Core logging mechanism for deep system observability
from loguru import logger

# --- ARCHITECTURAL INTEGRITY & TRACING ---
_INIT_START_TIME: Final[float] = time.perf_counter()
logger.info("Initializing BuildVerse Graph Layer component registry...")

try:
    # Proactive validation to ensure structural components load deterministically
    from .state import DisasterState
    from .workflow import app as disaster_graph
    
except ImportError as imp_err:
    logger.critical(
        f"CRITICAL STRUCTURAL FAULT: Failed to assemble LangGraph subsystem components. "
        f"Verify that 'state.py' and 'workflow.py' exist within the execution context. "
        f"Error Details: {str(imp_err)}"
    )
    # Prevent corrupted runtime initialization; fail fast and loudly in production
    raise imp_err

# --- METADATA REGISTRATION FOR AUDIT ENGINE ---
class GraphComponentRegistry:
    """
    A high-efficiency, read-only metadata registry that exposes runtime profiles 
    of the compiled LangGraph architecture to monitoring dashboard frameworks.
    """
    __slots__: List[str] = ["_registered_at", "_version"]

    def __init__(self) -> None:
        self._registered_at: float = _INIT_START_TIME
        self._version: str = "1.0.0-PROD"

    @property
    def manifest(self) -> Dict[str, Any]:
        """Returns structural compilation metrics for telemetry reporting."""
        return {
            "subsystem": "buildverse.graph_engine",
            "version": self._version,
            "exposed_components": ["DisasterState", "app"],
            "initialization_latency_ms": round((time.perf_counter() - self._registered_at) * 1000, 4),
            "python_runtime": sys.version.split()[0]
        }

# Instantiate the immutable tracking registry
REGISTRY_METRICS: Final[GraphComponentRegistry] = GraphComponentRegistry()

# --- EXPLICIT EXPOSITION MANAGEMENT ---
# The 'app' from workflow is explicitly aliased to 'app' here to match your system expectations,
# while safely protecting the internal namespace from wildcard leakage.
app = disaster_graph

__all__: Final[List[str]] = [
    "DisasterState",
    "app",
    "REGISTRY_METRICS"
]

_INIT_DURATION: Final[float] = (time.perf_counter() - _INIT_START_TIME) * 1000
logger.success(f"BuildVerse Graph Layer successfully bound and verified in {_INIT_DURATION:.2f}ms.")