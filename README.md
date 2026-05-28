# BuildVerse Ops Engine

An enterprise-grade, autonomous mitigation orchestrator and command center dashboard designed to track, simulate, and manage tactical response protocols across localized sector vectors in real-time.

---

## 🚀 Key Features

* **Generalized Architecture**: Completely dynamic city parameter generation utilizing cryptographic string hashing to remove hardcoded city configurations entirely.
* **Deterministic Telemetry Simulations**: Every unique city name inputted by an operator works as a localized seed, ensuring consistent weather metrics (temperature, humidity, wind) and risk classifications unique to that specific topography.
* **Live Telemetry Matrix Stream**: Real-time WebSocket communication loop providing persistent, continuous streaming of simulated infrastructure logs down to the dashboard terminal feed.
* **Premium Enterprise UI**: Glassmorphism design system built with responsive layouts, micro-glow alert badges, and smooth state transitions powered by Framer Motion.

---

## 🛠️ System Architecture

The application is built using a decoupled client-server framework optimized for high-throughput operational visualization:

* **Frontend Core**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, and Lucide React.
* **Backend Engine**: FastAPI (Python 3.10+), WebSockets API, Pydantic data validation, and Uvicorn runtime server.

---

## 🔧 Installation & Setup

### Prerequisites
* Python 3.10 or higher
* Node.js 18.x or higher
* `npm` or `yarn`

### 1. Backend Configuration
Open your terminal, navigate into the backend subdirectory of your project, initialize your virtual environment, install dependencies, and launch the server:

```bash
# Navigate to backend directory
cd buildverse-disaster-system/backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install required backend dependencies
pip install fastapi uvicorn pydantic

# Launch the FastAPI application server
python app/main.py
