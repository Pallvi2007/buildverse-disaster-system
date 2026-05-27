import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.tsx';
import './index.css';

// 1. Production-Hardened QueryClient Configuration
// We configure global defaults here to ensure consistency across the telemetry and state hooks
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Automatically retry failed network requests twice before showing an error
      refetchOnWindowFocus: false, // Prevents excessive API calls when user switches tabs
      staleTime: 5000, // Keeps telemetry data 'fresh' for 5 seconds
    },
  },
});

// 2. Optimized Root Render
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Devtools are useful for monitoring our websocket/api states during development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);