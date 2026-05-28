import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle, Radio, Cpu, Server, Activity } from 'lucide-react'; 

// Components
import { Layout } from './components/Layout';
import { ControlPanel } from './components/ControlPanel'; 
import { TelemetryFeed } from './components/TelemetryFeed';
import { PhaseBControl } from './components/PhaseBControl';
import HITLGate, { PipelineState } from './components/HITLGate';

// Hooks
import { useTelemetry } from './hooks/useTelemetry';

export default function App() {
  const [currentThreadId] = useState<string>(() => `thread_session_${Date.now()}`);
  const { logs, isConnected: isWsConnected } = useTelemetry();
  
  // Localized API Sync States
  const [graphState, setGraphState] = useState<PipelineState | null>(null);
  const [isQueryLoading, setIsQueryLoading] = useState<boolean>(false);
  const [isMutationLoading, setIsMutationLoading] = useState<boolean>(false);
  const [hasAuthError, setHasAuthError] = useState<boolean>(false);

  // Helper method to fetch server pipeline state matrix
  const fetchCurrentState = async (threadId: string) => {
    try {
      const stateResponse = await fetch(`http://127.0.0.1:8000/api/v1/disaster/state/${threadId}`);
      if (stateResponse.status === 401 || stateResponse.status === 403) {
        setHasAuthError(true);
        return;
      }
      const data = await stateResponse.json();
      setGraphState(data);
    } catch (err) {
      console.error("Failed to fetch pipeline state context structures:", err);
    }
  };

  // Trigger disaster protocol channel
  const handleTriggerIncident = async (location: string) => {
    setIsMutationLoading(true);
    setHasAuthError(false);
    try {
      const triggerResponse = await fetch('http://127.0.0.1:8000/api/v1/disaster/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: currentThreadId, location })
      });

      if (triggerResponse.status === 401 || triggerResponse.status === 403) {
        setHasAuthError(true);
        return;
      }

      await fetchCurrentState(currentThreadId);
    } catch (err) {
      console.error("Link dropped while deploying mitigation vector:", err);
    } finally {
      setIsMutationLoading(false);
    }
  };

  const handleApproveMitigation = async () => {
    alert("Mitigation strategy approved. Dispatch vectors deployed successfully.");
  };

  const handleRefineMitigation = (feedback: string) => {
    alert(`Refinement parameter injected into engine: ${feedback}`);
  };

  const isSystemProcessing = isQueryLoading || isMutationLoading;

  const predictionStr = typeof graphState?.disaster_prediction === 'object'
    ? JSON.stringify(graphState.disaster_prediction)
    : graphState?.disaster_prediction || '';

  const resolvedEngineStatus = predictionStr.includes('AWAITING_APPROVAL')
    ? 'AWAITING_APPROVAL'
    : (predictionStr && !predictionStr.includes('Stable') ? 'ACTIVE' : 'IDLE');

  return (
    <Layout>
      <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200 selection:text-blue-200">
        
        {/* TOP STATUS GLOW BAR */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-purple-500/0" />

        {/* 1. ENTERPRISE HEADER SECTION */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-800/60 bg-slate-900/20 backdrop-blur-md px-6 py-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Shield className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  BuildVerse Ops Engine
                </h1>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-400 border border-slate-700/50 uppercase tracking-wider">
                  v2.0.4
                </span>
              </div>
              <p className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-[0.25em] mt-0.5">
                Autonomous Mitigation Orchestrator
              </p>
            </div>
          </div>

          {/* System Telemetry Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 shadow-inner">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-mono text-slate-400">NODE: 172.21.29.181</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 shadow-inner">
              <Radio className={`w-3.5 h-3.5 ${isWsConnected ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
              <span className="text-[10px] font-mono tracking-wider uppercase text-slate-300">
                UPLINK: <span className={isWsConnected ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{isWsConnected ? 'LIVE' : 'OFFLINE'}</span>
              </span>
            </div>
          </div>
        </header>

        {/* 2. GRID ARCHITECTURE CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-12 gap-6"
        >
          {/* Left Column Controls */}
          <section className="col-span-12 lg:col-span-4 space-y-6">
            <div className="transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <ControlPanel 
                onTrigger={(loc) => handleTriggerIncident(loc)}
                onApproveMitigation={handleApproveMitigation}
                isLoading={isSystemProcessing} 
                engineStatus={resolvedEngineStatus}
              />
            </div>
            <div className="transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <PhaseBControl state={graphState || null} isLoading={isSystemProcessing} />
            </div>
          </section>

          {/* Right Column Monitor Panel */}
          <section className="col-span-12 lg:col-span-8 space-y-6">
            <div className="relative bg-slate-900/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm min-h-[420px] flex flex-col justify-between">
              
              {/* Subtle grid background pattern overlay for dashboard context */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

              <div className="relative p-1 z-10 flex-grow flex flex-col justify-between">
                {hasAuthError ? (
                  <div className="m-4 bg-slate-950/80 border border-rose-900/40 backdrop-blur-xl rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[360px]">
                    <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                      <AlertCircle className="w-6 h-6 animate-bounce" />
                    </div>
                    <h2 className="text-rose-400 font-bold mb-2 tracking-widest font-mono text-sm">SECURITY_ACCESS_DENIED</h2>
                    <p className="text-slate-400 text-xs font-mono max-w-sm medals leading-relaxed">
                      Cryptographic authentication block triggered. Disable auth middleware constraints on your local FastAPI endpoints to pipe telemetry data cleanly.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={resolvedEngineStatus}
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full flex-grow flex flex-col"
                    >
                      <HITLGate 
                        state={graphState} 
                        onRefine={handleRefineMitigation} 
                        onApprove={handleApproveMitigation} 
                        isLoading={isSystemProcessing} 
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Telemetry Matrix Feed Row */}
            <div className="bg-slate-900/10 border border-slate-800/40 rounded-2xl p-1 shadow-md">
              <div className="flex items-center gap-2 px-4 pt-3 pb-1 border-b border-slate-800/30">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">Live Infrastructure Node Matrix</span>
              </div>
              <TelemetryFeed logs={logs} />
            </div>
          </section>
        </motion.div>
      </div>
    </Layout>
  );
}