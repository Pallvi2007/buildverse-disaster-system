import React, { ReactNode, useEffect } from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

// =====================================================================
// TYPING CONTRACT DEFINITIONS
// =====================================================================
interface AdminGuardProps {
  children: ReactNode;
  /** Custom fallback redirect trigger handler (e.g., routing back via react-router or window location) */
  onBypassRedirect?: () => void;
}

/**
 * Enterprise-Grade Mock Auth State Hook 
 * Connects directly to the security definitions established in your dependencies.py layer.
 */
const useAuth = () => {
  // Replace this placeholder mapping with your actual global state mechanism (Redux, Zustand, or React Context)
  const token = localStorage.getItem('token');
  
  // Quick decoder matching the development sandbox vector or live JWT roles
  const isAuthenticated = !!token;
  const isSystemAdmin = token === 'secret-token' || token === 'super-secret-token-123';
  
  return { isAuthenticated, isSystemAdmin };
};


// =====================================================================
// HIGH-FIDELITY ACCESS CONTROL CONTAINER COMPONENT
// =====================================================================
export const AdminGuard: React.FC<AdminGuardProps> = ({ 
  children, 
  onBypassRedirect 
}) => {
  const { isAuthenticated, isSystemAdmin } = useAuth();

  useEffect(() => {
    if (!isSystemAdmin) {
      // Stream security intrusion logging entries to monitoring consoles
      console.warn(
        `[SECURITY-GUARD] Unauthorized operational context navigation attempt intercepted at: ${new Date().toISOString()}`
      );
    }
  }, [isSystemAdmin]);

  // --- ACCESS CONTROL FALLBACK INTERFACE ---
  if (!isAuthenticated || !isSystemAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-950 p-6 text-center antialiased">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-red-950/40 border border-red-500/20 text-red-500 shadow-lg shadow-red-950/20 animate-pulse">
          <ShieldAlert className="h-10 w-10" />
          <div className="absolute -right-1 -top-1 rounded-full bg-red-600 p-1 text-white shadow">
            <Lock className="h-3 w-3" />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
          Access Denied
        </h1>
        
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          This secure administrative module requires active <span className="font-semibold text-red-400">OPERATOR</span> privileges. 
          Your current security clearance has been logged.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              if (onBypassRedirect) {
                onBypassRedirect();
              } else {
                // Default fail-safe redirection home
                window.location.href = '/';
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-200 border border-slate-800 transition-all hover:bg-slate-850 hover:text-white active:scale-98"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- SAFE BOUNDARY PASSENGERS RENDER ---
  return <>{children}</>;
};