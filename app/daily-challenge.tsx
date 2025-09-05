import BackButton from '@/components/BackButton';
import StatusBarComponent from '@/components/StatusBar';
import { useProfileContext } from '@/contexts/ProfileContext';
import { useSound } from '@/hooks/useSound';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Countdown from '../components/Countdown';
import GridContainer from '../components/GridContainer';
import SymbolButton from '../components/SymbolButton';
import { usePersistedState } from '../hooks/usePersistedState';
import { generateSequence } from '../utils/generateSequence';
import { shuffleArray } from '../utils/shuffleArray';
import { getTodayString, isToday } from '../utils/timeUtils';

const DailyChallengeScreen = () => {
    const { playSound } = useSound();
    const { profile, updateProfile } = useProfileContext();
    const router = useRouter();

    const [lastDailyChallengeDate, setLastDailyChallengeDate, loadingPersist] =
        usePersistedState<string | null>('lastDailyChallengeDate', null);

    const [phase, setPhase] = useState<'countdown' | 'show' | 'input'>('countdown');

    // Fixed difficulty ~level 20
    const sequence = useMemo(() => generateSequence(20), []);
    const shuffledSymbols = useMemo(() => shuffleArray(sequence), [sequence]);

    const [userSequence, setUserSequence] = useState<string[]>([]);

    const displayTime = 1600;

    // Prevent replay if already completed today
    useEffect(() => {
        if (!loadingPersist && lastDailyChallengeDate && isToday(lastDailyChallengeDate)) {
            Alert.alert(
                '🌟 Already Completed',
                'You crushed today’s challenge! Come back tomorrow for a new one.',
                [{ text: 'Back', onPress: () => router.back() }]
            );
        }
    }, [lastDailyChallengeDate, loadingPersist, router]);

    const handleStart = useCallback(() => {
        setPhase('show');
        const id = setTimeout(() => setPhase('input'), displayTime);
        return () => clearTimeout(id);
    }, [displayTime]);

    const handleSymbolPress = useCallback(
        (symbol: string) => {
            if (userSequence.length < sequence.length) {
                playSound('tap');
                setUserSequence((s) => (s.includes(symbol) ? s : [...s, symbol]));
            }
        },
        [playSound, sequence.length, userSequence.length]
    );

    const handleReset = useCallback(() => setUserSequence([]), []);

    const handleSubmit = useCallback(async () => {
        if (userSequence.length !== sequence.length) return;

        const correct = userSequence.every((s, i) => s === sequence[i]);
        if (correct) {
            await setLastDailyChallengeDate(getTodayString());
            updateProfile({
                xp: profile.xp + 100,
                coins: profile.coins + 50,
                totalLevelsCompleted: profile.totalLevelsCompleted + 1,
            });
            playSound('success');
            Alert.alert(
                '🎉 Challenge Complete!',
                'You earned 100 XP and 50 coins! See you tomorrow for a new challenge.',
                [{ text: 'Back to Menu', onPress: () => router.push('/') }]
            );
        } else {
            playSound('failure');
            Alert.alert(
                '❌ Try Again',
                'Incorrect sequence. Want to give it another shot?',
                [
                    { text: 'Give Up', style: 'cancel', onPress: () => router.push('/') },
                    { text: 'Retry', style: 'default', onPress: handleReset },
                ]
            );
        }
    }, [handleReset, playSound, router, sequence, setLastDailyChallengeDate, userSequence]);

    if (loadingPersist) {
        return (
            <LinearGradient colors={['#1d2b53', '#1a1a2e', '#16213e']} style={styles.gradient}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#FFD700" />
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16243c', '#1d3557']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <BackButton />
                <StatusBarComponent />

                {/* Title */}
                <Text style={styles.header}>🌟 Daily Challenge</Text>
                <Text style={styles.subheader}>One per day — prove your memory!</Text>

                {phase === 'countdown' && <Countdown onComplete={handleStart} />}

                {phase === 'show' && (
                    <GridContainer>
                        {sequence.map((symbol, i) => (
                            <SymbolButton key={`${symbol}-${i}`} symbol={symbol} onPress={() => { }} disabled />
                        ))}
                    </GridContainer>
                )}

                {phase === 'input' && (
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Recreate the sequence:</Text>

                        <GridContainer>
                            {shuffledSymbols.map((symbol, i) => (
                                <SymbolButton
                                    key={`${symbol}-${i}`}
                                    symbol={symbol}
                                    onPress={() => handleSymbolPress(symbol)}
                                    disabled={userSequence.includes(symbol)}
                                />
                            ))}
                        </GridContainer>

                        {/* User Input Preview */}
                        <View style={styles.userSequence}>
                            {userSequence.map((s, i) => (
                                <Text key={`${s}-${i}`} style={styles.userSymbol}>
                                    {s}
                                </Text>
                            ))}
                            {Array.from({ length: sequence.length - userSequence.length }).map((_, i) => (
                                <Text key={`ph-${i}`} style={styles.placeholder}>
                                    ?
                                </Text>
                            ))}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                                <Text style={styles.resetText}>🔄 Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    userSequence.length !== sequence.length && styles.disabledButton,
                                ]}
                                onPress={handleSubmit}
                                disabled={userSequence.length !== sequence.length}
                            >
                                <Text style={styles.submitText}>🎯 Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFD700',
        marginBottom: 8,
        letterSpacing: 1.5,
        textShadowColor: 'rgba(255, 215, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    subheader: {
        fontSize: 16,
        color: '#D1D5DB',
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: '500',
        opacity: 0.8,
    },
    inputSection: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        color: '#e0e7ff',
        marginBottom: 12,
        fontWeight: '600',
    },
    userSequence: {
        flexDirection: 'row',
        marginVertical: 20,
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    userSymbol: {
        fontSize: 36,
        color: '#ffffff',
        fontWeight: 'bold',
        minWidth: 40,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    placeholder: {
        fontSize: 36,
        color: '#6b7280',
        minWidth: 40,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
        width: '100%',
        justifyContent: 'center',
    },
    resetButton: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    resetText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#F59E0B', // Amber for "premium"
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0.1,
        elevation: 2,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default DailyChallengeScreen;