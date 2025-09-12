// hooks/useRewardedAd.ts
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
    AdEventType,
    RewardedAd,
    RewardedAdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';

const rewardedAdUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-your-real-id-here'; // Replace later

export const useRewardedAd = () => {
  const [isReady, setIsReady] = useState(false);
  const adRef = useRef<RewardedAd | null>(null); // Store loaded ad
  const rewardCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAd = () => {
      // Create a new ad instance
      const ad = RewardedAd.createForAdRequest(rewardedAdUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      // Save reference
      adRef.current = ad;

      // Event: Ad loaded
      const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        if (!isMounted) return;
        console.log('✅ Rewarded ad loaded');
        setIsReady(true);
      });

      // Event: User earned reward
      const unsubscribeEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        console.log('🎉 Reward earned!');
        if (rewardCallbackRef.current) rewardCallbackRef.current();
      });

      // Event: Closed → reload
      const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        if (!isMounted) return;
        console.log('CloseOperation: reloading...');
        setIsReady(false);
        setTimeout(loadAd, 1000); // Reload next
      });

      // Event: Error
      const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('🔴 RewardedAd Error:', error);
        if (!isMounted) return;
        setIsReady(false);
      });

      // Start loading
      ad.load();

      // Cleanup
      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeError();
      };
    };

    loadAd();

    return () => {
      isMounted = false;
    };
  }, []);

  const showAd = (onReward: () => void) => {
    if (!isReady) {
      Alert.alert('Ad Not Ready', 'Please wait a moment before trying again.');
      return;
    }

    // Store callback
    rewardCallbackRef.current = onReward;

    try {
      // ✅ Show the SAME instance that was loaded
      if (adRef.current) {
        adRef.current.show();
      } else {
        Alert.alert('Error', 'Ad instance missing.');
      }
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      Alert.alert('Error', 'Could not show ad. Please try again.');
    }
  };

  return { showAd, isReady };
};