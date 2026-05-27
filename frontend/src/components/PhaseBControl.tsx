export default function PhaseBControl({ state }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-white">
      <h3 className="text-sm font-bold text-indigo-400">System Core Telemetry</h3>
      <div className="mt-2 space-y-2 text-xs">
        <p>Location: {state.location || "Waiting..."}</p>
        <p>Status: {state.disaster_prediction ? "Prediction Complete" : "Ingesting..."}</p>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );
}