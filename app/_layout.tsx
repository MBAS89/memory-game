import { soundManager } from '@/utils/SoundManager';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Top of file, right after imports
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});

export default function RootLayout() {

  const [soundsLoaded, setSoundsLoaded] = useState(false);

  useEffect(() => {
    const initializeSounds = async () => {
      try {
        await soundManager.initialize();
        setSoundsLoaded(true);
      } catch (error) {
        console.error('Failed to initialize sounds:', error);
        setSoundsLoaded(true); // Continue anyway
      }
    };

    initializeSounds();

    // Cleanup when app closes
    return () => {
      soundManager.cleanup();
    };
  }, []);


  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#667eea' },
        }}
      />
    </>
  );
}