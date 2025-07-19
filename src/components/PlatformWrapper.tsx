import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getPlatform, enableAntiDebugging, clearSensitiveMemory } from '@/utils/platformUtils';

interface PlatformWrapperProps {
  children: React.ReactNode;
}

export const PlatformWrapper: React.FC<PlatformWrapperProps> = ({ children }) => {
  const [platform, setPlatform] = useState<string>('web');
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializePlatform = async () => {
      const currentPlatform = getPlatform();
      setPlatform(currentPlatform);

      // Enable security measures
      enableAntiDebugging();

      // Platform-specific initialization
      if (currentPlatform === 'electron') {
        // Electron-specific setup
        if (window.electronAPI) {
          // Listen for updates
          window.electronAPI.onUpdateAvailable(() => {
            toast({
              title: "Update Available",
              description: "A new version of the calculator is being downloaded.",
            });
          });

          window.electronAPI.onUpdateDownloaded(() => {
            toast({
              title: "Update Ready",
              description: "Restart the app to apply the update.",
              action: (
                <button 
                  onClick={() => window.electronAPI?.restartApp()}
                  className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm"
                >
                  Restart
                </button>
              ),
            });
          });
        }
      } else if (currentPlatform === 'capacitor') {
        // Capacitor-specific setup
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.isNativePlatform()) {
          // Initialize native plugins
          try {
            const { StatusBar } = await import('@capacitor/status-bar');
            const { SplashScreen } = await import('@capacitor/splash-screen');
            
            await StatusBar.setStyle({ style: 'DARK' as any });
            await StatusBar.setBackgroundColor({ color: '#d4af37' });
            await SplashScreen.hide();
          } catch (e) {
            console.log('Native plugins not available in development');
          }
        }
      }

      setIsReady(true);
    };

    initializePlatform();

    // Cleanup on unmount
    return () => {
      clearSensitiveMemory();
    };
  }, [toast]);

  useEffect(() => {
    // Handle visibility change for security
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearSensitiveMemory();
      }
    };

    // Handle before unload for security
    const handleBeforeUnload = () => {
      clearSensitiveMemory();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gold via-gold-light to-gold-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Initializing Calculator Pro...</p>
          <p className="text-white/80 text-sm mt-2">Platform: {platform}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="platform-wrapper" data-platform={platform}>
      {children}
    </div>
  );
};