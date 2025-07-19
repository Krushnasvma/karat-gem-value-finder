import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.de78b4690d304e90aa365840fae24897',
  appName: 'karat-gem-value-finder',
  webDir: 'dist',
  server: {
    url: 'https://de78b469-0d30-4e90-aa36-5840fae24897.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#d4af37',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#d4af37'
    }
  }
};

export default config;