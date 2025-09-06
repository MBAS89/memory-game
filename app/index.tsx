import StatusBarComponent from '@/components/StatusBar';
import { useProfileContext } from '@/contexts/ProfileContext';
import { useSound } from '@/hooks/useSound';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePersistedState } from '../hooks/usePersistedState';
import { formatTime, getTimeUntilReset, isToday } from '../utils/timeUtils';

const HomeScreen = () => {
  const router = useRouter();
  const { playSound, stopSound } = useSound();
  const [highestUnlockedLevel, setHighestUnlockedLevel] = usePersistedState<number>('highestUnlockedLevel', 1);
  const [lastDailyChallengeDate, setLastDailyChallengeDate] = usePersistedState<string | null>('lastDailyChallengeDate', null);
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState('');

  const { profile } = useProfileContext();

  // Handle daily challenge reset & countdown
  useEffect(() => {
    const checkReset = () => {
      if (lastDailyChallengeDate && !isToday(lastDailyChallengeDate)) {
        setLastDailyChallengeDate(null);
      }
    };
    checkReset();

    const interval = setInterval(() => {
      if (lastDailyChallengeDate && !isToday(lastDailyChallengeDate)) {
        setLastDailyChallengeDate(null);
        clearInterval(interval);
      } else if (lastDailyChallengeDate) {
        const timeLeft = getTimeUntilReset();
        setCountdown(formatTime(timeLeft));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastDailyChallengeDate, setLastDailyChallengeDate]);

  const handleDailyChallengePress = () => {
    if (lastDailyChallengeDate && isToday(lastDailyChallengeDate)) {
      Alert.alert('Daily Challenge', `Try again tomorrow. Resets in ${countdown}`);
    } else {
      router.push('/daily-challenge');
    }
  };

  return (
    <LinearGradient
      colors={['#1d2b53', '#1a1a2e', '#16213e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Title & Subtitle */}
        <Text style={styles.title}>{t('title')}</Text>
        <Text style={styles.subtitle}>{t('subtitle')}</Text>

        <View style={styles.barContainer}>
          {/* Status Bar */}
          <StatusBarComponent />
        </View>


        {/* Level Grid */}
        <ScrollView contentContainerStyle={styles.gridContainer}>
          {Array.from({ length: 100 }, (_, i) => i + 1).map((levelNum) => {
            const isUnlocked = levelNum <= highestUnlockedLevel;
            const isCurrent = levelNum === highestUnlockedLevel;
            const isCompleted = levelNum < highestUnlockedLevel;

            return (
              <TouchableOpacity
                key={levelNum}
                activeOpacity={isUnlocked ? 0.7 : 1}
                disabled={!isUnlocked}
                onPress={() => {
                  if (!isUnlocked) return; // Still respect lock

                  // Check hearts before allowing navigation
                  if (profile.hearts > 0) {
                    // Proceed to level
                    router.push(`/level/${levelNum}`);
                  } else {
                    // Not enough hearts
                    playSound('outOfHearts');
                    Alert.alert(
                      t('outOfHearts'),
                      `${t('usedAllHearts')}\n${t('canBuyOrWait')}\n${t('buyMore')}\n${t('waitUntilTomorrow')}\n${t('masterWasBeginner')}`,
                      [
                        {
                          text: t('backToMenu'),
                          style: 'cancel',
                          onPress: () => {
                            stopSound('outOfHearts');
                            router.replace('/');
                          },
                        },
                        {
                          text: t('goToShop'),
                          style: 'default',
                          onPress: () => {
                            stopSound('outOfHearts');
                            router.replace('/shop');
                          },
                        },
                      ]
                    );
                  }
                }}
                style={[
                  styles.levelButton,
                  !isUnlocked && styles.lockedButton,
                  isCompleted && styles.completedButton,
                  isCurrent && styles.currentButton,
                ]}
              >
                <Text style={styles.levelNumber}>
                  {isUnlocked ? `${t('level')}${levelNum}` : '🔒'}
                </Text>
                {!isUnlocked && <Text style={styles.lockLabel}>{t('locked')}</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Daily Challenge Button */}
        <View style={styles.dailyButtonContainer}>
          <TouchableOpacity
            style={[
              styles.dailyButton,
              lastDailyChallengeDate && isToday(lastDailyChallengeDate)
                ? styles.disabledButton
                : {},
            ]}
            onPress={handleDailyChallengePress}
            disabled={lastDailyChallengeDate ? isToday(lastDailyChallengeDate) : false}
          >
            <Text style={styles.dailyButtonText}>
              {lastDailyChallengeDate && isToday(lastDailyChallengeDate)
                ? `${t('nextIn')} ${countdown}`
                : t('dailyChallenge')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/profile')}>
            <Text style={styles.navText}>{t('profile')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton]} onPress={() => router.push('/shop')}>
            <Text style={styles.navText}>{t('shop')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70, // Extra top padding for title & status
  },
  barContainer: {
    marginLeft: -20
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#ffffff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#e0e7ff',
    marginBottom: 24,
    fontWeight: '500',
    opacity: 0.9,
  },
  gridContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 60,
  },
  levelButton: {
    width: '26%',
    height: 40,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#ffffff10',
    borderWidth: 2,
    borderColor: '#ffffff30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  completedButton: {
    borderColor: '#23ed00',
    backgroundColor: '#23ed0020',
    shadowColor: '#23ed00',
    shadowOpacity: 0.3,
  },
  currentButton: {
    borderColor: '#5c9cff',
    backgroundColor: '#5c9cff20',
    shadowColor: '#5c9cff',
    shadowOpacity: 0.4,
    elevation: 6,
    transform: [{ scale: 1.08 }],
    borderWidth: 3,
  },
  lockedButton: {
    backgroundColor: '#ffffff08',
    borderColor: '#ffffff20',
    opacity: 0.6,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  lockLabel: {
    fontSize: 9,
    color: '#cccccc80',
    marginTop: 1,
  },
  dailyButtonContainer: {
    marginVertical: 10,
  },
  dailyButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#FFB49A',
  },
  dailyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  navButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 14,
    width: '40%',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  navText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  }
});

export default HomeScreen;