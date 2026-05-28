import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Radio, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  LockOpen,
  Terminal
} from 'lucide-react';

// ... (Interface kept the same for compatibility)

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onTrigger, 
  onApproveMitigation,
  isLoading, 
  engineStatus = 'IDLE' 
}) => {
  const [location, setLocation] = useState<string>('');
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

  return (
    <div className="bg-bg-surface/50 backdrop-blur-xl border border-border-dim rounded-2xl shadow-card overflow-hidden transition-all duration-300">
      
      {/* 1. TACTICAL HEADER MATRIX */}
      <div className="bg-white/[0.02] px-6 py-4 border-b border-border-dim flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-accent-blue" />
          <h2 className="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase">
            Operations Console
          </h2>
        </div>
        
        {/* Status Badge with Subtle Glow */}
        <div className={`flex items-center gap-2 text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${
          engineStatus === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
          engineStatus === 'AWAITING_APPROVAL' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
          'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        }`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
          {engineStatus}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* Location Input */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Target Coordinate</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-600 group-focus-within:text-accent-blue transition-colors" />
            <input
              className="w-full bg-bg-base border border-border-dim text-white pl-12 pr-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue outline-none transition-all"
              placeholder="Enter sector ID or city..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading || engineStatus === 'AWAITING_APPROVAL'}
            />
          </div>
        </div>

        {/* Tactical Presets */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Pre-Defined Sectors</label>
          <div className="grid grid-cols-2 gap-3">
            {presets.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handlePresetSelect(city)}
                className={`px-4 py-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  location === city 
                    ? 'bg-accent-blue/10 border-accent-blue text-accent-blue shadow-glow-blue' 
                    : 'bg-bg-base border-border-dim text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || !location.trim()}
          className="w-full bg-accent-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-[0.1em] flex items-center justify-center gap-2 shadow-glow-blue transition-all active:scale-[0.98]"
        >
          {isLoading ? <Activity className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {isLoading ? 'INITIATING...' : 'EXECUTE RESPONSE PROTOCOL'}
        </button>
      </form>
    </div>
  );
};