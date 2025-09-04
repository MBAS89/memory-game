import { useProfile } from '@/hooks/useProfile';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const OnboardingScreen = () => {
    const { updateProfile } = useProfile();
    const router = useRouter();
    const [username, setUsername] = useState('');

    const handleSubmit = () => {
        if (!username.trim()) {
            Alert.alert('Oops!', 'Please enter a name to continue.');
            return;
        }
        updateProfile({ username: username.trim() });
        router.replace('/');
    };

    return (
        <LinearGradient
            colors={['#1d2b53', '#1a1a2e', '#16213e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to Memory Master! 🎮</Text>
                <Text style={styles.subtitle}>What should we call you?</Text>

                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your name"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="words"
                    autoFocus
                    onSubmitEditing={handleSubmit}
                    maxLength={16}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>🚀 Start Playing</Text>
                </TouchableOpacity>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 1.2,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    subtitle: {
        fontSize: 18,
        color: '#d1d5db',
        marginBottom: 40,
        textAlign: 'center',
        fontWeight: '500',
        opacity: 0.9,
    },
    input: {
        borderWidth: 2,
        borderColor: '#5c9cff',
        backgroundColor: '#ffffff10',
        padding: 18,
        width: '100%',
        borderRadius: 16,
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 30,
        shadowColor: '#5c9cff',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 4,
    },
    button: {
        backgroundColor: '#FF6B35',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 18,
        minWidth: 200,
        alignItems: 'center',
        shadowColor: '#FF6B35',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1,
    },
});

export default OnboardingScreen;