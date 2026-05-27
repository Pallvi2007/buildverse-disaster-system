import React, { useState, useEffect } from 'react';
import { ShieldAlert, Server, Clock } from 'lucide-react';

// =====================================================================
// TYPING CONTRACT DEFINITIONS
// =====================================================================
interface LayoutProps {
  children: React.ReactNode;
}

// =====================================================================
// MAIN VIEWPORT ARCHITECTURE FRAMEWORK
// =====================================================================
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [timestamp, setTimestamp] = useState<string>('00:00:00 UTC');

  // Real-time synchronization loop matching the universal backend clock timeline
  useEffect(() => {
    const updateSystemTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setTimestamp(`${hours}:${minutes}:${seconds} UTC`);
    };

    updateSystemTime();
    const clockIntervalRef = setInterval(updateSystemTime, 1000);
    
    return () => clearInterval(clockIntervalRef);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-slate-300 font-sans antialiased selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* 1. PERSISTENT GLOBAL TOP HEADROOM SYSTEM NAVIGATION */}
      <nav className="sticky top-0 z-50 h-14 w-full border-b border-slate-800/60 flex items-center justify-between px-4 sm:px-6 bg-slate-950/70 backdrop-blur-md select-none">
        
        {/* Core Operational Logo Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950/60 border border-blue-500/20 shadow-md">
            <ShieldAlert className="text-blue-500 w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-widest text-slate-100 uppercase">
            BuildVerse <span className="text-blue-500 font-medium">Ops</span>
          </span>
        </div>
        
        {/* Node Routing Meta Logs */}
        <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] uppercase font-mono font-bold text-slate-500">
          <div className="hidden md:flex items-center gap-2 border border-slate-800/60 bg-slate-900/40 px-2.5 py-1 rounded-md">
            <Server className="w-3 h-3 text-slate-600" />
            <span className="text-slate-400">Node: 172.21.29.101</span>
          </div>
          <div className="hidden md:block w-px h-3 bg-slate-800" />
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-900/40 bg-emerald-950/20 text-emerald-400">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
            <span>SECURE PROTOCOL ACTIVE</span>
          </div>
        </div>

      </nav>

      {/* 2. FLEX GROW MAIN RESPONSIVE INTERFACE COMPARTMENT */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 mb-8 pb-10 transition-all duration-300">
        {children}
      </main>
      
      {/* 3. FLUSH EMBEDDED SYSTEM METRIC FOOTER BAR */}
      <footer className="mt-auto w-full border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-md px-4 sm:px-6 py-2.5 text-[9px] font-mono text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2 select-none">
        <div className="flex items-center gap-2 tracking-wider">
          <span className="text-blue-500 font-bold">●</span>
          <span>ENCRYPTED TELEMETRY STREAM V.2.0.0</span>
        </div>
        
        <div className="flex items-center gap-4 text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-600" />
            <span className="text-slate-400 font-medium">{timestamp}</span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="tracking-wide hidden sm:inline">GLOBAL INCIDENT RESPONSE COMMAND</span>
        </div>
      </footer>

    </div>
  );
};