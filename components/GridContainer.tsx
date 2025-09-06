import React from 'react';
import { StyleSheet, View } from 'react-native';

interface GridContainerProps {
    children: React.ReactNode;
}

const GridContainer: React.FC<GridContainerProps> = ({ children }) => {
    return <View style={styles.grid}>{children}</View>;
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 300,
        writingDirection: 'ltr',
    },
});

export default React.memo(GridContainer);
