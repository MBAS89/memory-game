import { Ionicons } from '@expo/vector-icons'; // Optional: install @expo/vector-icons
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const BackButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.container} onPress={() => router.push('/')}>
            <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 40,
        left: 16,
        zIndex: 10,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
});

export default BackButton;