# =====================================================================
# BuildVerse Disaster Management Engine - Production Dockerfile
# File: backend/Dockerfile
# Multi-stage-ready, non-root hardened runtime configuration.
# =====================================================================

# 1. Use an explicit, immutable Python base image variant
FROM python:3.11-slim AS runtime-base

# 2. Inject critical Python environment optimizations
# PYTHONDONTWRITEBYTECODE: Prevents writing .pyc files to disk (keeps container lean)
# PYTHONUNBUFFERED: Forces stdout/stderr to stream immediately (vital for Loguru cloud logging)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# 3. Establish a deterministic working directory plane
WORKDIR /app

# 4. Install essential native system dependencies safely
# libsqlite3-dev is included to ensure your checkpointing layer compiles cleanly if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# 5. Leverage Docker layer caching for dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# 6. Create systemic directories and build an unprivileged application user
# This eliminates root execution vulnerabilities entirely
RUN mkdir -p /app/logs \
    && groupadd -r buildverse && useradd -r -g buildverse buildverse \
    && chown -R buildverse:buildverse /app

# 7. Copy the rest of the application codebase with explicit ownership mapping
COPY --chown=buildverse:buildverse . .

# 8. Switch context to the secure non-root user account
USER buildverse

# 9. Expose the networking gateway channel
EXPOSE 8000

# 10. Execute the Uvicorn production ASGI server loop
# Pulls settings dynamically from your compiled app module architecture
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]