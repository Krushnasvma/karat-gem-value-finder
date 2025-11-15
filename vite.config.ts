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
        target: process.env.VITE_PROXY_TARGET || 'https://de78b469-0d30-4e90-aa36-5840fae24897.lovableproject.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/secure-proxy/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('X-Secure-Client', 'SecureCalculator');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            delete proxyRes.headers['server'];
            delete proxyRes.headers['x-powered-by'];
          });
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
