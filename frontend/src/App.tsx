import React, { useState } from 'react';
import { Shield, Activity, Radio, Cpu } from 'framer-motion/node_modules/framer-motion'; // Fallback to standard lucide if path differs
import { Terminal, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// Component Layer Ecosystem Imports
import { Layout } from './components/layout/Layout';
import { ControlPanel } from './components/dashboard/ControlPanel';
import { TelemetryFeed } from './components/dashboard/TelemetryFeed';
import { PhaseBControl } from './components/dashboard/PhaseBControl';
import HITLGate from './components/dashboard/HITLGates';
import { AdminGuard } from './components/auth/AdminGuard';

// Resilient Asynchronous Ingestion Hooks
import { useTelemetry } from './hooks/useTelemetry';
import { 
  useDisasterState, 
  useTriggerIncident, 
  useApproveMitigation 
} from './hooks/useDisasterState';

// =====================================================================
// MASTER APPLICATION GRAPH STATE SCHEMAS
// =====================================================================
export interface PipelineState {
  location: string;
  disaster_prediction: 'Stable' | 'ACTIVE' | 'AWAITING_APPROVAL' | 'CRITICAL' | string;
  action_plan: string;
  insights: string[];
  weather_metrics: {
    temp: number;
    humidity: number;
    wind_speed: number;
  };
}

// Fixed workspace profile matching local storage session tokens
const MOCK_CURRENT_USER = {
  role: 'admin', // Toggle to 'user' to test AdminGuard UI interventions
};

export default function App() {
  // 1. PERSISTENT WORKSPACE RETENTION MATRIX
  // Anchoring the session thread ID directly in local state ensures that updates
  // to weather telemetry, agent iterations, and human decisions stay in sync.
  const [currentThreadId] = useState<string>(() => `thread_session_${Date.now()}`);

  // 2. LIVE SYNCHRONIZATION HOOKS
  const { logs, isConnected: isWsConnected } = useTelemetry();
  const { data: graphState, isLoading: isQueryLoading } = useDisasterState(currentThreadId);

  // 3. MUTATION WORKFLOW TRIGGERS
  const triggerIncidentMutation = useTriggerIncident();
  const approveMitigationMutation = useApproveMitigation();

  // Combine query and mutation loading indicators into a unified tracking state
  const isSystemProcessing = 
    isQueryLoading || 
    triggerIncidentMutation.isPending || 
    approveMitigationMutation.isPending;

  // Resolve engine status flags safely from your backend LangGraph state checkpointers
  const resolvedEngineStatus = graphState?.disaster_prediction?.includes('AWAITING_APPROVAL')
    ? 'AWAITING_APPROVAL'
    : (graphState?.disaster_prediction && !graphState.disaster_prediction.includes('Stable') ? 'ACTIVE' : 'IDLE');

  // --- ACTIONS HANDLERS ---
  const handleIncidentTrigger = async (targetLocation: string) => {
    try {
      await triggerIncidentMutation.mutateAsync({
        threadId: currentThreadId,
        location: targetLocation,
      });
    } catch (err) {
      console.error('[CORE-APP] Core workflow trigger failure:', err);
    }
  };

  const handleGovernanceApproval = async () => {
    try {
      await approveMitigationMutation.mutateAsync({
        threadId: currentThreadId,
      });
    } catch (err) {
      console.error('[CORE-APP] Governance hold release failure:', err);
    }
  };

  const handleOptimizationRefine = async (feedbackNote: string) => {
    try {
      await approveMitigationMutation.mutateAsync({
        threadId: currentThreadId,
        feedback: feedbackNote,
      });
    } catch (err) {
      console.error('[CORE-APP] Optimization refinement injection failure:', err);
    }
  };

  return (
    <Layout>
      {/* 1. REAL-TIME SUB-SYSTEM HEALTH MONITORING HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-500 shadow-md">
            <Shield size={24} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
              BuildVerse Operations Engine
            </h1>
            <p className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest mt-0.5">
              Autonomous Disaster Mitigation Orchestrator
            </p>
          </div>
        </div>

        {/* System Heartbeat & Metrics */}
        <div className="flex flex-wrap gap-3 text-[10px] font-mono font-bold text-slate-500">
          <div className="flex items-center gap-2 border border-slate-800/60 bg-slate-900/30 px-3.5 py-1.5 rounded-lg">
            <span className={`w-1.5 h-1.5 rounded-full ${isWsConnected ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
            <span className="text-slate-400">WS STREAM: {isWsConnected ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
          
          <div className="flex items-center gap-2 border border-slate-800/60 bg-slate-900/30 px-3.5 py-1.5 rounded-lg">
            <Activity size={12} className="text-blue-500" />
            <span className="text-slate-400">THREAD KEY: {currentThreadId.slice(15)}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN APPLICATION WORKSPACE GRID ARCHITECTURE */}
      <motion.div 
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="grid grid-cols-12 gap-6"
      >
        {/* LEFT COMPARTMENT COLUMN: INGESTION COMMAND PLATFORMS */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <ControlPanel 
            onTrigger={handleIncidentTrigger} 
            onApproveMitigation={handleGovernanceApproval}
            isLoading={isSystemProcessing} 
            engineStatus={resolvedEngineStatus}
          />
          
          <PhaseBControl 
            state={graphState || null} 
            isLoading={isSystemProcessing} 
          />
        </section>

        {/* RIGHT COMPARTMENT COLUMN: GOVERNANCE INTELLIGENCE & TELEMETRY */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* HUMAN IN THE LOOP GOVERNANCE CONTROLS GATEWAY */}
          <div className="relative">
            {resolvedEngineStatus === 'AWAITING_APPROVAL' ? (
              <AdminGuard userRole={MOCK_CURRENT_USER.role}>
                <HITLGate 
                  state={graphState || null}
                  onRefine={handleOptimizationRefine}
                  onApprove={handleGovernanceApproval}
                  isLoading={isSystemProcessing}
                />
              </AdminGuard>
            ) : (
              <HITLGate 
                state={graphState || null}
                onRefine={handleOptimizationRefine}
                onApprove={handleGovernanceApproval}
                isLoading={isSystemProcessing}
              />
            )}
          </div>

          {/* STREAMING LOG METRIC GRID TABLE */}
          <TelemetryFeed logs={logs} />
          
        </section>
      </motion.div>
    </Layout>
  );
}