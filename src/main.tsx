import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeSecureProxy } from './services/secureProxy'

// Initialize secure proxy to hide all URLs from console
initializeSecureProxy();

createRoot(document.getElementById("root")!).render(<App />);
