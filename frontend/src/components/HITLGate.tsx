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
  Layers 
} from 'lucide-react';
import { PipelineState } from '../App';

// =====================================================================
// TYPING CONTRACT DEFINITIONS
// =====================================================================
interface HITLGateProps {
  /** Explicitly typed core data state synced directly from the backend LangGraph engine */
  state: PipelineState | null;
  /** Callback to submit human refinement notes or missing structural vectors back to the thread */
  onRefine: (feedback: string) => Promise<void> | void;
  /** Direct gateway action to release the agent state hold and execute deployment */
  onApprove: () => Promise<void> | void;
  /** Global transaction indicator tracking outbound operational requests */
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
    setFeedback(''); // Safely purge input upon async completion
  };

  // --- 1. EMPTY / UNINITIALIZED FALLBACK UI STATE ---
  if (!state) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center group min-h-[480px] transition-all duration-300 hover:border-slate-800">
        <div className="w-16 h-16 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 font-mono mb-5 group-hover:border-blue-500/30 group-hover:text-blue-400 shadow-inner transition-all duration-300">
          <Terminal className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-slate-300 font-semibold tracking-wide text-sm mb-1.5">
          Awaiting Telemetry Initialization
        </h3>
        <p className="text-slate-500 text-xs max-w-xs font-mono leading-relaxed">
          Submit an incident tracking vector from the Command Deck to stream live runtime nodes.
        </p>
      </div>
    );
  }

  // Determine hazard risk thresholds matching your backend validation metrics
  const isThreatActive = state.disaster_prediction && !state.disaster_prediction.includes("Stable");
  
  // Safe extraction of type-safe weather properties nested within the incoming state payload
  const metrics = state.weather_metrics || { temp: 0, humidity: 0, wind_speed: 0 };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* --- 2. ANALYTICAL STATE REPORT MATRIX --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/30 space-y-5 relative overflow-hidden">
        
        {/* Decorative background radar grid */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none" />

        {/* Location Header Information Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-blue-500" /> Processing Matrix Results
            </span>
            <p className="text-lg font-bold text-white tracking-tight">{state.location}</p>
          </div>
          
          <span className={`self-start sm:self-auto px-3.5 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider border uppercase transition-all duration-300 ${
            isThreatActive 
              ? 'bg-red-950/60 text-red-400 border-red-800/50 shadow-md shadow-red-950/20 animate-pulse' 
              : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
          }`}>
            {state.disaster_prediction || 'CALCULATING CONTEXT...'}
          </span>
        </div>

        {/* Dynamic IoT Sensor Telemetry Deck Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950/60 border border-slate-800/50 rounded-xl p-3 flex flex-col items-center justify-center transition-colors hover:bg-slate-950">
            <Thermometer className="w-4 h-4 text-orange-400/80 mb-1" />
            <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Temp</span>
            <span className="text-xs font-mono text-slate-200 font-bold mt-0.5">
              {metrics.temp !== undefined ? `${metrics.temp}°C` : '--'}
            </span>
          </div>
          
          <div className="bg-slate-950/60 border border-slate-800/50 rounded-xl p-3 flex flex-col items-center justify-center transition-colors hover:bg-slate-950">
            <Droplets className="w-4 h-4 text-blue-400/80 mb-1" />
            <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Humidity</span>
            <span className="text-xs font-mono text-slate-200 font-bold mt-0.5">
              {metrics.humidity !== undefined ? `${metrics.humidity}%` : '--'}
            </span>
          </div>
          
          <div className="bg-slate-950/60 border border-slate-800/50 rounded-xl p-3 flex flex-col items-center justify-center transition-colors hover:bg-slate-950">
            <Wind className="w-4 h-4 text-teal-400/80 mb-1" />
            <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Velocity</span>
            <span className="text-xs font-mono text-slate-200 font-bold mt-0.5">
              {metrics.wind_speed !== undefined ? `${metrics.wind_speed} m/s` : '--'}
            </span>
          </div>
        </div>

        {/* Tactical Mitigation Synthesizer Card */}
        <div className="bg-slate-950/60 border border-slate-800/40 rounded-xl p-4.5 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Synthesized Tactical Mitigation Plan
          </h4>
          <p className="text-slate-300 text-xs leading-relaxed select-text font-sans antialiased">
            {state.action_plan || 'Assembling localized hazard criteria arrays... Open external endpoints connection to continue.'}
          </p>
        </div>

        {/* Persistent Checkpoint Knowledge Matrix Store */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <span>Active Knowledge Matrix Rules ({state.insights?.length || 0})</span>
          </h4>
          
          {!state.insights || state.insights.length === 0 ? (
            <p className="text-[11px] font-mono text-slate-600 italic bg-slate-950/20 border border-dashed border-slate-800 rounded-xl p-3.5 text-center">
              No historical override corrections appended to this thread identifier yet.
            </p>
          ) : (
            <div className="max-h-32 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {state.insights.map((insight, index) => (
                <div 
                  key={index} 
                  className="bg-slate-950/50 border border-slate-800/60 rounded-xl px-3 py-2.5 text-[11px] font-mono text-slate-300 flex items-start gap-2.5 transition-all hover:border-slate-800"
                >
                  <span className="text-blue-500 font-bold shrink-0">#{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex-1 select-text leading-normal text-slate-300">{insight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Direct Action Dispatch Block */}
        <div className="border-t border-slate-800/60 pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onApprove}
            disabled={isLoading}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 active:scale-98 text-white font-bold text-xs font-mono tracking-wider uppercase px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-950/10 transition-all duration-150 flex items-center justify-center gap-2"
          >
            {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            APPROVE_AND_DISPATCH
          </button>
          
          <span className="text-xs font-mono text-slate-600 uppercase hidden sm:inline">// OR</span>
          <p className="text-[11px] text-slate-500 font-mono flex-1 text-center sm:text-left leading-normal">
            Reject or append criteria structural parameters using the loop console below.
          </p>
        </div>

      </div>

      {/* --- 3. THE REFINEMENT CRITERIA CONSOLE --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl shadow-black/30">
        <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-3 font-bold">
          Self-Improving Optimizer Console
        </h4>
        
        <form onSubmit={handleRefineSubmit} className="flex gap-3">
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isLoading}
            placeholder="Provide architectural override instructions or missing parameters..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <button
            type="