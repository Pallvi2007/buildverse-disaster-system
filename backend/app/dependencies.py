# """
# BuildVerse Disaster Management Engine - Application Dependency Layer
# File: backend/app/dependencies.py

# This module contains core system dependencies, including the enterprise real-time 
# WebSocket connection manager for push notifications and the cryptographic 
# OAuth2/JWT authentication gatekeepers used across REST routers.
# """

import asyncio
from typing import List, Dict, Any, Final, Optional
from fastapi import WebSocket, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from loguru import logger

from app.config import settings

# Setup standard OAuth2 token extraction pathway pointing to a token generation router
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token", auto_error=False)


# =====================================================================
# CRYPTOGRAPHIC SECURITY & ACCESS CONTROL DEPENDENCIES
# =====================================================================
async def get_current_active_user(token: Optional[str] = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """
    Decodes inbound JWT tokens, validates signatures, verifies expiration, 
    and returns authenticated user claims. Integrates seamlessly with REST routes.
    """
    # Defensive development bypass fallback if running without secret keys in sandbox modes
    if settings.ENVIRONMENT == "development" and (not token or token == "secret-token"):
        logger.warning("[AUTH-GATE] Bypassing cryptographic validation. Injecting administrative sandbox user profile.")
        return {"username": "sandbox_admin", "role": "OPERATOR", "permissions": ["*"]}

    if not token:
        logger.error("[AUTH-GATE] Access Denied: Bearer authorization token completely absent from headers.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # Decode token payload using the centralized configuration key and signature algorithms
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY.get_secret_value(), 
            algorithms=["HS256"]
        )
        username: str = payload.get("sub", "")
        if not username:
            logger.error("[AUTH-GATE] Malformed Claim Set: Field 'sub' is empty inside the decrypted token.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload layout.",
            )
        
        logger.debug(f"[AUTH-GATE] User '{username}' successfully authenticated via JWT validation.")
        return {"username": username, "role": payload.get("role", "USER")}

    except JWTError as jwt_exc:
        logger.error(f"[AUTH-GATE] Cryptographic Validation Failure: Token is expired or corrupted: {jwt_exc}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or token verification failed.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# =====================================================================
# HIGH-EFFICIENCY ASYNCHRONOUS WEBSOCKET CONNECTION MANAGER
# =====================================================================
class ConnectionManager:
    """
    Manages active WebSocket sessions for push alert broadcasts.
    Includes concurrent connection tracing, safe error handling, 
    and protective garbage collection of broken connections.
    """
    def __init__(self) -> None:
        # Using a list for active tracking; could be extended to a dict keyed by user_id
        self._active_connections: List[WebSocket] = []
        # Structural lock to guarantee thread isolation during structural state shifts
        self._lock: Final[asyncio.Lock] = asyncio.Lock()

    @property
    def connection_count(self) -> int:
        """Returns the total number of telemetry clients currently bound to this instance."""
        return len(self._active_connections)

    async def connect(self, websocket: WebSocket) -> None:
        """Accepts a connection and safely saves it to the tracking matrix."""
        await websocket.accept()
        async with self._lock:
            self._active_connections.append(websocket)
        logger.info(f"[WS-MANAGER] New client channel accepted. Concurrent connections active: {self.connection_count}")

    async def disconnect(self, websocket: WebSocket) -> None:
        """Safely removes a disconnected socket from memory to prevent leaks."""
        async with self._lock:
            if websocket in self._active_connections:
                self._active_connections.remove(websocket)
        logger.info(f"[WS-MANAGER] Client disconnected. Remaining pool count: {self.connection_count}")

    async def broadcast(self, message: Dict[str, Any]) -> None:
        """
        Broadcasts JSON payloads concurrently to all active client dashboards.
        
        Uses an isolated task group to prevent a single slow or dead client connection 
        from causing network bottlenecks across the entire application thread.
        """
        if not self._active_connections:
            return

        logger.debug(f"[WS-MANAGER] Dispatching real-time event broadcast payload to {self.connection_count} clients.")
        
        async with self._lock:
            # Create snapshot copy to safely loop through without blocking state changes
            current_pool = list(self._active_connections)

        # Build individual async transfer tasks for each active connection
        broadcast_tasks = [self._send_safe_json(ws, message) for ws in current_pool]
        
        # Execute all transfers concurrently across the server event loop
        await asyncio.gather(*broadcast_tasks, return_exceptions=True)

    async def _send_safe_json(self, websocket: WebSocket, message: Dict[str, Any]) -> None:
        """Sends data to a specific socket and handles connection drops gracefully."""
        try:
            await websocket.send_json(message)
        except Exception as ws_err:
            logger.warning(f"[WS-MANAGER] Found dead network socket channel during broadcast. Cleaning up: {ws_err}")
            # Automatically clean up connection from memory if the client dropped silently
            await self.disconnect(websocket)


# Initialize the atomic, thread-isolated singleton instance for application wide injection
manager: Final[ConnectionManager] = ConnectionManager()

__all__: Final[List[str]] = ["manager", "get_current_active_user", "ConnectionManager"]