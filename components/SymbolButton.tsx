import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';

interface SymbolButtonProps {
    symbol: string;
    onPress: () => void;
    disabled?: boolean;
    selected?: boolean;
}

const SymbolButton: React.FC<SymbolButtonProps> = ({ symbol, onPress, disabled, selected }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[styles.container, selected && styles.selected, disabled && styles.disabled]}
        >
            <Animated.Text style={styles.symbol}>{symbol}</Animated.Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    selected: { borderColor: '#007AFF', backgroundColor: '#E5F1FF' },
    disabled: { opacity: 0.5 },
    symbol: { fontSize: 28 },
});

export default React.memo(SymbolButton);
