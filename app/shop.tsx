import BackButton from '@/components/BackButton';
import { useProfileContext } from '@/contexts/ProfileContext';
import { useRewardedAd } from '@/hooks/useRewardedAd';
import { useSound } from '@/hooks/useSound';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


const ShopScreen = () => {
    const { profile, updateProfile } = useProfileContext();
    const { t } = useTranslation();
    const MAX_HEARTS = 5;
    const HEART_COST = 50;
    const { playSound } = useSound()

    const { showAd: showRewardedAd, isReady } = useRewardedAd();

    const buyHeart = () => {
        if (profile.hearts >= MAX_HEARTS) {
            Alert.alert('❤️ Maximum Reached', 'You already have 5 hearts — that’s the maximum!');
            return;
        }

        if (profile.coins >= HEART_COST) {
            playSound('purchase')
            updateProfile({
                coins: profile.coins - HEART_COST,
                hearts: Math.min(profile.hearts + 1, MAX_HEARTS),
            });
            Alert.alert('❤️ Heart Purchased!', 'You gained 1 heart!');
        } else {
            playSound('wrong')
            Alert.alert(
                '🪙 Not Enough Coins!',
                'You need 50 coins to buy a heart. Play more levels or complete the daily challenge to earn coins!'
            );
        }
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

                {/* Title */}
                <Text style={styles.title}>{t('shopTitle')}</Text>

                {/* Player Stats */}
                <View style={styles.statsRow}>
                    <Text style={styles.stat}>
                        🪙 <Text style={styles.value}>{profile.coins}</Text>
                    </Text>
                    <Text style={styles.statDivider}>|</Text>
                    <Text style={styles.stat}>
                        ❤️ <Text style={styles.value}>{profile.hearts}/5</Text>
                    </Text>
                </View>

                {/* Item Card */}
                <View style={styles.card}>
                    <Text style={styles.itemName}>{t('buyHeart')}</Text>
                    <Text style={styles.itemPrice}>{t('needCoins').split('50')[0]} {HEART_COST} {t('needCoins').split('50')[1]}</Text>

                    <TouchableOpacity
                        style={[
                            styles.buyButton,
                            profile.hearts >= MAX_HEARTS
                                ? styles.disabledButton
                                : {},
                        ]}
                        onPress={buyHeart}
                        disabled={profile.hearts >= MAX_HEARTS}
                    >
                        <Text style={styles.buyText}>
                            {profile.hearts >= MAX_HEARTS ? t('maxHearts') : t('buyHeart')}
                        </Text>
                    </TouchableOpacity>

                    {profile.hearts >= MAX_HEARTS && (
                        <Text style={styles.maxMessage}>{t('fiveHearts')}</Text>
                    )}
                </View>
            </View>
            {/* Rewarded Ad Section */}
            <View style={styles.card}>
                <Text style={styles.itemName}>🎁 Watch Ad for Extra Heart</Text>
                <Text style={styles.itemPrice}>Earn 1 heart instantly!</Text>
                <TouchableOpacity
                    style={[
                        styles.buyButton,
                        !isReady && styles.disabledButton,
                    ]}
                    onPress={() => {
                        showRewardedAd(() => {
                            if (profile.hearts < 5) {
                                updateProfile({ hearts: profile.hearts + 1 });
                            } else {
                                Alert.alert('❤️ Full Hearts', 'You already have 5 hearts!');
                            }
                        });
                    }}
                    disabled={!isReady}
                >
                    <Text style={styles.buyText}>
                        {isReady ? 'Watch & Earn' : 'Loading...'}
                    </Text>
                </TouchableOpacity>
                {!isReady && (
                    <Text style={styles.maxMessage}>Preparing ad…</Text>
                )}
            </View>
        </LinearGradient >
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
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 20,
        letterSpacing: 1.2,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff20',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#ffffff40',
    },
    stat: {
        fontSize: 18,
        color: '#e0e7ff',
        fontWeight: '600',
    },
    statDivider: {
        marginHorizontal: 10,
        color: '#ffffff60',
    },
    value: {
        color: '#ffffff',
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#1a2138',
        padding: 24,
        borderRadius: 18,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#5c9cff40',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        textAlign: 'center'
    },
    itemName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
    },
    itemPrice: {
        fontSize: 16,
        color: '#FFB49A',
        marginBottom: 20,
        fontWeight: '500',
        textAlign: 'center'
    },
    buyButton: {
        backgroundColor: '#FF6B35',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 16,
        minWidth: 140,
        alignItems: 'center',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    disabledButton: {
        backgroundColor: '#6B7280',
        shadowOpacity: 0.1,
        elevation: 2,
    },
    buyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    maxMessage: {
        marginTop: 12,
        fontSize: 14,
        color: '#f87171',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default ShopScreen;