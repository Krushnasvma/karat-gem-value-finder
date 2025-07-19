// Platform detection and utilities
export const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI;
};

export const isCapacitor = () => {
  return typeof window !== 'undefined' && window.Capacitor;
};

export const isMobile = () => {
  return isCapacitor() || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isDesktop = () => {
  return isElectron() || (!isMobile() && typeof window !== 'undefined');
};

export const getPlatform = (): 'electron' | 'capacitor' | 'web' => {
  if (isElectron()) return 'electron';
  if (isCapacitor()) return 'capacitor';
  return 'web';
};

// Secure URL handling based on platform
export const getSecureProjectUrl = async (): Promise<string> => {
  const platform = getPlatform();
  
  switch (platform) {
    case 'electron':
      return window.electronAPI?.getSecureProjectUrl() || '';
    
    case 'capacitor':
      // Use Capacitor's HTTP plugin with proxy
      return 'https://internal-proxy.app/secure-project';
    
    default:
      // Fallback for web (with obfuscation)
      const config = await import('../config/security');
      return config.getSecureConfig().projectUrl || '';
  }
};

// Data encryption utilities
export const encryptSensitiveData = async (data: any): Promise<string> => {
  const platform = getPlatform();
  
  if (platform === 'electron' && window.electronAPI) {
    return window.electronAPI.encryptData(data);
  }
  
  // Fallback encryption for other platforms
  const CryptoJS = await import('crypto-js');
  return CryptoJS.AES.encrypt(JSON.stringify(data), 'fallback-key-2024').toString();
};

export const decryptSensitiveData = async (encryptedData: string): Promise<any> => {
  const platform = getPlatform();
  
  if (platform === 'electron' && window.electronAPI) {
    return window.electronAPI.decryptData(encryptedData);
  }
  
  // Fallback decryption for other platforms
  const CryptoJS = await import('crypto-js');
  const bytes = CryptoJS.AES.decrypt(encryptedData, 'fallback-key-2024');
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Memory security utilities
export const clearSensitiveMemory = () => {
  // Clear any sensitive variables from memory
  if (typeof window !== 'undefined') {
    // Clear browser cache and storage
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Clear session storage
    sessionStorage.clear();
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }
};

// Anti-debugging protection
export const enableAntiDebugging = () => {
  const platform = getPlatform();
  
  if (platform === 'web') {
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Disable common developer shortcuts
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    });
    
    // Detect developer tools
    let devtools = { open: false, orientation: null };
    const threshold = 160;
    
    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          clearSensitiveMemory();
          window.location.reload();
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }
};

declare global {
  interface Window {
    electronAPI?: {
      getSecureProjectUrl: () => Promise<string>;
      encryptData: (data: any) => Promise<string>;
      decryptData: (encryptedData: string) => Promise<any>;
      onUpdateAvailable: (callback: () => void) => void;
      onUpdateDownloaded: (callback: () => void) => void;
      restartApp: () => Promise<void>;
      platform: string;
      isElectron: boolean;
      generateSecureId: () => string;
    };
    Capacitor?: any;
    gc?: () => void;
  }
}