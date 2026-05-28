import React from 'react';
import { Cpu, Radio, Shield, Loader2, Database } from 'lucide-react';
import { PipelineState } from '../App';

interface PhaseBControlProps {
  state: PipelineState | null;
  isLoading: boolean;
}

export const PhaseBControl: React.FC<PhaseBControlProps> = ({ state, isLoading }) => {
  
  if (!state) {
    return (
      <div className="bg-bg-surface/50 backdrop-blur-xl border border-border-dim rounded-2xl p-6 text-slate-400 shadow-card">
        <div className="flex items-center gap-3 border-b border-border-dim pb-4 mb-4">
          <Cpu className="text-accent-blue w-4 h-4" />
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase">System Core Telemetry</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Database className="w-6 h-6 text-slate-700 mb-3" />
          <p className="text-[10px] font-mono uppercase tracking-widest">Awaiting uplink parameters...</p>
        </div>
      </div>
    );
  }

  const hasPrediction = !!state.disaster_prediction;
  const hasActionPlan = !!state.action_plan;

  const getWorkflowMetrics = () => {
    if (isLoading) return { label: "Ingesting Data", color: "bg-accent-blue", width: "w-1/3" };
    if (hasActionPlan) return { label: "Pipeline Finalized", color: "bg-emerald-500", width: "w-full" };
    if (hasPrediction) return { label: "Governance Pending", color: "bg-amber-500", width: "w-2/3" };
    return { label: "Initializing", color: "bg-accent-blue", width: "w-12" };
  };

  const metrics = getWorkflowMetrics();

  return (
    <div className="bg-bg-surface/50 backdrop-blur-xl border border-border-dim rounded-2xl p-6 shadow-card transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-dim pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Cpu className="text-accent-blue w-4 h-4 animate-pulse" />
          <h3 className="text-[10px] font-bold text-slate-200 tracking-[0.2em] uppercase">System Core Telemetry</h3>
        </div>
        <div className="flex items-center gap-2 bg-bg-base px-3 py-1 rounded-lg border border-border-dim font-mono text-[9px] text-slate-400">
          <Radio className={`w-3 h-3 ${isLoading ? 'text-accent-blue animate-spin' : 'text-slate-500'}`} />
          <span>PHASE_B_LINK</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-bg-base/50 border border-border-dim rounded-xl p-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vector</span>
          <span className="font-mono text-[11px] text-white font-bold">{state.location.toUpperCase()}</span>
        </div>

        <div className="flex justify-between items-center bg-bg-base/50 border border-border-dim rounded-xl p-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
          <span className="flex items-center gap-2 font-mono text-[11px] text-slate-200">
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
            {metrics.label}
          </span>
        </div>

        {/* Progress Gauge */}
        <div className="h-1.5 w-full bg-bg-base border border-border-dim rounded-full overflow-hidden">
          <div className={`h-full ${metrics.color} transition-all duration-500 ease-out ${metrics.width}`} />
        </div>
      </div>
    </div>
  );
};

export default PhaseBControl;