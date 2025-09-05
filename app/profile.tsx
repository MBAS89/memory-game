import BackButton from '@/components/BackButton';
import { useProfileContext } from '@/contexts/ProfileContext';
import { RANKS, getCurrentRank } from '@/utils/ranks';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';


const ProfileScreen = () => {
    const { profile, updateProfile } = useProfileContext();
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(profile.username || 'Player');

    const currentRank = getCurrentRank(profile.xp);

    const handleNameChange = () => {
        const trimmed = newUsername.trim();
        if (!trimmed) {
            Alert.alert('Invalid Name', 'Username cannot be empty.');
            setNewUsername(profile.username || 'Player');
            setIsEditing(false);
            return;
        }

        if (trimmed === profile.username) {
            setIsEditing(false);
            return;
        }

        try {
            updateProfile({ username: trimmed });
            setIsEditing(false);
        } catch (err: unknown) {
            const error = err as Error;
            Alert.alert('Error', 'Failed to update username: ' + error.message);
            setNewUsername(profile.username || 'Player');
            setIsEditing(false);
        }
    };

    const renderRank = ({ item }: { item: any }) => {
        const isUnlocked = profile.xp >= item.xpRequired;
        const isCurrent = item.name === currentRank.name;

        return (
            <View style={[styles.rankItem, !isUnlocked && styles.rankLocked]}>
                <View style={styles.rankIconBox}>
                    <Text style={styles.rankIcon}>{item.icon}</Text>
                </View>
                <View style={styles.rankInfo}>
                    <Text style={[styles.rankName, !isUnlocked && styles.rankNameLocked]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.rankDesc, !isUnlocked && styles.rankDescLocked]}>
                        {item.description}
                    </Text>
                    <Text style={[styles.rankXp, !isUnlocked && styles.rankDescLocked]}>
                        🎯 {item.xpRequired.toLocaleString()} XP
                    </Text>
                </View>
                {isCurrent && <Text style={styles.currentBadge}>Current</Text>}
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['#1d2b53', '#1a1a2e', '#16213e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <BackButton />
                <Text style={styles.title}>👤 Your Profile</Text>

                {/* Player Stats Card */}
                <View style={styles.statCard}>
                    {/* Editable Username */}
                    <TouchableWithoutFeedback onPress={() => !isEditing && setIsEditing(true)}>
                        <View>
                            {isEditing ? (
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={newUsername}
                                        onChangeText={setNewUsername}
                                        autoFocus
                                        onSubmitEditing={handleNameChange}
                                        onBlur={handleNameChange}
                                        maxLength={16}
                                    />
                                    <TouchableOpacity onPress={handleNameChange}>
                                        <Text style={styles.saveButton}>💾</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text style={styles.name}>🎮 {profile.username || 'Player'}</Text>
                            )}
                        </View>
                    </TouchableWithoutFeedback>

                    <Text style={styles.sub}>Tap to edit your name</Text>

                    {/* Stats */}
                    <View style={styles.statRow}>
                        <Text style={styles.stat}>🎯 {profile.totalLevelsCompleted} Levels</Text>
                        <Text style={styles.stat}>✨ {profile.xp.toLocaleString()} XP</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.stat}>🪙 {profile.coins} Coins</Text>
                        <Text style={styles.stat}>❤️ {profile.hearts}/5</Text>
                    </View>
                </View>

                {/* Current Rank */}
                <View style={styles.currentRankCard}>
                    <Text style={styles.currentTitle}>Your Rank</Text>
                    <Text style={styles.currentRankName}>
                        {currentRank.icon} {currentRank.name}
                    </Text>
                    <Text style={styles.currentDesc}>{currentRank.description}</Text>
                </View>

                {/* Rank Progression List */}
                <Text style={styles.listTitle}>🏆 Rank Progression</Text>
                <FlatList
                    data={RANKS}
                    keyExtractor={(item) => item.name}
                    renderItem={renderRank}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
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
        paddingTop: 100,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 1.2,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    statCard: {
        backgroundColor: '#1a2138',
        padding: 22,
        borderRadius: 18,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#5c9cff40',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    name: {
        fontSize: 26,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
        borderBottomWidth: 2,
        borderBottomColor: '#5c9cff',
        marginRight: 10,
        padding: 0,
    },
    saveButton: {
        fontSize: 20,
    },
    sub: {
        fontSize: 13,
        color: '#d1d5db',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 14,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 6,
    },
    stat: {
        fontSize: 16,
        color: '#e0e7ff',
        fontWeight: '500',
    },
    currentRankCard: {
        backgroundColor: '#5c9cff',
        padding: 26,
        borderRadius: 18,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#5c9cff',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 16,
        elevation: 8,
    },
    currentTitle: {
        fontSize: 16,
        color: '#e0f2ff',
        marginBottom: 6,
    },
    currentRankName: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        letterSpacing: 1,
    },
    currentDesc: {
        fontSize: 15,
        color: '#ffffff',
        textAlign: 'center',
        opacity: 0.9,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 12,
        marginLeft: 4,
    },
    listContainer: {
        paddingBottom: 40,
    },
    rankItem: {
        flexDirection: 'row',
        backgroundColor: '#1a2138',
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#5c9cff40',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    rankLocked: {
        opacity: 0.5,
    },
    rankIconBox: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#1d2b53',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderWidth: 2,
        borderColor: '#5c9cff',
    },
    rankIcon: {
        fontSize: 26,
        color: '#ffffff',
    },
    rankInfo: {
        flex: 1,
    },
    rankName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    rankNameLocked: {
        color: '#9ca3af',
    },
    rankDesc: {
        fontSize: 13,
        color: '#d1d5db',
        marginTop: 2,
    },
    rankDescLocked: {
        color: '#6b7280',
    },
    rankXp: {
        fontSize: 12,
        color: '#81c7f4',
        marginTop: 4,
        fontWeight: '500',
    },
    currentBadge: {
        backgroundColor: '#FFD700',
        color: '#333',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 14,
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 10,
        shadowColor: '#FFD700',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
});

export default ProfileScreen;