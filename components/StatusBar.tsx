// components/StatusBar.tsx
import { useProfileContext } from '@/contexts/ProfileContext'; // CHANGE THIS IMPORT
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const StatusBarComponent = () => {
    const { profile } = useProfileContext();
    const { push } = useRouter();

    return (
        <TouchableOpacity onPress={() => push('/shop')} activeOpacity={0.7}>
            <View style={styles.container}>
                {/* Hearts */}
                <View style={styles.stat}>
                    <Text style={styles.heart}>❤️</Text>
                    <Text style={styles.value}>{profile.hearts}/5</Text>
                </View>

                {/* XP */}
                <View style={styles.stat}>
                    <Text style={styles.xp}>✨</Text>
                    <Text style={styles.value}>{profile.xp.toLocaleString()}</Text>
                </View>

                {/* Coins */}
                <View style={styles.stat}>
                    <Text style={styles.coin}>🪙</Text>
                    <Text style={styles.value}>{profile.coins.toLocaleString()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default StatusBarComponent;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        // Optional: Add subtle background overlay
        backgroundColor: '#1a213880', // Semi-transparent dark glass
        borderRadius: 16,
        marginVertical: 6,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#5c9cff40',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    value: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    heart: {
        fontSize: 20,
    },
    xp: {
        fontSize: 20,
    },
    coin: {
        fontSize: 20,
    },
});
