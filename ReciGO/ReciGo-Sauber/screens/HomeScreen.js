import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import AppLogo from '../components/AppLogo';
import { API_URL } from '../config';

const BRAND_GREEN = '#22C55E';

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = ({ navigation }) => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            <AppLogo size={42} animated={true} />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.headerTitle}>ReciGo</Text>
                <Text style={styles.headerSubtitle}>Aplicación de reciclaje</Text>
            </View>
        </View>
        <TouchableOpacity
            style={styles.userIconCircle}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate('Profile')}
        >
            <MaterialIcons name="person-outline" size={22} color={BRAND_GREEN} />
        </TouchableOpacity>
    </View>
);

// ─── Tarjeta de impacto animada ───────────────────────────────────────────────
const ImpactCard = ({ stats }) => {
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    useEffect(() => {
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }).start();
    }, []);

    const puntos = stats?.puntos_ganados ?? 0;
    const racha = stats?.racha_dias ?? 0;
    const semana = stats?.puntos_semana ?? 0;

    return (
        <Animated.View style={[styles.impactCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.impactTop}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.impactLabel}>Tu impacto total</Text>
                    <Text style={styles.impactNumber}>{puntos}</Text>
                    <Text style={styles.impactPoints}>puntos acumulados</Text>
                </View>
                <View style={styles.leafBadge}>
                    <MaterialCommunityIcons name="leaf" size={28} color="#fff" />
                </View>
            </View>
            <View style={styles.impactStatsRow}>
                <View style={styles.impactStatBox}>
                    <Text style={styles.impactStatLabel}>Racha actual</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.impactStatNumber}>{racha}</Text>
                        <MaterialIcons name="local-fire-department" size={20} color="#F97316" style={{ marginLeft: 4 }} />
                    </View>
                </View>
                <View style={[styles.impactStatBox, { marginLeft: 10 }]}>
                    <Text style={styles.impactStatLabel}>Esta semana</Text>
                    <Text style={styles.impactStatNumber}>{semana}</Text>
                </View>
            </View>
        </Animated.View>
    );
};

// ─── Tarjeta de acción animada ────────────────────────────────────────────────
const QuickActionCard = ({ iconName, iconColor, bgColor, title, subtitle, onPress, delay = 0 }) => {
    const translateY = useRef(new Animated.Value(30)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, friction: 7, tension: 60, delay, useNativeDriver: true }),
        ]).start();
    }, []);

    const handlePressIn = () => Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, friction: 5 }).start();
    const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();

    return (
        <Animated.View style={[styles.quickActionCard, { opacity, transform: [{ translateY }, { scale }] }]}>
            <TouchableOpacity activeOpacity={1} onPress={onPress}
                onPressIn={handlePressIn} onPressOut={handlePressOut}
                style={{ flex: 1, padding: 16 }}>
                <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
                    <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
                </View>
                <Text style={styles.quickActionTitle}>{title}</Text>
                <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Pantalla ─────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
    const [stats, setStats] = useState(null);

    // Cargar estadísticas cada vez que la pantalla recibe foco
    useFocusEffect(
        useCallback(() => {
            const cargarStats = async () => {
                try {
                    const stored = await AsyncStorage.getItem('usuario');
                    const user = stored ? JSON.parse(stored) : null;
                    if (user?.id_usuario) {
                        const { data } = await axios.get(
                            `${API_URL}/api/reciclaje/estadisticas/${user.id_usuario}`
                        );
                        setStats(data);
                    }
                } catch (err) {
                    console.log('Error cargando stats home:', err.message);
                }
            };
            cargarStats();
        }, [])
    );

    const tieneRegistros = (stats?.registros_totales ?? 0) > 0;

    return (
        <MainLayout navigation={navigation} activeScreen="Home">
            <View style={styles.headerWrap}><Header navigation={navigation} /></View>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <ImpactCard stats={stats} />
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Acciones rápidas</Text>
                    <View style={styles.quickActionsGrid}>
                        <View style={styles.quickActionsRow}>
                            <QuickActionCard iconName="recycle" iconColor={BRAND_GREEN} bgColor="#DCFCE7" title="Registrar" subtitle="Agregar reciclaje" delay={0} onPress={() => navigation?.navigate('Agregar')} />
                            <QuickActionCard iconName="medal-outline" iconColor="#F97316" bgColor="#FFF7ED" title="Logros" subtitle="Ver puntos" delay={80} onPress={() => navigation?.navigate('Gamification')} />
                        </View>
                        <View style={styles.quickActionsRow}>
                            <QuickActionCard iconName="trending-up" iconColor="#3B82F6" bgColor="#EFF6FF" title="Estadísticas" subtitle="Ver dashboard" delay={160} onPress={() => navigation?.navigate('Dashboard')} />
                            <QuickActionCard iconName="book-open-outline" iconColor="#A855F7" bgColor="#FAF5FF" title="Aprender" subtitle="Contenido educativo" delay={240} onPress={() => navigation?.navigate('Education')} />
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Actividad reciente</Text>
                    {tieneRegistros ? (
                        <View style={styles.activitySummary}>
                            <View style={styles.activityRow}>
                                <View style={[styles.activityIcon, { backgroundColor: '#DCFCE7' }]}>
                                    <MaterialCommunityIcons name="recycle" size={20} color={BRAND_GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.activityTitle}>{stats.registros_totales} registros realizados</Text>
                                    <Text style={styles.activitySub}>{stats.puntos_ganados} pts ganados en total</Text>
                                </View>
                            </View>
                            <View style={styles.activityRow}>
                                <View style={[styles.activityIcon, { backgroundColor: '#EFF6FF' }]}>
                                    <MaterialCommunityIcons name="calendar-month" size={20} color="#3B82F6" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.activityTitle}>{stats.puntos_mes} pts este mes</Text>
                                    <Text style={styles.activitySub}>{stats.puntos_semana} pts esta semana</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.emptyActivity}>
                            <View style={styles.emptyIconCircle}>
                                <MaterialCommunityIcons name="recycle" size={30} color="#9CA3AF" />
                            </View>
                            <Text style={styles.emptyText}>Aún no has registrado ningún reciclaje</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    headerWrap: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffffff' },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
    headerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 1 },
    userIconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 24, paddingTop: 16 },
    impactCard: { backgroundColor: BRAND_GREEN, borderRadius: 20, padding: 20, marginBottom: 24, elevation: 8, shadowColor: BRAND_GREEN, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12 },
    impactTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    impactLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '500' },
    impactNumber: { color: '#fff', fontSize: 44, fontWeight: '700', lineHeight: 52 },
    impactPoints: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
    leafBadge: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
    impactStatsRow: { flexDirection: 'row' },
    impactStatBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 },
    impactStatLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '500', marginBottom: 4 },
    impactStatNumber: { color: '#fff', fontSize: 22, fontWeight: '700' },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 14 },
    quickActionsGrid: { flexDirection: 'column' },
    quickActionsRow: { flexDirection: 'row', marginBottom: 12 },
    quickActionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, marginRight: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
    iconCircle: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    quickActionTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
    quickActionSubtitle: { fontSize: 12, color: '#6B7280' },
    emptyActivity: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 32, alignItems: 'center', elevation: 2 },
    emptyIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    emptyText: { fontSize: 14, color: '#9CA3AF' },
    activitySummary: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 2 },
    activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    activityIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    activityTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
    activitySub: { fontSize: 12, color: '#6B7280' },
});
