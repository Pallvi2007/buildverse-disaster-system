import React from 'react';
import { Cpu, Radio, Shield, Loader2, Database } from 'lucide-react';
import { PipelineState } from '../App';

// =====================================================================
// TYPING CONTRACT DEFINITIONS
// =====================================================================
interface PhaseBControlProps {
  /** Core state ledger object synced directly from the LangGraph processing framework */
  state: PipelineState | null;
  /** Global execution tracking flag indicating active asynchronous server requests */
  isLoading: boolean;
}

// =====================================================================
// PRODUCTION HARDENED TELEMETRY MONITOR COMPONENT
// =====================================================================
export const PhaseBControl: React.FC<PhaseBControlProps> = ({ 
  state, 
  isLoading 
}) => {
  
  // --- 1. UNINITIALIZED / IDLE RUNTIME FALLBACK VIEW ---
  if (!state) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-300 font-sans shadow-lg transition-all">
        <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
          <Cpu className="text-indigo-500 w-4 h-4" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            System Core Telemetry
          </h3>
        </div>
        
        <div className="mt-4 flex flex-col items-center justify-center py-4 text-center">
          <Database className="w-5 h-5 text-slate-700 animate-pulse mb-2" />
          <p className="text-[11px] font-mono text-slate-500">
            Awaiting execution dispatch parameters...
          </p>
        </div>
      </div>
    );
  }

  // --- 2. EVALUATE RUNTIME PROGRESSION STEPS ---
  const hasPrediction = !!state.disaster_prediction;
  const hasActionPlan = !!state.action_plan;

  // Calculate granular progress tracking indicators based on available graph data
  const getWorkflowMetrics = () => {
    if (isLoading) {
      return { label: "Ingesting Data & Resolving Matrix", progressClass: "w-1/3 bg-blue-500" };
    }
    if (hasActionPlan) {
      return { label: "Pipeline Evaluation Finalized", progressClass: "w-full bg-emerald-500" };
    }
    if (hasPrediction) {
      return { label: "Hazards Calculated // Awaiting Governance Clearance", progressClass: "w-2/3 bg-amber-500" };
    }
    return { label: "Initializing State Subsystem", progressClass: "w-12 bg-indigo-500 animate-pulse" };
  };

  const currentWorkflow = getWorkflowMetrics();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-300 font-sans shadow-xl relative overflow-hidden transition-all duration-300 hover:border-slate-750">
      
      {/* Decorative top illumination accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* Module Operational Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Cpu className="text-indigo-400 w-4 h-4 animate-pulse" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            System Core Telemetry
          </h3>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/60 font-mono text-[9px] text-slate-500">
          <Radio className={`w-2.5 h-2.5 ${isLoading ? 'text-blue-400 animate-spin' : 'text-indigo-500'}`} />
          <span>STREAM_PHASE_B</span>
        </div>
      </div>

      {/* Operational Variable Log Deck */}
      <div className="mt-4 space-y-3 font-mono text-[11px]">
        
        {/* Geographic Coordinate Vector */}
        <div className="flex justify-between items-center bg-slate-950/40 border border-slate-850 rounded-lg p-2.5">
          <span className="text-slate-500 text-[10px] uppercase tracking-wide">Target Vector:</span>
          <span className="text-slate-200 font-bold tracking-wide">{state.location}</span>
        </div>

        {/* Dynamic State Machine Tracker */}
        <div className="flex justify-between items-center bg-slate-950/40 border border-slate-850 rounded-lg p-2.5">
          <span className="text-slate-500 text-[10px] uppercase tracking-wide">Status Index:</span>
          <span className={`font-bold flex items-center gap-1.5 ${
            isLoading ? 'text-blue-400' : hasActionPlan ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            {!isLoading && <Shield className="w-3 h-3" />}
            {currentWorkflow.label}
          </span>
        </div>

        {/* Strategic Data Progress Gauge Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="h-1.5 w-full bg-slate-950 border border-slate-850 rounded-full overflow-hidden p-[1px]">
            <div className={`h-full rounded-full transition-all duration-500 ease-out ${currentWorkflow.progressClass}`} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PhaseBControl;