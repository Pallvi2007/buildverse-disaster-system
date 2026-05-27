import React, { useState } from 'react';
import { PipelineState } from '../App';

interface HITLGateProps {
  state: PipelineState | null;
  onRefine: (feedback: string) => void;
  isLoading: boolean;
}

const HITLGate: React.FC<HITLGateProps> = ({ state, onRefine, isLoading }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [approvedSuccess, setApprovedSuccess] = useState<boolean>(false);

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onRefine(feedback.trim());
      setFeedback('');
    }
  };

  const handleApprove = () => {
    setApprovedSuccess(true);
    setTimeout(() => setApprovedSuccess(false), 5000);
  };

  if (!state) {
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center group min-h-[450px]">
        <div className="w-16 h-16 bg-slate-900/80 border border-slate-800 rounded-full flex items-center justify-center text-slate-500 text-xl font-mono mb-4 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors duration-300">
          //
        </div>
        <h3 className="text-slate-300 font-medium mb-1">Awaiting Telemetry Initialization</h3>
        <p className="text-slate-500 text-xs max-w-sm font-mono">
          Submit an incident tracking vector from the Command Deck to stream runtime nodes.
        </p>
      </div>
    );
  }

  const isThreat = !state.disaster_prediction.includes("Stable");

  // Safeguard extraction of nested dictionary variables populated by your live requests engine
  const metrics = (state as any).weather_metrics || {};

  return (
    <div className="space-y-6">
      {/* Central Analytical Data Visualization */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/40 space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-3">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-0.5">
              Processing Matrix Results
            </h2>
            <p className="text-xl font-bold text-white tracking-tight">{state.location}</p>
          </div>
          <span className={`self-start sm:self-auto px-3 py-1.5 rounded-full font-mono text-xs font-bold tracking-wide border uppercase ${
            isThreat 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-lg shadow-rose-950/20 animate-pulse' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {state.disaster_prediction}
          </span>
        </div>

        {/* NEW ADDITION: Live Telemetry Metrics Sub-Deck Array */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-center">
            <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-0.5">Temperature</span>
            <span className="text-sm font-mono text-white font-semibold">
              {metrics.temp !== undefined ? `${metrics.temp}°C` : 'N/A'}
            </span>
          </div>
          <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-center">
            <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-0.5">Humidity</span>
            <span className="text-sm font-mono text-white font-semibold">
              {metrics.humidity !== undefined ? `${metrics.humidity}%` : 'N/A'}
            </span>
          </div>
          <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-center">
            <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-0.5">Wind Velocity</span>
            <span className="text-sm font-mono text-white font-semibold">
              {metrics.wind_speed !== undefined ? `${metrics.wind_speed} m/s` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Action Plan Output Frame */}
        <div className="bg-slate-950/50 border border-white/5 rounded-xl p-5 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <h4 className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
            Synthesized Tactical Mitigation Plan
          </h4>
          <p className="text-slate-200 text-sm leading-relaxed select-text font-sans">
            {state.action_plan}
          </p>
        </div>

        {/* Historic Insight Rules Store */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
            <span>Active Knowledge Matrix Rules ({state.insights?.length || 0})</span>
          </h4>
          {!state.insights || state.insights.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 italic bg-slate-950/20 border border-dashed border-slate-800 rounded-lg p-3">
              No historical override corrections appended to this thread identifier yet.
            </p>
          ) : (
            <div className="max-h-28 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {state.insights.map((insight, index) => (
                <div key={index} className="bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 flex items-start gap-2.5">
                  <span className="text-blue-400 font-bold">#{index + 1}</span>
                  <span className="flex-1 select-text leading-normal">{insight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HUMAN IN THE LOOP ACTIVE OVERLAY CONTROLS */}
        {approvedSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-4 rounded-xl text-center font-mono text-xs tracking-wide shadow-lg shadow-emerald-950/20">
            ✓ DISPATCH_SUCCESS: Mitigation matrix deployed to assigned response channels.
          </div>
        ) : (
          <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] text-white font-medium text-xs font-mono tracking-wider uppercase px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-900/20 transition-all duration-150 disabled:opacity-50"
            >
              APPROVE_AND_DISPATCH
            </button>
            <span className="text-xs font-mono text-slate-500 uppercase hidden sm:inline">// OR</span>
            <p className="text-xs text-slate-400 font-mono flex-1 text-center sm:text-left">
              Reject or append criteria structural parameters using the loop console below.
            </p>
          </div>
        )}
      </div>

      {/* Refinement Self-Improving Feedback Loop Entry Console */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/40">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-bold">
          Self-Improving Optimizer Console
        </h4>
        <form onSubmit={handleRefineSubmit} className="flex gap-3">
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isLoading || approvedSuccess}
            placeholder="Provide architectural override instructions or missing parameters..."
            className="flex-1 bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-all duration-150 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !feedback.trim() || approvedSuccess}
            className="bg-slate-900 hover:bg-slate-800 active:scale-[0.97] text-blue-400 hover:text-blue-300 border border-blue-500/20 font-mono text-xs px-5 py-3 rounded-xl tracking-wider font-semibold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
          >
            OPTIMIZE
          </button>
        </form>
      </div>
    </div>
  );
};

export default HITLGate;