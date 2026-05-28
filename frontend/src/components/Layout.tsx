import React, { useState, useEffect } from 'react';
import { ShieldAlert, Server, Clock, Activity } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [timestamp, setTimestamp] = useState<string>('00:00:00 UTC');

  useEffect(() => {
    const updateSystemTime = () => {
      const now = new Date();
      setTimestamp(now.toUTCString().split(' ')[4] + ' UTC');
    };
    updateSystemTime();
    const interval = setInterval(updateSystemTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-slate-300 font-sans selection:bg-accent-blue/20">
      
      {/* 1. TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 h-16 w-full border-b border-border-dim bg-bg-surface/80 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-blue/10 border border-accent-blue/20 shadow-glow-blue">
            <ShieldAlert className="text-accent-blue w-5 h-5" />
          </div>
          <h1 className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">
            BuildVerse <span className="text-accent-blue">Ops</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-dim bg-bg-base/50">
            <Server className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[10px] font-mono text-slate-400">NODE_172.21.29.101</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/10 bg-emerald-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold tracking-widest text-emerald-500 uppercase">Secure Link</span>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-10">
        {children}
      </main>
      
      {/* 3. FOOTER */}
      <footer className="w-full border-t border-border-dim bg-bg-surface/30 backdrop-blur-sm px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-slate-500">
          <Activity className="w-3 h-3 text-accent-blue" />
          <span>ENCRYPTED_TELEMETRY_STREAM_V.2.0.0</span>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-mono text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span className="text-slate-400">{timestamp}</span>
          </div>
          <span className="hidden md:block">|</span>
          <span className="uppercase tracking-tighter">Global Incident Response Command</span>
        </div>
      </footer>
    </div>
  );
};