import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Logo de ReciGo — ícono de hoja con fondo verde animado
export default function AppLogo({ size = 42, animated = false }) {
    const pulse = useRef(new Animated.Value(1)).current;
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!animated) return;

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1,    duration: 900, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.timing(rotate, {
                toValue: 1,
                duration: 8000,
                useNativeDriver: true,
            })
        ).start();
    }, [animated]);

    const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    const iconSize = size * 0.55;

    return (
        <Animated.View style={[
            styles.logoBox,
            { width: size, height: size, borderRadius: size * 0.22 },
            animated && { transform: [{ scale: pulse }] },
        ]}>
            <Animated.View style={animated && { transform: [{ rotate: spin }] }}>
                <MaterialCommunityIcons name="recycle" size={iconSize} color="#fff" />
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    logoBox: {
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
});
