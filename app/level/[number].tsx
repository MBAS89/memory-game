import BackButton from '@/components/BackButton';
import { useSound } from '@/hooks/useSound';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

const LevelScreen = () => {
    const { playSound } = useSound();
    const { number } = useLocalSearchParams<{ number: string }>();
    const level = parseInt(number, 10);
    const router = useRouter();

    const [highestUnlockedLevel, setHighestUnlockedLevel] = usePersistedState<number>('highestUnlockedLevel', 1);
    const [sequence, setSequence] = useState<string[]>([]);
    const [shuffledSymbols, setShuffledSymbols] = useState<string[]>([]);
    const [userSequence, setUserSequence] = useState<string[]>([]);
    const [phase, setPhase] = useState<'countdown' | 'show' | 'input'>('countdown');
    const [loading, setLoading] = useState(true);

    // Generate sequence
    useEffect(() => {
        const seq = generateSequence(level);
        setSequence(seq);
        setShuffledSymbols(shuffleArray(seq));
        setLoading(false);
    }, [level]);

    // Calculate display time: decreases with level, minimum 500ms
    const displayTime = Math.max(4000 - level * 30, 500);

    // Phase 1: Countdown
    const handleStart = () => {
        setPhase('show');
        setTimeout(() => {
            setPhase('input');
        }, displayTime);
    };

    // Phase 2: Input
    const handleSymbolPress = (symbol: string) => {
        if (userSequence.length < sequence.length) {
            playSound('tap');
            setUserSequence([...userSequence, symbol]);
        }
    };

    const handleReset = () => {
        setUserSequence([]);
    };

    const handleSubmit = () => {
        if (userSequence.length !== sequence.length) return;

        if (userSequence.every((s, i) => s === sequence[i])) {
            // ✅ Success: Offer "Next Level" or "Back to Menu"
            const nextLevel = level + 1;
            const isLastLevel = nextLevel > 100;
            playSound('success')
            Alert.alert(
                '🎉 Success!',
                `Level ${level} completed!`,
                [
                    {
                        text: 'Back to Menu',
                        onPress: () => router.push('/'),
                    },
                    !isLastLevel
                        ? {
                            text: 'Next Level',
                            onPress: () => {
                                if (level === highestUnlockedLevel) {
                                    setHighestUnlockedLevel(Math.min(nextLevel, 100));
                                }
                                router.push(`/level/${nextLevel}`);
                            },
                            style: 'default',
                        }
                        : null,
                ].filter(Boolean) as any
            );
        } else {
            playSound('failure')
            // ❌ Failure: Retry or Give Up
            Alert.alert(
                '❌ Try Again Fatima',
                'Incorrect sequence. Want to give it another shot?',
                [
                    {
                        text: 'Give Up',
                        style: 'cancel',
                        onPress: () => router.push('/'),
                    },
                    {
                        text: 'Retry',
                        style: 'default',
                        onPress: handleReset,
                    },
                ]
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.header}>Level {level}</Text>
            <Text style={styles.subheader}>Remember the order!</Text>

            {phase === 'countdown' && <Countdown onComplete={handleStart} />}

            {phase === 'show' && (
                <GridContainer>
                    {sequence.map((symbol, i) => (
                        <SymbolButton key={i} symbol={symbol} onPress={() => { }} disabled />
                    ))}
                </GridContainer>
            )}

            {phase === 'input' && (
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Tap symbols in order:</Text>
                    <GridContainer>
                        {shuffledSymbols.map((symbol, i) => (
                            <SymbolButton
                                key={i}
                                symbol={symbol}
                                onPress={() => handleSymbolPress(symbol)}
                                disabled={userSequence.includes(symbol)}
                            />
                        ))}
                    </GridContainer>

                    <View style={styles.userSequence}>
                        {userSequence.map((s, i) => (
                            <Text key={i} style={styles.userSymbol}>
                                {s}
                            </Text>
                        ))}
                        {Array.from({ length: sequence.length - userSequence.length }).map((_, i) => (
                            <Text key={i + userSequence.length} style={styles.placeholder}>
                                ?
                            </Text>
                        ))}
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submitButton, userSequence.length !== sequence.length && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={userSequence.length !== sequence.length}
                        >
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333',
    },
    subheader: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
    },
    inputSection: {
        marginTop: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    userSequence: {
        flexDirection: 'row',
        marginVertical: 20,
        gap: 10,
    },
    userSymbol: {
        fontSize: 32,
        marginHorizontal: 8,
    },
    placeholder: {
        fontSize: 32,
        color: '#ccc',
        marginHorizontal: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
    },
    resetButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    resetText: {
        color: '#fff',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#34C759',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#999',
    },
    submitText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default LevelScreen;