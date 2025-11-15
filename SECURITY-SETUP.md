# Security & Proxy Configuration

## Overview
This calculator app includes advanced security features to hide your secret project's URLs from console, network inspection, and source code analysis.

## Configuration Setup

### 1. Environment Variables (Localhost)
Create a `.env.local` file in the project root with your hidden project URLs:

```env
VITE_HIDDEN_PROJECT_URL=https://your-hidden-project-frontend.com
VITE_HIDDEN_PROJECT_BACKEND_URL=https://your-hidden-project-backend.com
```

**Important:** Never commit `.env.local` to version control! Use `.env.local.example` as a template.

### 2. How It Works

#### Localhost Proxy Server
All requests to your hidden project go through Vite's built-in proxy server running on localhost:

- Proxy endpoint: `http://localhost:8080/api/secure-proxy`
- No deployment needed - runs automatically with `npm run dev`
- URLs from `.env.local` are used to route requests
- Completely hidden from browser console and network tab

#### URL Protection
The app implements multiple layers of URL hiding:

1. **Console Suppression**: All console logs are filtered to hide URLs
2. **Network Tab Hiding**: Performance API is overridden to filter network entries
3. **Proxy Routing**: All requests are routed through proxy endpoints
4. **No Direct URLs**: The actual URLs never appear in the client-side code

#### Download File Handling

When users download PDF/XLSX files from your hidden project:

**Desktop (Windows/Mac/Linux)**:
- Files save to: `C:\Users\[Username]\Downloads` (Windows)
- Files save to: `~/Downloads` (Mac/Linux)
- No calculator-specific folder is created
- Files appear with their original names

**Mobile (Android/iOS)**:
- Android: `/storage/emulated/0/Download/`
- iOS: Files app → Downloads folder
- No app branding on downloaded files
- Files are indistinguishable from other downloads

**Web Browser**:
- Uses browser's default download location
- No special folders created
- Downloads appear anonymous

### 3. Testing the Setup

#### Start the Local Proxy:
```bash
npm run dev
```

The Vite dev server starts on `http://localhost:8080` with the proxy automatically enabled.

#### Test the Hidden Project:
1. Open http://localhost:8080
2. Enter trigger sequence: `0+0=`
3. Verify:
   - ✅ Hidden project loads
   - ✅ Console shows `[REDACTED]` instead of URLs
   - ✅ Network tab shows only `/api/secure-proxy/*` requests
   - ✅ No actual URLs visible anywhere

### 4. Localhost Setup Checklist

- ✅ `.env.local` file created with URLs
- ✅ Local Vite proxy running on port 8080
- ✅ Console suppression active
- ✅ Network tab filtering enabled
- ✅ No URLs in client-side code or console
- ✅ Downloads save to system default folders

### 5. Updating URLs

To change the hidden project URLs:

1. Edit `.env.local` file
2. Update `VITE_HIDDEN_PROJECT_URL` or `VITE_HIDDEN_PROJECT_BACKEND_URL`
3. Restart dev server: `npm run dev`
4. Changes take effect immediately

### 6. Security Notes

⚠️ **Important**:
- Never commit `.env.local` to version control
- Never log the actual URLs in your code
- Always use the proxy endpoint `/api/secure-proxy`
- Don't disable console suppression
- Keep `.env.local` secure and private

### 7. How the Proxy Works

1. **Client Request**: App makes request to `/api/secure-proxy/some-path`
2. **Vite Intercepts**: Local Vite server catches the request
3. **URL Routing**: Based on `x-proxy-target` header, routes to frontend or backend URL
4. **Forwarding**: Request is forwarded to actual hidden project URL
5. **Response**: Response comes back through proxy
6. **Client Receives**: Client gets response without seeing actual URL

### 8. Troubleshooting

**Issue**: Hidden project doesn't load
- Check if `.env.local` file exists with correct URLs
- Verify dev server is running: `npm run dev`
- Check browser console for [REDACTED] entries
- Ensure URLs in `.env.local` are accessible

**Issue**: Downloads show calculator name
- This shouldn't happen with current setup
- Downloads use browser/OS default behavior
- File metadata contains no app information

**Issue**: URLs visible in Network tab
- Verify console suppression is initialized in main.tsx
- Check if Performance API override is active
- Update to latest version of secureProxy.ts

### 9. File Structure

```
src/
├── config/
│   └── security.ts           # Proxy endpoint configuration
├── services/
│   └── secureProxy.ts        # Console & network filtering
└── main.tsx                  # Initializes secure proxy

supabase/functions/
└── secure-proxy/
    └── index.ts              # Production proxy server

electron.config.js            # Desktop proxy configuration
capacitor.config.ts           # Mobile configuration
vite.config.ts               # Dev proxy configuration
```

## Support

If you need help with the security setup, refer to:
- README-DEPLOYMENT.md for platform-specific deployment
- This file for security configuration
- Lovable documentation for secrets management
