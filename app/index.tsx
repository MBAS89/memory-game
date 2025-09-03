import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { usePersistedState } from '../hooks/usePersistedState';
import { formatTime, getTimeUntilReset, isToday } from '../utils/timeUtils';

const HomeScreen = () => {
  const router = useRouter();
  const [highestUnlockedLevel, setHighestUnlockedLevel] = usePersistedState<number>('highestUnlockedLevel', 1);
  const [lastDailyChallengeDate, setLastDailyChallengeDate] = usePersistedState<string | null>('lastDailyChallengeDate', null);

  const [countdown, setCountdown] = useState('');

  // Daily challenge reset & countdown
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
    <View style={styles.container}>
      <Text style={styles.title}>Memory Master</Text>
      <Text style={styles.subtitle}>Test your mind, one level at a time.</Text>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {Array.from({ length: 100 }, (_, i) => i + 1).map((levelNum) => {
          const isUnlocked = levelNum <= highestUnlockedLevel;
          const isCurrent = levelNum === highestUnlockedLevel;
          const isCompleted = levelNum < highestUnlockedLevel;

          return (
            <Link
              key={levelNum}
              href={`/level/${levelNum}` as const}
              asChild
              disabled={!isUnlocked}
              style={[
                styles.levelButton,
                !isUnlocked ? styles.lockedButton : {},
                isCompleted && styles.completedButton,
                isCurrent && styles.currentButton,
              ]}
            >
              <TouchableOpacity
                activeOpacity={isUnlocked ? 0.7 : 1}
                disabled={!isUnlocked}
              >
                <Text style={styles.levelNumber}>
                  {isUnlocked ? `LV:${levelNum}` : '🔒'}
                </Text>
                {!isUnlocked && <Text style={styles.lockLabel}>Locked</Text>}
              </TouchableOpacity>
            </Link>
          );
        })}
      </ScrollView>

      <View style={styles.dailyButtonContainer}>
        <TouchableOpacity
          style={[
            styles.dailyButton,
            lastDailyChallengeDate && isToday(lastDailyChallengeDate) ? styles.disabledButton : {},
          ]}
          onPress={handleDailyChallengePress}
          disabled={lastDailyChallengeDate ? isToday(lastDailyChallengeDate) : false}
        >
          <Text style={styles.dailyButtonText}>
            {lastDailyChallengeDate && isToday(lastDailyChallengeDate)
              ? `Next in: ${countdown}`
              : '🎯 Daily Challenge'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1d2b53',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#5a6a85',
    marginBottom: 24,
    fontWeight: '500',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    paddingBottom: 30,
  },
  levelButton: {
    width: '30%',
    height: 40,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#e0e7ff',
    position: 'relative',
  },
  completedButton: {
    borderColor: '#23ed00ff',
    backgroundColor: '#f8fdff',
  },
  currentButton: {
    borderColor: '#5c9cff',
    shadowColor: '#5c9cff',
    shadowOpacity: 0.25,
    elevation: 8,
    transform: [{ scale: 1.03 }],
  },
  lockedButton: {
    backgroundColor: '#f0f1f3',
    borderColor: '#d1d5db',
    opacity: 0.6,
  },
  levelNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#656d7aff',
    textAlign: 'center',
  },
  lockLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  dailyButtonContainer: {
    margin: 10
  },
  dailyButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#FFB49A',
  },
  dailyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
