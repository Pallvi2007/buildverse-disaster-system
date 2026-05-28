import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Thermometer, 
  Droplets, 
  Wind, 
  Send, 
  CheckCircle, 
  Activity, 
  Layers,
  MapPin,
  AlertTriangle,
  Radio,
  FileText
} from 'lucide-react';

// =====================================================================
// TYPING CONTRACT DEFINITIONS
// =====================================================================
export interface PipelineState {
  thread_id: string;
  location: string;
  disaster_prediction: string;
  action_plan: string;
  weather_metrics?: {
    temp?: number;
    humidity?: number;
    wind_speed?: number;
  };
  insights?: string[];
  logs?: Array<{
    timestamp: string;
    sector: string;
    severity: string;
    status: string;
  }>;
}

interface HITLGateProps {
  state: PipelineState | null;
  onRefine: (feedback: string) => Promise<void> | void;
  onApprove: () => Promise<void> | void;
  isLoading: boolean;
}

// =====================================================================
// COMPONENT MAIN ARCHITECTURE
// =====================================================================
const HITLGate: React.FC<HITLGateProps> = ({ 
  state, 
  onRefine, 
  onApprove,
  isLoading 
}) => {
  const [feedback, setFeedback] = useState<string>('');

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || isLoading) return;
    
    await onRefine(feedback.trim());
    setFeedback(''); 
  };

  // --- 1. EMPTY / UNINITIALIZED FALLBACK UI STATE ---
  if (!state) {
    return (
      <div className="bg-slate-900/30 border border-slate-800/60 backdrop-blur-xl rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center group min-h-[520px] transition-all duration-500 hover:border-slate-700/60 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="w-16 h-16 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 font-mono mb-5 group-hover:border-blue-500/30 group-hover:text-blue-400 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] shadow-inner transition-all duration-500">
          <Terminal className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-slate-300 font-semibold tracking-wide text-sm mb-1.5 font-mono">
          SYSTEM_AWAITING_TELEMETRY
        </h3>
        <p className="text-slate-500 text-xs max-w-xs font-mono leading-relaxed">
          Submit an incident tracking vector from the Command Deck to stream live runtime nodes.
        </p>
      </div>
    );
  }

  // Determine hazard risk thresholds matching your backend validation metrics
  const isThreatActive = state.disaster_prediction && !state.disaster_prediction.includes("Stable");
  const metrics = state.weather_metrics || { temp: 0, humidity: 0, wind_speed: 0 };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      {/* --- 2. ANALYTICAL STATE REPORT MATRIX --- */}
      <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl shadow-black/40 space-y-6 relative overflow-hidden">
        
        {/* Neon Cyber Accent Overlay */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${isThreatActive ? 'bg-gradient-to-r from-red-500 via-amber-500 to-transparent' : 'bg-gradient-to-r from-emerald-500 to-transparent'}`} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.015] rounded-full blur-3xl pointer-events-none" />

        {/* Location & Status Header Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-5 gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl border mt-0.5 ${isThreatActive ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-blue-500 animate-spin-slow" /> LangGraph Pipeline Node
              </span>
              <p className="text-xl font-bold text-white tracking-tight">{state.location}</p>
            </div>
          </div>
          
          {/* Dynamically Styled Threat Indicator Status Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[10px] font-bold tracking-wider border uppercase transition-all duration-300 shadow-sm ${
            isThreatActive 
              ? 'bg-red-950/40 text-red-400 border-red-800/40 shadow-red-950/20 animate-pulse' 
              : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40 shadow-emerald-950/10'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isThreatActive ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
            {isThreatActive ? 'Threat Vector Detected' : 'Stable Condition'}
          </div>
        </div>

        {/* --- 3. METRICS AND THREAT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Prediction Card */}
          <div className="md:col-span-7 bg-slate-950/40 border border-slate-800/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Categorical Intelligence Prediction
            </div>
            <div className={`text-sm font-semibold leading-relaxed ${isThreatActive ? 'text-red-300/90' : 'text-emerald-300/90'}`}>
              {state.disaster_prediction}
            </div>
            {state.insights && state.insights.length > 0 && (
              <div className="pt-2 border-t border-slate-800/40 space-y-1.5">
                {state.insights.map((insight, idx) => (
                  <div key={idx} className="text-[11px] font-mono text-slate-400 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">↳</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Environmental Conditions Telemetry */}
          <div className="md:col-span-5 bg-slate-950/40 border border-slate-800/50 rounded-xl p-5 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-blue-500" />
              Sensor Array Matrix
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2.5 space-y-1">
                <Thermometer className="w-4 h-4 mx-auto text-orange-400" />
                <span className="block text-[10px] font-mono text-slate-500">TEMP</span>
                <span className="text-xs font-bold text-white font-mono">{metrics.temp ?? 0}°C</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2.5 space-y-1">
                <Droplets className="w-4 h-4 mx-auto text-blue-400" />
                <span className="block text-[10px] font-mono text-slate-500">HUMID</span>
                <span className="text-xs font-bold text-white font-mono">{metrics.humidity ?? 0}%</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-2.5 space-y-1">
                <Wind className="w-4 h-4 mx-auto text-teal-400" />
                <span className="block text-[10px] font-mono text-slate-500">WIND</span>
                <span className="text-xs font-bold text-white font-mono">{metrics.wind_speed ?? 0}m/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- 4. ACTION PLAN TEXT AREA --- */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-5 space-y-3 relative group">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-blue-400" /> Orchestration Action Mitigation Protocol
            </span>
            <span className="text-slate-600 group-hover:text-slate-500 transition-colors font-mono">
              ID: {state.thread_id.substring(0, 14)}...
            </span>
          </div>
          <div className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-900 overflow-y-auto max-h-48 custom-scrollbar selection:bg-blue-500/20">
            {state.action_plan || "No autonomous mitigation protocol generated for this current thread context state."}
          </div>
        </div>

        {/* --- 5. INTERACTION & CONTROL DESK ZONE --- */}
        <div className="pt-4 border-t border-slate-800/60 flex flex-col md:flex-row items-center gap-4">
          <form onSubmit={handleRefineSubmit} className="w-full md:flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Inject steering telemetry or manual adjustments into plan..."
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 disabled:opacity-50 transition-all pr-10"
              />
              <span className="absolute right-3.5 top-3.5 text-[10px] text-slate-600 font-mono select-none pointer-events-none">
                HITL
              </span>
            </div>
            <button
              type="submit"
              disabled={isLoading || !feedback.trim()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800 border border-slate-700/60 p-3 rounded-xl transition-all flex items-center justify-center hover:text-white"
              title="Submit Parameter Refinement"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="w-full md:w-auto h-px md:h-8 w-full md:w-px bg-slate-800/60" />

          <button
            onClick={onApprove}
            disabled={isLoading}
            className={`w-full md:w-auto px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg ${
              isThreatActive
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-orange-950/20'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-blue-950/20'
            } disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]`}
          >
            <CheckCircle className="w-4 h-4" />
            {isLoading ? 'Executing Request...' : isThreatActive ? 'Override & Force Deployment' : 'Approve & Deploy State'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default HITLGate;