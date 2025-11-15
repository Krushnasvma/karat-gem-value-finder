// Secure proxy service that hides all URL access
const PROXY_ENDPOINT = `${window.location.origin}/api/secure-proxy`;

// Override console methods to suppress URL logging
const suppressedMethods = ['log', 'info', 'warn', 'error', 'debug'] as const;
const originalConsole: Record<string, any> = {};

export const initializeSecureProxy = () => {
  // Save original console methods
  suppressedMethods.forEach(method => {
    originalConsole[method] = console[method];
  });

  // Override console methods to filter URL-related logs
  suppressedMethods.forEach(method => {
    console[method] = (...args: any[]) => {
      // Filter out any arguments that might contain URLs or sensitive info
      const filteredArgs = args.map(arg => {
        if (typeof arg === 'string') {
          // Check if string contains URLs or sensitive patterns
          if (
            arg.includes('http://') || 
            arg.includes('https://') ||
            arg.includes('devtunnels') ||
            arg.includes('lovableproject') ||
            arg.includes('proxy')
          ) {
            return '[REDACTED]';
          }
        }
        return arg;
      });
      
      // Only log if not all arguments were redacted
      if (!filteredArgs.every(arg => arg === '[REDACTED]')) {
        originalConsole[method](...filteredArgs);
      }
    };
  });

  // Override fetch to use proxy
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // Check if this is a request to the hidden project
    if (shouldUseProxy(url)) {
      const proxyUrl = `${PROXY_ENDPOINT}${getPathFromUrl(url)}`;
      const proxyInit = {
        ...init,
        headers: {
          ...init?.headers,
          'x-proxy-target': url.includes('backend') ? 'backend' : 'frontend',
        },
      };
      
      return originalFetch(proxyUrl, proxyInit);
    }
    
    return originalFetch(input, init);
  };

  // Prevent network tab inspection
  if (window.performance && window.performance.getEntriesByType) {
    const originalGetEntries = window.performance.getEntriesByType;
    window.performance.getEntriesByType = function(type: string) {
      const entries = originalGetEntries.call(this, type);
      if (type === 'resource') {
        return entries.filter((entry: any) => {
          return !shouldFilterResource(entry.name);
        });
      }
      return entries;
    };
  }
};

const shouldUseProxy = (url: string): boolean => {
  // Proxy all external requests that aren't local assets
  if (url.startsWith('/') || url.startsWith(window.location.origin)) {
    return false;
  }
  // Proxy any absolute HTTP/HTTPS URLs (these would be to hidden project)
  return url.startsWith('http://') || url.startsWith('https://');
};

const shouldFilterResource = (url: string): boolean => {
  return url.includes('devtunnels') || 
         url.includes('proxy') ||
         url.includes('secure-project');
};

const getPathFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname + urlObj.search + urlObj.hash;
  } catch {
    return url;
  }
};

// Restore console (for debugging only, should not be used in production)
export const restoreConsole = () => {
  suppressedMethods.forEach(method => {
    if (originalConsole[method]) {
      console[method] = originalConsole[method];
    }
  });
};
