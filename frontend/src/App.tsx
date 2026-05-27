import React, { useState } from 'react';
import { Shield, Zap, Terminal, Activity, ChevronRight } from 'lucide-react';

export default function App() {
  const [logs, setLogs] = useState(['[SYSTEM] Neural Core ready.', '[SYSTEM] Waiting for tactical vector input.']);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 p-8 font-sans border-t-4 border-blue-600">
      <header className="flex items-center justify-between pb-8 mb-8 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Shield className="text-blue-500" size={32} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">BuildVerse Engine v2.0</h1>
            <p className="text-xs text-blue-400 uppercase tracking-widest">Enterprise Disaster Mitigation System</p>
          </div>
        </div>
        <div className="flex gap-6 text-xs uppercase font-bold text-slate-500">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Neural Core Active</span>
          <span className="flex items-center gap-2"><Activity size={14}/> Telemetry Stream: 12.4ms</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Command Panel */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#0c0c0c] border border-slate-800 p-6 rounded-lg">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap size={16} className="text-yellow-500" /> Command Deck Input
            </h2>
            <input 
              className="w-full bg-[#161616] border border-slate-700 text-white p-3 rounded focus:border-blue-500 outline-none transition-all"
              placeholder="Target: e.g. New Delhi"
            />
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded text-sm transition-all flex items-center justify-center gap-2">
              <ChevronRight size={18} /> INITIALIZE ORCHESTRATION
            </button>
          </div>
        </section>

        {/* Telemetry/Console */}
        <section className="col-span-12 lg:col-span-8 bg-[#0a0a0a] border border-slate-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Terminal size={16} className="text-green-500" /> System Telemetry Logs
          </h2>
          <div className="bg-black p-4 h-[400px] overflow-y-auto font-mono text-xs text-green-400 rounded border border-slate-900">
            {logs.map((log, i) => <p key={i} className="mb-1 opacity-80">{log}</p>)}
          </div>
        </section>
      </div>
    </div>
  );
}