import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // Ensure the .tsx extension is explicit if needed
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

