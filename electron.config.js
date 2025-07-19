const { app, BrowserWindow, ipcMain, protocol, session } = require('electron');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const crypto = require('crypto-js');

// Security configuration
const ENCRYPTION_KEY = 'secure-key-2024-calculator-pro';
let proxyServer;
let mainWindow;

// Native proxy server for URL hiding
function createSecureProxyServer() {
  const proxyApp = express();
  const port = 3001;

  // Encrypted URL mapping
  const encryptedMapping = {
    '/secure-project': crypto.AES.encrypt('https://svvhqp0l-5173.inc1.devtunnels.ms/login', ENCRYPTION_KEY).toString(),
    '/secure-auth': crypto.AES.encrypt('https://svvhqp0l-5173.inc1.devtunnels.ms', ENCRYPTION_KEY).toString()
  };

  // Proxy middleware with URL masking
  proxyApp.use('/secure-project', createProxyMiddleware({
    target: crypto.AES.decrypt(encryptedMapping['/secure-project'], ENCRYPTION_KEY).toString(crypto.enc.Utf8),
    changeOrigin: true,
    pathRewrite: {
      '^/secure-project': ''
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add security headers
      proxyReq.setHeader('X-Secure-Client', 'CalculatorPro');
      proxyReq.setHeader('X-Request-ID', crypto.lib.WordArray.random(16).toString());
    },
    onProxyRes: (proxyRes, req, res) => {
      // Remove revealing headers
      delete proxyRes.headers['server'];
      delete proxyRes.headers['x-powered-by'];
      proxyRes.headers['X-Content-Type-Options'] = 'nosniff';
      proxyRes.headers['X-Frame-Options'] = 'SAMEORIGIN';
    }
  }));

  proxyServer = proxyApp.listen(port, 'localhost', () => {
    console.log(`Secure proxy server running on port ${port}`);
  });

  return `http://localhost:${port}`;
}

// Enhanced security measures
function enableAdvancedSecurity() {
  // Disable developer tools in production
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    app.on('web-contents-created', (event, contents) => {
      contents.on('devtools-opened', () => {
        contents.closeDevTools();
      });
    });
  }

  // Secure protocol registration
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'calculator-secure',
      privileges: {
        secure: true,
        standard: true,
        supportFetchAPI: true
      }
    }
  ]);

  // Content Security Policy
  session.defaultSession.webSecurity = true;
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = ['notifications', 'media'];
    callback(allowedPermissions.includes(permission));
  });
}

// Main window creation
function createMainWindow() {
  const proxyUrl = createSecureProxyServer();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    titleBarStyle: 'default',
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false
  });

  // Load the React app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Security event handlers
  mainWindow.webContents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    // Only allow navigation to secure proxy URLs
    if (navigationUrl.startsWith(proxyUrl)) {
      event.newGuest = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          webSecurity: true
        }
      });
    }
  });

  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    // Prevent navigation to external URLs
    if (!navigationUrl.startsWith('http://localhost') && !navigationUrl.startsWith(proxyUrl)) {
      event.preventDefault();
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // IPC handlers for secure communication
  ipcMain.handle('get-secure-project-url', () => {
    return `${proxyUrl}/secure-project`;
  });

  ipcMain.handle('encrypt-data', (event, data) => {
    return crypto.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  });

  ipcMain.handle('decrypt-data', (event, encryptedData) => {
    const bytes = crypto.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(crypto.enc.Utf8));
  });
}

// App lifecycle
app.whenReady().then(() => {
  enableAdvancedSecurity();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (proxyServer) {
    proxyServer.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (proxyServer) {
    proxyServer.close();
  }
});

// Auto-updater configuration
if (process.env.NODE_ENV === 'production') {
  const { autoUpdater } = require('electron-updater');
  
  autoUpdater.checkForUpdatesAndNotify();
  
  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-available');
  });
  
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded');
  });
  
  ipcMain.handle('restart-app', () => {
    autoUpdater.quitAndInstall();
  });
}