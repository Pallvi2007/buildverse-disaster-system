BuildVerse Ops Engine
An enterprise-grade, autonomous mitigation orchestrator and command center dashboard designed to track, simulate, and manage tactical response protocols across localized sector vectors in real-time.

🚀 Key Features
Generalized Architecture: Completely dynamic city parameter generation utilizing cryptographic string hashing to completely remove hardcoded city configurations.
Deterministic Telemetry Simulations: Every unique city name inputted by an operator works as a localized seed, ensuring consistent weather metrics (temperature, humidity, wind) and risk classifications unique to that specific topography.
Live Telemetry Matrix Stream: Multi-threaded WebSocket communication loop providing persistent, real-time streaming of simulated infrastructure logs down to the dashboard terminal feed.
Premium Enterprise UI: Glassmorphism design system built with responsive layouts, micro-glow alert badges, and smooth state animations powered by Framer Motion.

🛠️ System Architecture
The application is built using a decoupled client-server framework optimized for high-throughput operational visualization:
Frontend Core: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, and Lucide React.
Backend Engine: FastAPI (Python 3.10+), WebSockets API, Pydantic data validation, and Uvicorn runtime server.

🔧 Installation & Setup
Prerequisites
Python 3.10 or higher
Node.js 18.x or higher
npm or yarn

1. Backend Configuration
Navigate into the backend project root, set up your Python virtual environment, install dependencies, and spin up the Uvicorn live reload server:
# Navigate to backend directory
cd buildverse-disaster-system/backend
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
# Install required dependencies
pip install fastapi uvicorn pydantic
# Launch the FastAPI app server
python app/main.py
The backend services will spin up and accept connections at http://127.0.0.1:8000.

2. Frontend Configuration
Open a secondary terminal tab, install the package matrix, and start the development bundler interface:
Bash
# Navigate to frontend directory
cd buildverse-disaster-system/frontend
# Install package nodes
npm install
# Run the local client developer interface
npm run dev
The management dashboard web client will launch locally at http://127.0.0.1:5180.

🧪 Operational Workflow Simulation
Establish Link: Ensure the UPLINK: LIVE stream status lights up green in the top right header navigation bar, verifying active WebSocket communication layers.
Submit Target Coordinate: Click on any pre-defined sector button (e.g., Tokyo, Mumbai, San Francisco, New Delhi) or input a custom location parameter string.
Execute Response Protocol: Click the main action button to push the incident telemetry payload through to the server checkpointer via an HTTP POST request.
Review Metrics Parsing: The UI will dynamically shift from an idle telemetry state to parse custom micro-climate metrics, structural action plans, and dynamic threat assessments specific to the seed of the selected coordinate.
