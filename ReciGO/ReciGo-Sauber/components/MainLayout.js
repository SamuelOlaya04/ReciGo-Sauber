import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BRAND_GREEN = '#22C55E';
const TOP_PAD = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 50;

const TABS = [
    { icon: 'home',             label: 'Inicio',    screen: 'Home'         },
    { icon: 'plus',             label: 'Agregar',   screen: 'Agregar'      },
    { icon: 'trophy-outline',   label: 'Puntos',    screen: 'Gamification' },
    { icon: 'book-open-variant',label: 'Educación', screen: 'Education'    },
    { icon: 'chart-bar',        label: 'Dashboard', screen: 'Dashboard'    },
];

// ─── Tab animado individual ───────────────────────────────────────────────────
const AnimatedTab = ({ tab, isActive, onPress }) => {
    const scale    = useRef(new Animated.Value(1)).current;
    const iconAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

    useEffect(() => {
        Animated.spring(iconAnim, {
            toValue: isActive ? 1 : 0,
            useNativeDriver: true,
            friction: 6,
            tension: 80,
        }).start();
    }, [isActive]);

    const handlePress = () => {
        Animated.sequence([
            Animated.spring(scale, { toValue: 0.8, useNativeDriver: true, friction: 5 }),
            Animated.spring(scale, { toValue: 1,   useNativeDriver: true, friction: 5 }),
        ]).start();
        onPress();
    };

    const iconScale = iconAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] });
    const bgOpacity = iconAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

    return (
        <TouchableOpacity style={styles.navTab} activeOpacity={1} onPress={handlePress}>
            <Animated.View style={{ transform: [{ scale }] }}>
                <Animated.View style={[styles.activeIndicator, { opacity: bgOpacity }]} />
                <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                    <MaterialCommunityIcons name={tab.icon} size={24}
                        color={isActive ? BRAND_GREEN : '#9CA3AF'} />
                </Animated.View>
            </Animated.View>
            <Text style={[styles.navLabel, isActive ? styles.navLabelActive : null]}>
                {tab.label}
            </Text>
        </TouchableOpacity>
    );
};

// ─── Layout principal ─────────────────────────────────────────────────────────
export default function MainLayout({ children, navigation, activeScreen }) {
    const fadeAnim    = useRef(new Animated.Value(0)).current;
    const slideAnim   = useRef(new Animated.Value(18)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(18);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 280,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 60,
                useNativeDriver: true,
            }),
        ]).start();
    }, [activeScreen]);

    return (
        <View style={styles.container}>
            <View style={{ height: TOP_PAD, backgroundColor: '#FFFFFF' }} />
            <Animated.View style={[styles.content, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            }]}>
                {children}
            </Animated.View>
            <View style={styles.bottomNav}>
                {TABS.map((tab, i) => (
                    <AnimatedTab
                        key={i}
                        tab={tab}
                        isActive={tab.screen === activeScreen}
                        onPress={() => navigation?.navigate(tab.screen)}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:      { flex: 1, backgroundColor: '#FFFFFF' },
    content:        { flex: 1 },
    bottomNav:      { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 10, elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 10 },
    navTab:         { flex: 1, alignItems: 'center', justifyContent: 'center' },
    activeIndicator:{ position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0FDF4', top: -6, left: -6 },
    navLabel:       { fontSize: 11, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },
    navLabelActive: { color: BRAND_GREEN, fontWeight: '700' },
});
