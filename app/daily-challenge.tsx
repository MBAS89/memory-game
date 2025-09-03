import BackButton from '@/components/BackButton';
import { useSound } from '@/hooks/useSound';
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
    const router = useRouter();

    const [lastDailyChallengeDate, setLastDailyChallengeDate, loadingPersist] =
        usePersistedState<string | null>('lastDailyChallengeDate', null);

    const [phase, setPhase] = useState<'countdown' | 'show' | 'input'>('countdown');

    // Simulate ~level 20 difficulty – memoized to avoid recalculation
    const sequence = useMemo(() => generateSequence(20), []);
    const shuffledSymbols = useMemo(() => shuffleArray(sequence), [sequence]);

    const [userSequence, setUserSequence] = useState<string[]>([]);

    // If already completed today, bounce immediately (no new Date allocations every render)
    useEffect(() => {
        if (!loadingPersist && lastDailyChallengeDate && isToday(lastDailyChallengeDate)) {
            Alert.alert('Already Completed', 'You can only play the daily challenge once per day.', [
                { text: 'Back', onPress: () => router.back() },
            ]);
        }
    }, [lastDailyChallengeDate, loadingPersist, router]);

    const displayTime = 1600; // from your original calc

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
            playSound('success');
            Alert.alert('🎉 Challenge Complete!', 'Great job! Come back tomorrow for a new challenge.', [
                { text: 'Back to Menu', onPress: () => router.push('/') },
            ]);
        } else {
            playSound('failure');
            Alert.alert('❌ Try Again', 'Incorrect sequence. Want to give it another shot?', [
                { text: 'Give Up', style: 'cancel', onPress: () => router.push('/') },
                { text: 'Retry', style: 'default', onPress: handleReset },
            ]);
        }
    }, [handleReset, playSound, router, sequence, setLastDailyChallengeDate, userSequence]);

    if (loadingPersist) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF9500" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.header}>Daily Challenge</Text>
            <Text style={styles.subheader}>One per day — good luck!</Text>

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
        paddingTop: 40,
        flex: 1,
        backgroundColor: '#FFF8E1',
        padding: 20,
        alignItems: 'center',
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#D97706',
        marginVertical: 10,
    },
    subheader: {
        fontSize: 16,
        color: '#A16207',
        marginBottom: 30,
    },
    inputSection: { marginTop: 20, alignItems: 'center' },
    label: { fontSize: 16, color: '#7C5D06', marginBottom: 10 },
    userSequence: {
        flexDirection: 'row',
        marginVertical: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    userSymbol: { fontSize: 32, marginHorizontal: 8 },
    placeholder: { fontSize: 32, color: '#ccc', marginHorizontal: 8 },
    buttonRow: { flexDirection: 'row', gap: 20, marginTop: 20 },
    resetButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    resetText: { color: '#fff', fontWeight: '600' },
    submitButton: {
        backgroundColor: '#FF9500',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    disabledButton: { backgroundColor: '#CD853F' },
    submitText: { color: '#fff', fontWeight: '600' },
});

export default DailyChallengeScreen;
