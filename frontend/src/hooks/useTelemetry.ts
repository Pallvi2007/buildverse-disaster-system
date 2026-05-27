import { useState, useEffect, useRef } from 'react';
import { TelemetryData } from '../components/dashboard/TelemetryFeed';

// =====================================================================
// STREAM PROTOCOL INITIALIZATION CONFIGURATIONS
// =====================================================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Dynamically resolves appropriate runtime connection addresses.
 * Replaces http/https indicators with modern ws/wss streaming vectors.
 */
const getWebSocketUrl = (): string => {
  const cleanUrl = API_BASE_URL.replace(/^http/, 'ws');
  return `${cleanUrl}/ws/telemetry`;
};

// =====================================================================
// REAL-TIME TELEMETRY RESILIENT STREAM HOOK
// =====================================================================
export const useTelemetry = () => {
  const [logs, setLogs] = useState<TelemetryData[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // Persistent tracking pointers to maintain state across execution re-renders
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);

  useEffect(() => {
    // Standard initialization worker loop
    const connectTelemetryStream = () => {
      // Clean up pre-existing instances before re-allocating a channel link
      if (socketRef.current) {
        socketRef.current.close();
      }

      const targetWsUrl = getWebSocketUrl();
      console.log(`[TELEMETRY-SOCKET] Initializing listener pipeline link to: ${targetWsUrl}`);
      
      const ws = new WebSocket(targetWsUrl);
      socketRef.current = ws;

      // --- ON OPEN ACCELERATION ROUTINE ---
      ws.onopen = () => {
        console.log('[TELEMETRY-SOCKET] Live network handshake verified. Telemetry streaming active.');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0; // Completely reset error retry counters
      };

      // --- ON MESSAGE INGESTION MATRIX ---
      ws.onmessage = (event: MessageEvent) => {
        try {
          const rawPayload = JSON.parse(event.data);
          
          // Enforce strict casting properties matching your Pydantic schemas
          const parsedLog: TelemetryData = {
            timestamp: rawPayload.timestamp || new Date().toISOString(),
            sector: rawPayload.sector || 'UNKNOWN_SECTOR',
            severity: rawPayload.severity || 'LOW',
            status: rawPayload.status || rawPayload.message || 'Processing operational framework nodes.'
          };

          // Add new log packet to top of stack, slicing the array boundary buffer safely at 50 nodes
          setLogs((prev) => [parsedLog, ...prev].slice(0, 50));
        } catch (jsonParseError) {
          console.error('[TELEMETRY-SOCKET] Intercepted corrupted data string frame:', jsonParseError);
        }
      };

      // --- ON CLOSE RESILIENCY FAULT ROUTINE ---
      ws.onclose = (closeEvent) => {
        setIsConnected(false);
        socketRef.current = null;
        
        // Block intentional client teardowns from initiating retry loops
        if (closeEvent.wasClean) {
          console.log('[TELEMETRY-SOCKET] Structural streaming gateway connection closed cleanly.');
          return;
        }

        // Calculate a progressive backoff timer (Cap delay maximum at 16 seconds)
        const backoffDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 16000);
        reconnectAttemptsRef.current += 1;

        console.warn(
          `[TELEMETRY-SOCKET] Connection dropped abnormally. Scheduling retry attempt #${reconnectAttemptsRef.current} in ${backoffDelay}ms`
        );

        reconnectTimeoutRef.current = window.setTimeout(() => {
          connectTelemetryStream();
        }, backoffDelay);
      };

      // --- ERROR PASSENGER HOOK ---
      ws.onerror = (errorEvent) => {
        console.error('[TELEMETRY-SOCKET] Encountered asynchronous infrastructure error:', errorEvent);
        // Let onclose handle scheduling backoff logic safely
        ws.close();
      };
    };

    // Kick off connection on mounting initialization
    connectTelemetryStream();

    // --- CLEANUP TEARDOWN CYCLE ON COMPONENT UNMOUNT ---
    return () => {
      console.log('[TELEMETRY-SOCKET] Terminating listeners. Purging timeout microtasks.');
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close(); // Triggers a clean closing frame status to the server
      }
    };
  }, []);

  return { logs, isConnected };
};