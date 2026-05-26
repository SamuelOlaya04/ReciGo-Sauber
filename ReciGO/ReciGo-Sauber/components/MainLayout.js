import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BRAND_GREEN = '#22C55E';
const BRAND_BLUE = '#3B82F6';
const TOP_PAD = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 50;

// ─── Tabs para usuarios normales ───────────────────────────────────────────
const USER_TABS = [
    { icon: 'home',             label: 'Inicio',    screen: 'Home'         },
    { icon: 'plus',             label: 'Agregar',   screen: 'Agregar'      },
    { icon: 'trophy-outline',   label: 'Puntos',    screen: 'Gamification' },
    { icon: 'book-open-variant',label: 'Educación', screen: 'Education'    },
    { icon: 'chart-bar',        label: 'Dashboard', screen: 'Dashboard'    },
];

// ─── Tabs para administrador ───────────────────────────────────────────────
const ADMIN_TABS = [
    { icon: 'clipboard-check-outline', label: 'Validar',   screen: 'AdminDashboard' },
    { icon: 'account-group-outline',   label: 'Usuarios',  screen: 'AdminUsers'     },
    { icon: 'account-circle-outline',  label: 'Mi perfil', screen: 'Profile'        },
];

// ─── Tab animado individual ───────────────────────────────────────────────────
const AnimatedTab = ({ tab, isActive, onPress, accentColor }) => {
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

    const activeIndicatorColor = accentColor === 'blue' ? '#EFF6FF' : '#F0FDF4';
    const activeIconColor      = accentColor === 'blue' ? BRAND_BLUE : BRAND_GREEN;
    const activeLabelColor     = accentColor === 'blue' ? BRAND_BLUE : BRAND_GREEN;

    return (
        <TouchableOpacity style={styles.navTab} activeOpacity={1} onPress={handlePress}>
            <Animated.View style={{ transform: [{ scale }] }}>
                <Animated.View style={[
                    styles.activeIndicator,
                    { opacity: bgOpacity, backgroundColor: activeIndicatorColor },
                ]} />
                <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                    <MaterialCommunityIcons
                        name={tab.icon}
                        size={24}
                        color={isActive ? activeIconColor : '#9CA3AF'}
                    />
                </Animated.View>
            </Animated.View>
            <Text style={[
                styles.navLabel,
                isActive ? { ...styles.navLabelActive, color: activeLabelColor } : null,
            ]}>
                {tab.label}
            </Text>
        </TouchableOpacity>
    );
};

// ─── Layout principal ─────────────────────────────────────────────────────────
export default function MainLayout({ children, navigation, activeScreen }) {
    const fadeAnim  = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(18)).current;
    const [rol, setRol] = useState('usuario');

    // Cargar el rol del usuario desde AsyncStorage
    useEffect(() => {
        const cargarRol = async () => {
            try {
                const stored = await AsyncStorage.getItem('usuario');
                const user = stored ? JSON.parse(stored) : null;
                setRol(user?.rol || 'usuario');
            } catch (err) {
                setRol('usuario');
            }
        };
        cargarRol();
    }, []);

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

    const esAdmin = rol === 'admin';
    const TABS = esAdmin ? ADMIN_TABS : USER_TABS;
    const accentColor = esAdmin ? 'blue' : 'green';

    return (
        <View style={styles.container}>
            <View style={{ height: TOP_PAD, backgroundColor: '#FFFFFF' }} />
            <Animated.View style={[styles.content, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            }]}>
                {children}
            </Animated.View>
            <View style={[
                styles.bottomNav,
                esAdmin ? styles.bottomNavAdmin : null,
            ]}>
                {TABS.map((tab, i) => (
                    <AnimatedTab
                        key={i}
                        tab={tab}
                        isActive={tab.screen === activeScreen}
                        onPress={() => navigation?.navigate(tab.screen)}
                        accentColor={accentColor}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:      { flex: 1, backgroundColor: '#FFFFFF' },
    content:        { flex: 1 },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    bottomNavAdmin: {
        borderTopColor: '#DBEAFE',
    },
    navTab:         { flex: 1, alignItems: 'center', justifyContent: 'center' },
    activeIndicator:{ position: 'absolute', width: 36, height: 36, borderRadius: 18, top: -6, left: -6 },
    navLabel:       { fontSize: 11, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },
    navLabelActive: { fontWeight: '700' },
});
