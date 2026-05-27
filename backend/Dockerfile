# =====================================================================
# BuildVerse Disaster Management Engine - Production Dockerfile
# =====================================================================
FROM python:3.11-slim

# Inject Python environment optimizations
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install native system dependencies for the SQLite checkpointing layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy backend source files directly into the context
COPY . .

EXPOSE 8000

# Fix: Points directly to main:app root module
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]