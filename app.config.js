// app.config.js
require('dotenv').config(); // Load .env variables

export default {
  name: "Memory Master",
  slug: "memory-master",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "memorygame",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#0A344E",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#0A344E",
      },
    ],
    "expo-font",
    "expo-audio",
    [
      "react-native-google-mobile-ads",
      {
        androidAppId: process.env.ADMOB_APP_ID_ANDROID,
        iosAppId: process.env.ADMOB_APP_ID_IOS,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};