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
  android: {
    package: "com.memorymaster.app",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#0A344E",
    },
    edgeToEdgeEnabled: true,
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.memorymaster.app",
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  extra: {
    eas: {
      projectId: "67b57e8c-d330-435b-aa67-f86c0c396f3f"
    }
  },
  ios: {
    supportsTablet: true,
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
        image: "./assets/images/adaptive-icon.png",
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
        "androidAppId": "ca-app-pub-3940256099942544~3347511713",
        "iosAppId": "ca-app-pub-3940256099942544~1458002511"
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};