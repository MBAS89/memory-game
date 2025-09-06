import { soundManager } from '@/utils/SoundManager';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { ProfileProvider } from '../contexts/ProfileContext';
import { useProfile } from '../hooks/useProfile';

import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import '../utils/i18n'; // <-- Import i18n config

// Fix Reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});

export default function RootLayout() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set RTL based on language
    const isRTL = i18n.language === 'ar';
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    // Reload app to apply RTL (Expo-only workaround)
    if (isRTL !== I18nManager.isRTL) {
      // You can use AppState or reload manually
      console.log('🔁 RTL set:', isRTL);
    }
  }, [i18n.language]);

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
    return null;
  }

  return (
    <ProfileProvider>
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
    </ProfileProvider>
  );
}