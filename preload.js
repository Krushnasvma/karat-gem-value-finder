const { contextBridge, ipcRenderer } = require('electron');

// Expose secure APIs to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Secure project URL access
  getSecureProjectUrl: () => ipcRenderer.invoke('get-secure-project-url'),
  
  // Data encryption/decryption
  encryptData: (data) => ipcRenderer.invoke('encrypt-data', data),
  decryptData: (encryptedData) => ipcRenderer.invoke('decrypt-data', encryptedData),
  
  // Update notifications
  onUpdateAvailable: (callback) => {
    ipcRenderer.on('update-available', callback);
  },
  onUpdateDownloaded: (callback) => {
    ipcRenderer.on('update-downloaded', callback);
  },
  restartApp: () => ipcRenderer.invoke('restart-app'),
  
  // Platform detection
  platform: process.platform,
  isElectron: true,
  
  // Security utilities
  generateSecureId: () => {
    return require('crypto').randomBytes(16).toString('hex');
  }
});

// Prevent any external script injection
window.addEventListener('DOMContentLoaded', () => {
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
    if (script.src && !script.src.startsWith('http://localhost')) {
      script.remove();
    }
  });
});