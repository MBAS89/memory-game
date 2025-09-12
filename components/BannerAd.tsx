// components/BannerAd.tsx
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy'; // Replace later

const BannerAdComponent = () => {
    const [adLoaded, setAdLoaded] = useState(false);

    return (
        <View style={styles.container}>
            {/* Optional: Show loader or nothing while loading */}
            {adLoaded && <View style={styles.spacer} />}

            <View style={[styles.adContainer, !adLoaded && styles.adPlaceholder]}>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                    onAdLoaded={() => setAdLoaded(true)}
                    onAdFailedToLoad={(error) => {
                        console.log('BannerAd failed to load:', error);
                        setAdLoaded(false);
                    }}
                />
            </View>

            {/* Spacer pushes ad to bottom safely */}
            <View style={styles.bottomSpacer} />
        </View>
    );
};

export default BannerAdComponent;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 0
    },
    adContainer: {
        width: '100%',
        height: 60, // Anchored adaptive banner usually ~50–70dp high
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
    },
    adPlaceholder: {
        // Optional: show empty bar to prevent layout jump
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacer: {
        height: 10,
        width: '100%',
        backgroundColor: '#1a1a2e',
    },
    bottomSpacer: {
        height: 10, // Adds safe gap above device notch/bottom UI
    },
});