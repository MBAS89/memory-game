import { soundManager } from '@/utils/SoundManager';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { useProfile } from '../hooks/useProfile';

// Fix Reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});

export default function RootLayout() {
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const { profile, loading, claimDailyHeart } = useProfile();

  // Load sounds
  useEffect(() => {
    const initializeSounds = async () => {
      try {
        await soundManager.initialize();
      } catch (error) {
        console.error('Failed to initialize sounds:', error);
      } finally {
        setSoundsLoaded(true);
      }
    };
    initializeSounds();

    return () => {
      soundManager.cleanup();
    };
  }, []);

  // Claim daily heart on app open (if not already claimed)
  useEffect(() => {
    if (!loading && profile.username) {
      claimDailyHeart();
    }
  }, [loading, profile.username]);

  // Don't render anything until profile is loaded
  if (loading || !soundsLoaded) {
    return null; // You can add a splash screen here later
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        {profile.username ? (
          <>
            <Stack.Screen name="index" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="shop" />
            <Stack.Screen name="daily-challenge" />
          </>
        ) : (
          <Stack.Screen name="onboarding" />
        )}
      </Stack>
    </>
  );
}