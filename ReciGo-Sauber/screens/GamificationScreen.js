import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import AppLogo from '../components/AppLogo';
import { API_URL } from '../config';

const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';
const BRAND_GREEN_LIGHT = '#4ADE80';

// TODO: Cuando esté la autenticación real, reemplazar por el usuario logueado
const ID_USUARIO_ACTUAL = 1;

// ─── Lista de recompensas disponibles ─────────────────────────────────────
const RECOMPENSAS = [
    { id: 'amazon-5',   icono: 'gift-outline',     color: '#A855F7', bg: '#FAF5FF', puntos: 500,  titulo: 'Tarjeta Amazon $5' },
    { id: 'spotify-10', icono: 'shopping-outline', color: '#3B82F6', bg: '#EFF6FF', puntos: 800,  titulo: 'Tarjeta Spotify $10' },
    { id: 'dollarcity', icono: 'shopping-outline', color: '#F97316', bg: '#FFF7ED', puntos: 1500, titulo: 'Tarjeta $25.000 Dollarcity' },
    { id: 'cine',       icono: 'ticket-outline',   color: BRAND_GREEN, bg: '#F0FDF4', puntos: 1000, titulo: 'Entrada cine 2x1' },
];

// ─── Helpers para alertas que funcionen tanto en web como en móvil ────────
const confirmar = (titulo, mensaje, onConfirm) => {
    if (Platform.OS === 'web') {
        if (window.confirm(`${titulo}\n\n${mensaje}`)) onConfirm();
    } else {
        Alert.alert(titulo, mensaje, [
            { text: 'No',  style: 'cancel' },
            { text: 'Sí, canjear', onPress: onConfirm },
        ]);
    }
};

const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
        window.alert(`${titulo}\n\n${mensaje}`);
    } else {
        Alert.alert(titulo, mensaje);
    }
};

const Header = () => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            <AppLogo size={40} />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.headerTitle}>ReciGo</Text>
                <Text style={styles.headerSub}>Aplicación de reciclaje</Text>
            </View>
        </View>
        <View style={styles.userIcon}>
            <MaterialIcons name="person-outline" size={22} color={BRAND_GREEN} />
        </View>
    </View>
);

