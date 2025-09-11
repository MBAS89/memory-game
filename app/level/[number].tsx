import BackButton from '@/components/BackButton';
import { useSound } from '@/hooks/useSound';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Countdown from '../../components/Countdown';
import GridContainer from '../../components/GridContainer';
import SymbolButton from '../../components/SymbolButton';
import { usePersistedState } from '../../hooks/usePersistedState';
import { generateSequence } from '../../utils/generateSequence';
import { shuffleArray } from '../../utils/shuffleArray';

import StatusBarComponent from '@/components/StatusBar';
import { useProfileContext } from '@/contexts/ProfileContext';
import { useTranslation } from 'react-i18next';

const LevelScreen = () => {
    const { playSound, stopSound } = useSound();
    const { t } = useTranslation()
    const { profile, updateProfile } = useProfileContext();
    const { number } = useLocalSearchParams<{ number: string }>();
    const level = Number(number || 1);
    const router = useRouter();

    const [highestUnlockedLevel, setHighestUnlockedLevel, loadingPersist] =
        usePersistedState<number>('highestUnlockedLevel', 1);

    const [phase, setPhase] = useState<'countdown' | 'show' | 'input'>('countdown');

    useEffect(() => {
        return () => {
            stopSound('countdown');
            stopSound('success');
            stopSound('failure');
            stopSound('outOfHearts');
        };
    }, [stopSound]);

    // Generate sequence once per level
    const sequence = useMemo(() => generateSequence(level), [level]);
    const shuffledSymbols = useMemo(() => shuffleArray(sequence), [sequence]);

    const [userSequence, setUserSequence] = useState<string[]>([]);

    const displayTime = Math.max(4000 - level * 30, 500);

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
        [playSound, sequence.length, userSequence] // ✅ Correct: now includes full `userSequence`
    );

    const handleReset = useCallback(() => setUserSequence([]), []);

    const handleSubmit = useCallback(() => {
        if (userSequence.length !== sequence.length) return;

        const success = userSequence.every((s, i) => s === sequence[i]);
        if (success) {
            const nextLevel = level + 1;
            const isLastLevel = nextLevel > 100;
            const earnedXP = Math.floor(10 * Math.pow(1.1, level - 1));
            updateProfile({
                xp: profile.xp + earnedXP,
                coins: profile.coins + 5,
                totalLevelsCompleted: profile.totalLevelsCompleted + 1,
            });
            playSound('success');
            Alert.alert(
                t('congrats'),
                `${t('earnedOnLevel', { level })}\n\n${t('unlockedNext', { next: nextLevel })}\n${t('completedLevel')}\n${t('earnedCoin')}\n${t('earnedXp', { xp: earnedXP })}`,
                [
                    {
                        text: t('backToMenu'),
                        onPress: () => {
                            if (level === highestUnlockedLevel) {
                                setHighestUnlockedLevel(Math.min(nextLevel, 100));
                            }
                            stopSound('success');
                            router.replace('/');
                        },
                    },
                    !isLastLevel
                        ? {
                            text: t('nextLevel'),
                            onPress: () => {
                                if (level === highestUnlockedLevel) {
                                    setHighestUnlockedLevel(Math.min(nextLevel, 100));
                                }
                                stopSound('success');
                                router.replace(`/level/${nextLevel}`);
                            },
                            style: 'default',
                        }
                        : null,
                ].filter(Boolean) as any
            );
        } else {
            if (profile.hearts > 0 && profile.hearts !== 0) {
                updateProfile({ hearts: profile.hearts - 1 });
                playSound('failure'); // Optional: ensure this plays only once
                Alert.alert(
                    t('notQuiteLevel'),
                    `${t('oneHeartLost')}\n${t('heartsLeft', { hearts: profile.hearts - 1 })}\n${t('everyMistake')}`,
                    [
                        {
                            text: t('tryAgainButton'),
                            style: 'default',
                            onPress: () => {
                                stopSound('failure');
                                handleReset();
                            },
                        },
                        {
                            text: t('giveUp'),
                            style: 'cancel',
                            onPress: () => {
                                stopSound('failure');
                                router.replace('/');
                            },
                        },
                    ]
                );
            } else {
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
        }
    }, [
        handleReset,
        highestUnlockedLevel,
        level,
        playSound,
        router,
        sequence,
        setHighestUnlockedLevel,
        userSequence,
    ]);

    if (loadingPersist) {
        return (
            <LinearGradient colors={['#1d2b53', '#1a1a2e', '#16213e']} style={styles.gradient}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#5c9cff" />
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#1d2b53', '#1a1a2e', '#16213e']} style={styles.gradient}>
            <View style={styles.container}>
                <BackButton />
                <StatusBarComponent />

                <Text style={styles.header}>{t('level')} {level}</Text>
                <Text style={styles.subheader}>{t('rememberOrder')}</Text>

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
                        <Text style={styles.label}>{t('recreateSequence')}</Text>

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
                                <Text style={styles.resetText}>{t('reset')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    userSequence.length !== sequence.length && styles.disabledButton,
                                ]}
                                onPress={handleSubmit}
                                disabled={userSequence.length !== sequence.length}
                            >
                                <Text style={styles.submitText}>{t('submit')}</Text>
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
        color: '#ffffff',
        marginBottom: 8,
        letterSpacing: 1.2,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    subheader: {
        fontSize: 18,
        color: '#e0e7ff',
        marginBottom: 30,
        fontWeight: '500',
        opacity: 0.9,
    },
    inputSection: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
        writingDirection: 'ltr',
    },
    label: {
        fontSize: 16,
        color: '#d1d5db',
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
        backgroundColor: '#10B981',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    disabledButton: {
        backgroundColor: '#6B7280',
        shadowOpacity: 0.1,
        elevation: 2,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default LevelScreen;