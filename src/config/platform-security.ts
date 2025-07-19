// Advanced security configuration for cross-platform deployment
import { getPlatform } from '../utils/platformUtils';

interface SecurityConfig {
  enableAntiDebugging: boolean;
  enableMemoryEncryption: boolean;
  enableCertificatePinning: boolean;
  enableRequestSigning: boolean;
  proxyConfiguration: {
    enabled: boolean;
    endpoint: string;
    encryptionKey: string;
  };
}

// Platform-specific security configurations
const PLATFORM_SECURITY_CONFIGS: Record<string, SecurityConfig> = {
  electron: {
    enableAntiDebugging: true,
    enableMemoryEncryption: true,
    enableCertificatePinning: true,
    enableRequestSigning: true,
    proxyConfiguration: {
      enabled: true,
      endpoint: 'http://localhost:3001/secure-project',
      encryptionKey: 'electron-secure-key-2024'
    }
  },
  capacitor: {
    enableAntiDebugging: true,
    enableMemoryEncryption: true,
    enableCertificatePinning: true,
    enableRequestSigning: true,
    proxyConfiguration: {
      enabled: true,
      endpoint: 'https://internal-proxy.app/secure-project',
      encryptionKey: 'capacitor-secure-key-2024'
    }
  },
  web: {
    enableAntiDebugging: true,
    enableMemoryEncryption: false,
    enableCertificatePinning: false,
    enableRequestSigning: false,
    proxyConfiguration: {
      enabled: false,
      endpoint: '',
      encryptionKey: 'web-fallback-key-2024'
    }
  }
};

export const getSecurityConfig = (): SecurityConfig => {
  const platform = getPlatform();
  return PLATFORM_SECURITY_CONFIGS[platform] || PLATFORM_SECURITY_CONFIGS.web;
};

// Runtime URL obfuscation
export const obfuscateURL = (url: string): string => {
  const config = getSecurityConfig();
  
  if (!config.proxyConfiguration.enabled) {
    return url;
  }
  
  // Replace the actual URL with proxy endpoint
  return config.proxyConfiguration.endpoint;
};

// Memory encryption utilities
export const encryptMemoryData = async (data: any): Promise<string> => {
  const config = getSecurityConfig();
  
  if (!config.enableMemoryEncryption) {
    return JSON.stringify(data);
  }
  
  // Dynamic import to avoid loading crypto unnecessarily
  const CryptoJS = await import('crypto-js');
  return CryptoJS.AES.encrypt(
    JSON.stringify(data), 
    config.proxyConfiguration.encryptionKey
  ).toString();
};

export const decryptMemoryData = async (encryptedData: string): Promise<any> => {
  const config = getSecurityConfig();
  
  if (!config.enableMemoryEncryption) {
    return JSON.parse(encryptedData);
  }
  
  const CryptoJS = await import('crypto-js');
  const bytes = CryptoJS.AES.decrypt(encryptedData, config.proxyConfiguration.encryptionKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Request signing for enhanced security
export const signRequest = async (requestData: any): Promise<string> => {
  const config = getSecurityConfig();
  
  if (!config.enableRequestSigning) {
    return '';
  }
  
  const CryptoJS = await import('crypto-js');
  const dataString = JSON.stringify(requestData) + Date.now();
  return CryptoJS.HmacSHA256(dataString, config.proxyConfiguration.encryptionKey).toString();
};

// Certificate pinning validation
export const validateCertificate = async (url: string): Promise<boolean> => {
  const config = getSecurityConfig();
  
  if (!config.enableCertificatePinning) {
    return true; // Skip validation for platforms that don't support it
  }
  
  // Implementation would depend on platform-specific APIs
  // For now, return true to allow connections
  return true;
};

// Anti-debugging detection
export const detectDebugging = (): boolean => {
  const config = getSecurityConfig();
  
  if (!config.enableAntiDebugging) {
    return false;
  }
  
  // Various debugging detection techniques
  const debuggingDetected = 
    // DevTools detection
    (window.outerHeight - window.innerHeight > 160) ||
    (window.outerWidth - window.innerWidth > 160) ||
    // Console detection
    (typeof console !== 'undefined' && console.clear && console.clear.toString().length < 30) ||
    // Timing attack detection
    (() => {
      const start = performance.now();
      debugger; // This line will pause if debugger is open
      const end = performance.now();
      return (end - start) > 100; // If debugger was hit, there will be a delay
    })();
  
  return debuggingDetected;
};

// Periodic security checks
export const startSecurityMonitoring = () => {
  const config = getSecurityConfig();
  
  if (!config.enableAntiDebugging) {
    return;
  }
  
  const securityCheck = () => {
    if (detectDebugging()) {
      // Clear sensitive data and redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };
  
  // Check every 5 seconds
  setInterval(securityCheck, 5000);
  
  // Also check on focus/blur events
  window.addEventListener('focus', securityCheck);
  window.addEventListener('blur', securityCheck);
};