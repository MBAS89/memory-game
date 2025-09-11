import { soundManager } from '@/utils/SoundManager';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { ProfileProvider } from '../contexts/ProfileContext';
import { useProfile } from '../hooks/useProfile';

import { useTranslation } from 'react-i18next';
import { ActivityIndicator, I18nManager, View } from 'react-native';
import '../utils/i18n';

// Fix Reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});

export default function RootLayout() {
  const { i18n } = useTranslation();
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const { profile, loading, claimDailyHeart } = useProfile();
  const hasClaimedRef = useRef(false);

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

  useEffect(() => {
    if (!loading && profile.username && !hasClaimedRef.current) {
      hasClaimedRef.current = true;
      claimDailyHeart();
    }
  }, [loading, profile.username]);

  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }, [i18n.language]);

  // Show loading screen while profile and sounds are loading
  if (loading || !soundsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1d2b53' }}>
        <ActivityIndicator size="large" color="#5c9cff" />
      </View>
    );
  }

  return (
    <ProfileProvider>
      <>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          {profile.username ? (
            <>
              <Stack.Screen name="index" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="shop" />
              <Stack.Screen name="daily-challenge" />
              <Stack.Screen name="level/[number]" />
            </>
          ) : (
            <Stack.Screen name="onboarding" />
          )}
        </Stack>
      </>
    </ProfileProvider>
  );
}