export default function GamificationScreen({ navigation }) {
    const [stats, setStats]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const cargarEstadisticas = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(
                `${API_URL}/api/reciclaje/estadisticas/${ID_USUARIO_ACTUAL}`
            );
            setStats(data);
        } catch (err) {
            console.log('Error cargando estadísticas:', err.response?.data || err.message);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarEstadisticas();
        }, [])
    );

    // ─── Lógica de canje ──────────────────────────────────────────────────
    const intentarCanjear = (recompensa) => {
        if (stats.puntos_totales < recompensa.puntos) {
            mostrarAlerta(
                '😅 Oops, no te alcanza',
                'Sigue reciclando para ganar más puntos.'
            );
            return;
        }

        confirmar(
            '¿Canjear recompensa?',
            `Vas a canjear ${recompensa.puntos} puntos por: ${recompensa.titulo}. ¿Estás seguro?`,
            () => ejecutarCanje(recompensa)
        );
    };

    const ejecutarCanje = async (recompensa) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/reciclaje/canjear`, {
                id_usuario:        ID_USUARIO_ACTUAL,
                nombre_recompensa: recompensa.titulo,
                puntos_costo:      recompensa.puntos,
            });

            if (data.ok) {
                mostrarAlerta(
                    '🎉 ¡Canje exitoso!',
                    `Canjeaste: ${recompensa.titulo}. Te quedan ${data.nuevo_saldo} puntos.`
                );
                cargarEstadisticas();
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            if (msg === 'Puntos insuficientes') {
                mostrarAlerta(
                    '😅 Oops, no te alcanza',
                    'Sigue reciclando para ganar más puntos.'
                );
            } else {
                mostrarAlerta('Error al canjear', msg);
            }
        }
    };

    // ─── Loading ──────────────────────────────────────────────────────────
    if (loading && !stats) {
        return (
            <MainLayout navigation={navigation} activeScreen="Gamification">
                <Header />
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color={BRAND_GREEN} />
                    <Text style={styles.loadingText}>Cargando estadísticas...</Text>
                </View>
            </MainLayout>
        );
    }

    // ─── Error ────────────────────────────────────────────────────────────
    if (error && !stats) {
        return (
            <MainLayout navigation={navigation} activeScreen="Gamification">
                <Header />
                <View style={styles.centerBox}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text style={styles.errorTitle}>No se pudieron cargar las estadísticas</Text>
                    <Text style={styles.errorMsg}>{error}</Text>
                </View>
            </MainLayout>
        );
    }

    const { puntos_totales, puntos_ganados, racha_dias, nivel } = stats;
    const tieneRacha = racha_dias > 0;
    const mostrarGanados = puntos_ganados !== puntos_totales;

    return (
        <MainLayout navigation={navigation} activeScreen="Gamification">
            <Header />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.pageTitle}>Gamificación</Text>
                <Text style={styles.pageSubtitle}>Tus logros y recompensas</Text>

                {/* ─── Tarjeta principal de nivel ─────────────────────── */}
                <LinearGradient
                    colors={[BRAND_GREEN_DARK, BRAND_GREEN, BRAND_GREEN_LIGHT]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.levelCard}
                >
                    <View style={styles.levelCardTop}>
                        <View>
                            <Text style={styles.levelCardLabel}>Puntos disponibles</Text>
                            <Text style={styles.levelCardPoints}>{puntos_totales}</Text>
                            {mostrarGanados && (
                                <Text style={styles.levelCardEarned}>
                                    Has ganado {puntos_ganados} pts en total
                                </Text>
                            )}
                        </View>
                        <View style={styles.trophyCircle}>
                            <MaterialCommunityIcons name="trophy-outline" size={30} color="#fff" />
                        </View>
                    </View>

                    <View style={styles.levelRow}>
                        <MaterialCommunityIcons name={nivel.icono} size={22} color="#fff" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.levelName}>{nivel.nombre}</Text>
                            <Text style={styles.levelNext}>
                                {nivel.puntos_siguiente > 0
                                    ? `${nivel.puntos_siguiente} pts para el siguiente nivel`
                                    : '¡Nivel máximo alcanzado!'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { flex: Math.max(0.01, nivel.progreso) }]} />
                        <View style={{ flex: Math.max(0.01, 1 - nivel.progreso) }} />
                    </View>
                </LinearGradient>

                {/* ─── Racha ──────────────────────────────────────────── */}
                <View style={styles.streakCard}>
                    <View style={[
                        styles.streakIcon,
                        tieneRacha && { backgroundColor: '#FFF7ED' }
                    ]}>
                        <MaterialCommunityIcons
                            name="fire"
                            size={26}
                            color={tieneRacha ? '#F97316' : '#9CA3AF'}
                        />
                    </View>
                    <View style={{ marginLeft: 14, flex: 1 }}>
                        <Text style={styles.streakDays}>{racha_dias} días</Text>
                        <Text style={styles.streakSub}>
                            {tieneRacha
                                ? '¡Sigue así para mantener tu racha!'
                                : 'Registra hoy para iniciar tu racha'}
                        </Text>
                    </View>
                </View>

                {/* ─── Sección de canje de puntos ─────────────────────── */}
                <Text style={styles.sectionTitle}>Canjea tus puntos</Text>
                <Text style={styles.sectionSubtitle}>Obtén recompensas increíbles</Text>

                <View style={styles.rewardsGrid}>
                    {RECOMPENSAS.map((r) => {
                        const alcanza = puntos_totales >= r.puntos;
                        return (
                            <TouchableOpacity
                                key={r.id}
                                style={[
                                    styles.rewardCard,
                                    !alcanza && styles.rewardCardDisabled
                                ]}
                                activeOpacity={0.7}
                                onPress={() => intentarCanjear(r)}
                            >
                                <View style={[styles.rewardIconCircle, { backgroundColor: r.bg }]}>
                                    <MaterialCommunityIcons name={r.icono} size={22} color={r.color} />
                                </View>
                                <Text style={styles.rewardPoints}>{r.puntos} pts</Text>
                                <Text style={styles.rewardTitle}>{r.titulo}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#FFFFFF' },
    headerLeft:     { flexDirection: 'row', alignItems: 'center' },
    headerTitle:    { fontSize: 16, fontWeight: '700', color: '#111827' },
    headerSub:      { fontSize: 12, color: '#6B7280' },
    userIcon:       { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center' },

    scroll:         { flex: 1, backgroundColor: '#F9FAFB' },
    scrollContent:  { padding: 20, paddingBottom: 30 },

    pageTitle:      { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
    pageSubtitle:   { fontSize: 14, color: '#6B7280', marginBottom: 20 },

    levelCard:      { borderRadius: 16, padding: 20, marginBottom: 16 },
    levelCardTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    levelCardLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
    levelCardPoints:{ fontSize: 36, fontWeight: '700', color: '#FFFFFF' },
    levelCardEarned:{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    trophyCircle:   { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    levelRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    levelName:      { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
    levelNext:      { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
    progressBar:    { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, flexDirection: 'row', overflow: 'hidden' },
    progressFill:   { height: 6, backgroundColor: '#FFFFFF', borderRadius: 3 },

    streakCard:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18, marginBottom: 24, elevation: 2 },
    streakIcon:     { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
    streakDays:     { fontSize: 18, fontWeight: '700', color: '#111827' },
    streakSub:      { fontSize: 13, color: '#6B7280', marginTop: 2 },

    sectionTitle:   { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
    sectionSubtitle:{ fontSize: 13, color: '#6B7280', marginBottom: 14 },

    rewardsGrid:    { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    rewardCard:     { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
    rewardCardDisabled: { opacity: 0.55 },
    rewardIconCircle:{ width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    rewardPoints:   { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 2 },
    rewardTitle:    { fontSize: 12, color: '#6B7280' },

    centerBox:      { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    loadingText:    { marginTop: 12, fontSize: 14, color: '#6B7280' },
    errorTitle:     { marginTop: 12, fontSize: 16, fontWeight: '600', color: '#111827', textAlign: 'center' },
    errorMsg:       { marginTop: 6, fontSize: 13, color: '#6B7280', textAlign: 'center' },
});
