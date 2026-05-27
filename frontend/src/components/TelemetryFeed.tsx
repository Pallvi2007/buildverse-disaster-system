import React from 'react';
import { Activity, Clock, Inbox, AlertOctagon } from 'lucide-react';

// =====================================================================
// TYPING CONTRACT DEFINITIONS
// =====================================================================
export interface TelemetryData {
  timestamp: string;
  sector: string;
  /** Explicitly supports all structural values mapped inside backend/app/schemas.py */
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
}

interface TelemetryFeedProps {
  /** Sequential logging history payload received from streaming WebSocket channels */
  logs: TelemetryData[];
}

// =====================================================================
// PRODUCTION COMPONENT IMPLEMENTATION
// =====================================================================
export const TelemetryFeed: React.FC<TelemetryFeedProps> = ({ logs }) => {
  
  // Custom compiler to map incoming telemetry tiers to precise Tailwind color states
  const getSeverityStyles = (tier: TelemetryData['severity']) => {
    switch (tier) {
      case 'CRITICAL':
        return 'bg-red-950/80 text-red-400 border-red-800/60 font-black animate-pulse';
      case 'HIGH':
        return 'bg-orange-950/60 text-orange-400 border-orange-900/40';
      case 'MEDIUM':
        return 'bg-blue-950/60 text-blue-400 border-blue-900/40';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-slate-750">
      
      {/* 1. COMPONENT STRATEGIC HEAD PANEL */}
      <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-sans">
            Live System Telemetry Feed
          </h3>
        </div>
        <span className="font-mono text-[10px] text-slate-500 bg-slate-950 border border-slate-850 px-2 py-0.5 rounded-md">
          RECORDS: {logs.length}
        </span>
      </div>

      {/* 2. OVERFLOW PROTECTED DATA VIEWPORT CONTAINER */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
        
        {/* FALLBACK VIEW IF NO LOGS ARE ACTIVE IN CACHE */}
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-600 mb-3">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-mono text-slate-500">
              No live telemetry frames ingested. Listening for events...
            </p>
          </div>
        ) : (
          
          /* ACTIVE LOG MATRIX RENDER GRAPH */
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900/40 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-850">
              <tr>
                <th className="px-5 py-3 font-semibold tracking-wider">Timestamp</th>
                <th className="px-5 py-3 font-semibold tracking-wider">Sector Vector</th>
                <th className="px-5 py-3 font-semibold tracking-wider">Threat Severity</th>
                <th className="px-5 py-3 font-semibold tracking-wider">Operational Status Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-400 font-sans">
              {logs.map((log, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-slate-900/30 transition-colors group duration-150"
                >
                  {/* Timestamp Cellular Layout Block */}
                  <td className="px-5 py-3 white-space-nowrap font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                      <span className="text-slate-400">{log.timestamp}</span>
                    </div>
                  </td>
                  
                  {/* Sector Metric Block */}
                  <td className="px-5 py-3 font-mono text-slate-200 font-medium tracking-wide">
                    {log.sector.toUpperCase()}
                  </td>
                  
                  {/* Categorized Threat Status Indicator */}
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[10px] font-mono font-bold tracking-wide ${getSeverityStyles(log.severity)}`}>
                      {log.severity === 'CRITICAL' && <AlertOctagon className="w-3 h-3" />}
                      {log.severity}
                    </span>
                  </td>
                  
                  {/* Raw Status Data Payload String */}
                  <td className="px-5 py-3 max-w-xs truncate text-slate-400 font-mono text-[11px] group-hover:text-slate-300 transition-colors">
                    {log.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};