# Security & Proxy Configuration

## Overview
This calculator app includes advanced security features to hide your secret project's URLs from console, network inspection, and source code analysis.

## Configuration Setup

### 1. Environment Secrets
The project URLs are stored as encrypted secrets (not in .env files for security):

- `HIDDEN_PROJECT_URL` - Your hidden project's frontend URL
- `HIDDEN_PROJECT_BACKEND_URL` - Your hidden project's backend URL (if applicable)

**You've already configured these secrets through the Lovable secrets manager.**

### 2. How It Works

#### Proxy Server
All requests to your hidden project go through a secure proxy server:

- **Development**: Uses Vite proxy at `/api/secure-proxy`
- **Production**: Uses Supabase Edge Function at `/secure-proxy`
- **Desktop (Electron)**: Uses local proxy server on port 3001
- **Mobile (Capacitor)**: Uses native HTTP interceptor

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

#### Test in Development:
```bash
npm run dev
```
Then try the trigger sequence (0+0=) and verify:
- The hidden project loads
- Console shows no URLs (check for [REDACTED] markers)
- Network tab is filtered

#### Test in Production:
```bash
npm run build
npm run preview
```

### 4. Deployment Checklist

- ✅ Secrets configured in Lovable
- ✅ Proxy endpoint deployed (Supabase Edge Function)
- ✅ Console suppression active
- ✅ Network tab filtering enabled
- ✅ No URLs in client-side code
- ✅ Downloads save to system default folders

### 5. Updating URLs

If you need to change the hidden project URLs:

1. Go to Project Settings → Secrets
2. Update `HIDDEN_PROJECT_URL` or `HIDDEN_PROJECT_BACKEND_URL`
3. The proxy will automatically use the new URLs
4. No code changes needed

### 6. Security Notes

⚠️ **Important**:
- Never log the actual URLs in your code
- Always use the proxy endpoint
- Don't disable console suppression in production
- Keep the Edge Function deployed
- Monitor Edge Function logs for unauthorized access attempts

### 7. Advanced Configuration

#### For Desktop App (Electron):
The proxy runs on `http://localhost:3001` and handles all encryption locally.

#### For Mobile App (Capacitor):
Native HTTP interceptors route requests through the secure channel.

#### For Web:
Vite proxy in dev, Edge Function in production.

### 8. Troubleshooting

**Issue**: Hidden project doesn't load
- Check if secrets are configured correctly
- Verify Edge Function is deployed
- Check browser console for [REDACTED] entries

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
