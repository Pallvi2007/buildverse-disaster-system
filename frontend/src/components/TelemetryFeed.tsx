import React from 'react';
import { Activity, Clock, Inbox, AlertOctagon, Terminal } from 'lucide-react';

// ... (TelemetryData interface remains the same)

export const TelemetryFeed: React.FC<TelemetryFeedProps> = ({ logs }) => {
  
  const getSeverityStyles = (tier: TelemetryData['severity']) => {
    switch (tier) {
      case 'CRITICAL':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'HIGH':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      case 'MEDIUM':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default:
        return 'bg-slate-800/30 border-border-dim text-slate-500';
    }
  };

  return (
    <div className="bg-bg-surface/50 backdrop-blur-xl border border-border-dim rounded-2xl shadow-card overflow-hidden transition-all duration-300">
      
      {/* 1. STRATEGIC HEADER */}
      <div className="px-6 py-4 border-b border-border-dim flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-accent-blue" />
          <h3 className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.2em]">
            Live Telemetry Matrix
          </h3>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-bg-base border border-border-dim font-mono text-[9px] text-slate-400">
          DATA_PACKETS: {logs.length}
        </div>
      </div>

      {/* 2. DATA VIEWPORT */}
      <div className="overflow-x-auto">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-accent-blue/5 flex items-center justify-center text-accent-blue/30 mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Awaiting uplink synchronization...</p>
          </div>
        ) : (
          <table className="w-full text-left text-[11px]">
            <thead className="bg-bg-base/30 text-slate-500 font-mono uppercase border-b border-border-dim">
              <tr>
                <th className="px-6 py-4 font-bold tracking-widest">Timestamp</th>
                <th className="px-6 py-4 font-bold tracking-widest">Sector</th>
                <th className="px-6 py-4 font-bold tracking-widest">Severity</th>
                <th className="px-6 py-4 font-bold tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dim font-sans">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-accent-blue/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-slate-400 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-200">{log.sector.toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-bold tracking-wider uppercase ${getSeverityStyles(log.severity)}`}>
                      {log.severity === 'CRITICAL' && <AlertOctagon className="w-3 h-3" />}
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono">{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};