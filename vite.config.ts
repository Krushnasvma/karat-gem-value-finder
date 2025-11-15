import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/secure-proxy': {
        target: '', // Will be set dynamically based on request
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/secure-proxy/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Determine target based on x-proxy-target header
            const isBackend = req.headers['x-proxy-target'] === 'backend';
            const targetUrl = isBackend 
              ? process.env.VITE_HIDDEN_PROJECT_BACKEND_URL 
              : process.env.VITE_HIDDEN_PROJECT_URL;
            
            if (targetUrl) {
              const target = new URL(targetUrl);
              proxyReq.setHeader('host', target.host);
              // Update the path to target URL
              options.target = targetUrl;
            }
            
            proxyReq.setHeader('X-Secure-Client', 'SecureCalculator');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Remove server identification headers
            delete proxyRes.headers['server'];
            delete proxyRes.headers['x-powered-by'];
          });
        },
        router: (req: any) => {
          // Dynamic routing based on header
          const isBackend = req.headers['x-proxy-target'] === 'backend';
          return isBackend 
            ? process.env.VITE_HIDDEN_PROJECT_BACKEND_URL 
            : process.env.VITE_HIDDEN_PROJECT_URL;
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
