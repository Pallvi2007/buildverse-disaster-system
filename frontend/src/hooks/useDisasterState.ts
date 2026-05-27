import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PipelineState } from '../App';

// =====================================================================
// API INTEGRATION CONFIGURATIONS
// =====================================================================
// Pulls target gateways safely from your Vite context profile, falling back to local sandbox ports
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const SYSTEM_SECRET_TOKEN = import.meta.env.VITE_SECRET_KEY || 'super-secret-token-123';

/**
 * Standardized Request Headers Builder
 * Injects security vectors to pass your backend dependencies.py authentication layer
 */
const getRequestHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SYSTEM_SECRET_TOKEN}`,
});

// =====================================================================
// CORE AGENTIC STATE ENGINE HOOKS
// =====================================================================

/**
 * Custom hook tracking the active LangGraph execution frame state.
 * Leverages structured TanStack Query cache synchronization loops.
 */
export const useDisasterState = (threadId: string) => {
  return useQuery<PipelineState, Error>({
    queryKey: ['disasterState', threadId],
    queryFn: async () => {
      // Direct connection to your persistent state checkpointer layer via thread routing keys
      const response = await fetch(`${API_BASE_URL}/api/v1/disaster/state/${threadId}`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Engine Network Disruption: Received status code ${response.status}`);
      }
      
      return response.json();
    },
    // Keep active synchronized polling only if a live thread identifier is passed
    enabled: !!threadId,
    // Safely refresh every 3 seconds to pull background node updates
    refetchInterval: (query) => {
      const stateData = query.state.data;
      // Intelligently slow down or halt background polling if the engine hits human review hold
      if (stateData && stateData.disaster_prediction?.includes('AWAITING_APPROVAL')) {
        return 5000; 
      }
      return 3000;
    },
  });
};

// =====================================================================
// STATE ENGINE MUTATION ROUTERS (DISPATCHERS)
// =====================================================================

/**
 * Custom mutation hook to ignite primary location tracking workflows
 */
export const useTriggerIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ threadId, location }: { threadId: string; location: string }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/disaster/trigger`, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({ thread_id: threadId, location }),
      });

      if (!response.ok) throw new Error('Failed to dispatch primary incident vector.');
      return response.json();
    },
    onSuccess: (_, variables) => {
      // Instantly invalidate and sync state query trees once a transaction registers successfully
      queryClient.invalidateQueries({ queryKey: ['disasterState', variables.threadId] });
    },
  });
};

/**
 * Custom mutation hook to clear the Human-In-The-Loop gate check
 */
export const useApproveMitigation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ threadId, feedback }: { threadId: string; feedback?: string }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/disaster/approve`, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({ thread_id: threadId, feedback }),
      });

      if (!response.ok) throw new Error('Authorization clearance rejected by state manager.');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['disasterState', variables.threadId] });
    },
  });
};