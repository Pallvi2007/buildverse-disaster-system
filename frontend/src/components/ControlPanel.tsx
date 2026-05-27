import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Radio, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  LockOpen
} from 'lucide-react';

// =====================================================================
// INTERFACE TYPING CONTRACTS
// =====================================================================
interface ControlPanelProps {
  /** Dispatches primary location ingestion workflows to the FastAPI orchestration gateway */
  onTrigger: (location: string) => Promise<void> | void;
  /** Dispatches authorization triggers to release the LangGraph Human-In-The-Loop hold gate */
  onApproveMitigation: () => Promise<void> | void;
  /** Master tracking state indicating network communication tasks are active */
  isLoading: boolean;
  /** Current state placement of the backend graph engine */
  engineStatus?: 'IDLE' | 'ACTIVE' | 'AWAITING_APPROVAL' | 'CRITICAL';
}

// =====================================================================
// COMPONENT IMPLEMENTATION
// =====================================================================
export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onTrigger, 
  onApproveMitigation,
  isLoading, 
  engineStatus = 'IDLE' 
}) => {
  const [location, setLocation] = useState<string>('');
  
  // Tactical coordinate targets mapped directly to our USGS backend matrix presets
  const presets = ['Mumbai', 'Tokyo', 'San Francisco', 'New Delhi'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || isLoading || engineStatus === 'AWAITING_APPROVAL') return;
    onTrigger(location.trim());
  };

  const handlePresetSelect = (selectedCity: string) => {
    if (isLoading || engineStatus === 'AWAITING_APPROVAL') return;
    setLocation(selectedCity);
    onTrigger(selectedCity);
  };

  // Dynamic style compiler mapping backend engines states to appropriate visual cues
  const getStatusBadgeStyles = () => {
    switch (engineStatus) {
      case 'ACTIVE':
        return 'bg-blue-950 text-blue-400 border-blue-800/60';
      case 'AWAITING_APPROVAL':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/60 animate-pulse';
      case 'CRITICAL':
        return 'bg-red-950 text-red-400 border-red-900/60';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans transition-all duration-300 hover:border-slate-750">
      
      {/* 1. TACTICAL HEADER MATRIX */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className={`w-5 h-5 ${engineStatus === 'CRITICAL' ? 'text-red-500 animate-bounce' : 'text-blue-500'}`} />
          <h2 className="text-xs font-bold text-slate-200 tracking-widest uppercase">
            Emergency Response Command
          </h2>
        </div>
        
        <div className={`flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded border shadow-inner ${getStatusBadgeStyles()}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            engineStatus === 'ACTIVE' ? 'bg-blue-400 animate-ping' : 
            engineStatus === 'AWAITING_APPROVAL' ? 'bg-amber-500' : 
            engineStatus === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'
          }`} />
          {engineStatus.replace('_', ' ')}
        </div>
      </div>

      {/* 2. COMMAND INTERFACE FORM */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Target Geographic Location Entry */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
            Target Geographic Coordinate
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 transition-colors" />
            <input
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 pl-11 pr-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-900/50 focus:border-blue-600 outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Input target city or sector..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading || engineStatus === 'AWAITING_APPROVAL'}
            />
          </div>
        </div>

        {/* Pre-Defined Tactical Preset Sectors */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
            Pre-Defined Sectors
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {presets.map((city) => {
              const isSelected = location === city;
              return (
                <button
                  key={city}
                  type="button"
                  disabled={isLoading || engineStatus === 'AWAITING_APPROVAL'}
                  onClick={() => handlePresetSelect(city)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 border rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-200 active:scale-98 disabled:opacity-40 disabled:hover:bg-slate-800 disabled:cursor-not-allowed ${
                    isSelected 
                      ? 'bg-blue-950 border-blue-600 text-blue-300 shadow-md' 
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Radio className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} />
                  {city.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. CONTEXTUAL ACTION CONTROLS TRIGGER */}
        <div className="pt-2 border-t border-slate-800/60 space-y-3">
          
          {/* CRITICAL GOVERNANCE HOLD: INTERRUPT BEFORE STEP VIEW */}
          {engineStatus === 'AWAITING_APPROVAL' && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3 animate-fade-in">
              <div className="flex gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    Human-In-The-Loop Hold Active
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    Telemetry analysis complete. The core engine is safely holding state inside the checkpoint ledger. Verify values below before clearance execution.
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                disabled={isLoading}
                onClick={onApproveMitigation}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-lg tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/20 active:scale-98"
              >
                {isLoading ? <Activity className="animate-spin w-4 h-4" /> : <LockOpen className="w-4 h-4" />}
                {isLoading ? 'AUTHORIZING DEPLOYMENT...' : 'AUTHORIZE SYSTEM DEPLOYMENT'}
              </button>
            </div>
          )}

          {/* STANDARD RUNTIME BUTTON */}
          {engineStatus !== 'AWAITING_APPROVAL' && (
            <button
              type="submit"
              disabled={isLoading || !location.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-950/10 active:scale-98"
            >
              {isLoading ? <Activity className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {isLoading ? 'ORCHESTRATING WORKFLOW...' : 'EXECUTE RESPONSE PROTOCOL'}
            </button>
          )}
        </div>

      </form>
    </div>
  );
};