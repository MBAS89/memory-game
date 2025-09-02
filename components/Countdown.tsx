import { useSound } from '@/hooks/useSound';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';


interface CountdownProps {
    duration?: number;
    onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ duration = 3, onComplete }) => {
    const { playSound } = useSound();
    const [timeLeft, setTimeLeft] = useState(duration);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    // In Countdown.tsx – update handleStart or useEffect
    useEffect(() => {
        if (timeLeft > 0) {
            // ✅ Delay sound & animation slightly so number renders first
            const trigger = setTimeout(() => {
                scale.value = withSpring(1.2, {}, () => {
                    scale.value = withSpring(1);
                });
                playSound('countdown'); // 🔊 Play after animation starts
            }, 100); // Small delay to let UI render

            // Schedule next tick
            const next = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 800);

            return () => {
                clearTimeout(trigger);
                clearTimeout(next);
            };
        } else {
            onComplete();
        }
    }, [timeLeft, onComplete, playSound, scale]);

    if (timeLeft === 0) {
        return (
            <Animated.View style={[styles.container, animatedStyle]}>
                <Text style={styles.text}>Go!</Text>
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Text style={styles.text}>{timeLeft}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFD700',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    text: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default Countdown;