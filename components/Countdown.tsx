import { useSound } from '@/hooks/useSound';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface CountdownProps {
    duration?: number;
    onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ duration = 3, onComplete }) => {
    const { playSound, stopSound } = useSound();
    const [count, setCount] = useState(duration);
    const scale = useSharedValue(1);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const hasPlayedSound = useRef(false); // Prevent sound from playing more than once
    const { i18n } = useTranslation();

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Only run ONCE when countdown starts
    useEffect(() => {
        if (hasPlayedSound.current) return;

        playSound('countdown');
        hasPlayedSound.current = true;

        // ❌ Remove stopSound from here for now
        // We don't want to stop it prematurely
    }, [playSound]);

    // Handle countdown logic without playing sound every tick
    useEffect(() => {
        if (count <= 0) return;

        scale.value = withTiming(1.2, { duration: 100 }, () => {
            scale.value = withTiming(1, { duration: 100 });
        });

        const id = setTimeout(() => {
            if (count > 1) {
                setCount(count - 1);
            } else {
                setCount(0);
                // Use a small delay for "Go!" visual
                const completeId = setTimeout(onComplete, 500);
                // Clean up the complete timeout
                return () => clearTimeout(completeId);
            }
        }, 1000);

        return () => clearTimeout(id);
    }, [count, onComplete, scale]);

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Text style={i18n.language === 'ar' ? styles.text1 : styles.text}>
                {count === 0 ? i18n.language === 'ar' ? 'انطلق' : 'Go!' : count}
            </Text>
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
    text1: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    }
});

export default Countdown;