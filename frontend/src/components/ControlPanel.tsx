import React, { useState } from 'react';

interface ControlPanelProps {
  onTrigger: (location: string) => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onTrigger, isLoading }) => {
  const [location, setLocation] = useState<string>('');

  // Advanced feature: Direct telemetry presets for swift engine evaluation testing
  const presets = ['New Delhi', 'Mumbai', 'London', 'Tokyo'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onTrigger(location.trim());
    }
  };

  const handlePresetClick = (city: string) => {
    if (isLoading) return;
    setLocation(city);
    onTrigger(city);
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/40 hover:border-white/15 transition-all duration-300">
      <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 mb-4 font-bold border-b border-white/5 pb-2 flex justify-between items-center">
        <span>Command Deck Input</span>
        <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-normal">
          CONSOLED
        </span>
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5 font-semibold">
            Geographic Incident Target
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., Mumbai, New Delhi, London"
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left font-sans"
          />
        </div>

        {/* Dynamic Telemetry Quick-Select Presets */}
        <div className="space-y-1.5">
          <span className="block text-[10px] font-mono text-slate-500 uppercase font-semibold">
            Target Presets Matrix
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((city) => (
              <button
                key={city}
                type="button"
                disabled={isLoading}
                onClick={() => handlePresetClick(city)}
                className={`text-xs font-mono px-2.5 py-1.5 rounded-lg border transition-all duration-150 ${
                  location.toLowerCase() === city.toLowerCase()
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-inner'
                    : 'bg-slate-950/40 text-slate-400 border-white/5 hover:bg-slate-900 hover:text-slate-200 hover:border-white/10'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {city.replace(' ', '_').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !location.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-900/30 text-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 font-mono tracking-wide"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              EXECUTING_PIPELINE...
            </>
          ) : (
            'INITIALIZE_ORCHESTRATION'
          )}
        </button>
      </form>
    </div>
  );
};

export default ControlPanel;