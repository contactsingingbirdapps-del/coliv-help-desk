import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cohub.helpdesk',
  appName: 'CoHub Help Desk',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    path: 'android'
  },
  ios: {
    path: 'ios'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a365d",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    Camera: {
      permissions: ["camera", "photos"]
    }
  }
};

export default config;