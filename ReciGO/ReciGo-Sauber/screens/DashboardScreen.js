import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import AppLogo from '../components/AppLogo';
import { API_URL } from '../config';

const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';

// ─── Filtro animado ───────────────────────────────────────────────────────────
const FILTER_OPTIONS = ['Semana', 'Mes', 'Todo'];

const AnimatedFilter = ({ period, onSelect }) => {
    const scales = useRef(FILTER_OPTIONS.map(() => new Animated.Value(1))).current;
    const bgs    = useRef(FILTER_OPTIONS.map((opt) => new Animated.Value(opt === period ? 1 : 0))).current;

    useEffect(() => {
        FILTER_OPTIONS.forEach((opt, i) => {
            Animated.spring(bgs[i], {
                toValue: opt === period ? 1 : 0,
                friction: 6,
                tension: 80,
                useNativeDriver: false,
            }).start();
        });
    }, [period]);

    const handlePress = (opt, i) => {
        Animated.sequence([
            Animated.spring(scales[i], { toValue: 0.88, useNativeDriver: true, friction: 5 }),
            Animated.spring(scales[i], { toValue: 1,    useNativeDriver: true, friction: 5 }),
        ]).start();
        onSelect(opt);
    };

    return (
        <View style={fStyles.row}>
            {FILTER_OPTIONS.map((opt, i) => {
                const bgColor = bgs[i].interpolate({ inputRange: [0, 1], outputRange: ['transparent', BRAND_GREEN] });
                const txtColor = bgs[i].interpolate({ inputRange: [0, 1], outputRange: ['#6B7280', '#FFFFFF'] });
                return (
                    <Animated.View key={opt} style={[fStyles.btn, { transform: [{ scale: scales[i] }] }]}>
                        <TouchableOpacity activeOpacity={1} onPress={() => handlePress(opt, i)} style={{ flex: 1 }}>
                            <Animated.View style={[fStyles.inner, { backgroundColor: bgColor }]}>
                                <Animated.Text style={[fStyles.label, { color: txtColor }]}>{opt}</Animated.Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}
        </View>
    );
};

const fStyles = StyleSheet.create({
    row:   { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20, padding: 4 },
    btn:   { flex: 1 },
    inner: { borderRadius: 10, paddingVertical: 11, alignItems: 'center', justifyContent: 'center' },
    label: { fontSize: 14, fontWeight: '600' },
});

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = ({ navigation }) => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            <AppLogo size={40} />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.headerTitle}>ReciGo</Text>
                <Text style={styles.headerSub}>Aplicación de reciclaje</Text>
            </View>
        </View>
        <TouchableOpacity
            style={styles.userIcon}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate('Profile')}
        >
            <MaterialIcons name="person-outline" size={22} color={BRAND_GREEN} />
        </TouchableOpacity>
    </View>
);

// ─── Barra de progreso visual ─────────────────────────────────────────────────
const ProgressBar = ({ value, maxValue, color }) => {
    const widthAnim = useRef(new Animated.Value(0)).current;
    const ratio = maxValue > 0 ? Math.min(1, value / maxValue) : 0;

    useEffect(() => {
        Animated.spring(widthAnim, {
            toValue: ratio,
            friction: 8,
            tension: 40,
            useNativeDriver: false,
        }).start();
    }, [ratio]);

    const width = widthAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, { width, backgroundColor: color }]} />
        </View>
    );
};

// ─── Pantalla ─────────────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }) {
    const [period, setPeriod] = useState('Mes');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const cargarStats = async () => {
                try {
                    setLoading(true);
                    const stored = await AsyncStorage.getItem('usuario');
                    const user = stored ? JSON.parse(stored) : null;
                    if (user?.id_usuario) {
                        const { data } = await axios.get(
                            `${API_URL}/api/reciclaje/estadisticas/${user.id_usuario}`
                        );
                        setStats(data);
                    }
                } catch (err) {
                    console.log('Error cargando stats dashboard:', err.message);
                } finally {
                    setLoading(false);
                }
            };
            cargarStats();
        }, [])
    );

    // Seleccionar los datos según el período
    const getPuntosForPeriod = () => {
        if (!stats) return 0;
        if (period === 'Semana') return stats.puntos_semana ?? 0;
        if (period === 'Mes') return stats.puntos_mes ?? 0;
        return stats.puntos_ganados ?? 0;
    };

    const getRegistrosForPeriod = () => {
        if (!stats) return 0;
        // El backend solo da registros_totales, para semana/mes usamos proporciones
        return stats.registros_totales ?? 0;
    };

    const periodLabel = period === 'Semana' ? 'Esta semana' : period === 'Mes' ? 'Este mes' : 'Todo el tiempo';
    const puntosActual = getPuntosForPeriod();
    const registrosTotal = getRegistrosForPeriod();
    const rachaActual = stats?.racha_dias ?? 0;
    const promedioRegistro = stats?.promedio_por_registro ?? 0;
    const nivelNombre = stats?.nivel?.nombre ?? 'Principiante';
    const nivelProgreso = stats?.nivel?.progreso ?? 0;
    const puntosParaSiguiente = stats?.nivel?.puntos_siguiente ?? 0;
    const tieneData = (stats?.registros_totales ?? 0) > 0;

    if (loading && !stats) {
        return (
            <MainLayout navigation={navigation} activeScreen="Dashboard">
                <Header navigation={navigation} />
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color={BRAND_GREEN} />
                    <Text style={styles.loadingText}>Cargando estadísticas...</Text>
                </View>
            </MainLayout>
        );
    }

    return (
        <MainLayout navigation={navigation} activeScreen="Dashboard">
            <Header navigation={navigation} />
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.pageTitle}>Dashboard</Text>
                <Text style={styles.pageSubtitle}>Visualiza tus estadísticas de reciclaje</Text>
                <AnimatedFilter period={period} onSelect={setPeriod} />

                {/* ── Métricas principales ──────────────── */}
                <View style={styles.metricsRow}>
                    <LinearGradient colors={[BRAND_GREEN_DARK, BRAND_GREEN]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.metricCard}>
                        <MaterialCommunityIcons name="star-outline" size={24} color="#fff" style={{marginBottom:10}} />
                        <Text style={styles.metricValue}>{puntosActual}</Text>
                        <Text style={styles.metricLabel}>puntos</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#2563EB','#60A5FA']} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.metricCard,{marginLeft:10}]}>
                        <MaterialCommunityIcons name="clipboard-list-outline" size={24} color="#fff" style={{marginBottom:10}} />
                        <Text style={styles.metricValue}>{registrosTotal}</Text>
                        <Text style={styles.metricLabel}>registros</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#F97316','#FB923C']} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.metricCard,{marginLeft:10}]}>
                        <MaterialCommunityIcons name="fire" size={24} color="#fff" style={{marginBottom:10}} />
                        <Text style={styles.metricValue}>{rachaActual}</Text>
                        <Text style={styles.metricLabel}>días racha</Text>
                    </LinearGradient>
                </View>

                {tieneData ? (
                    <>
                        {/* ── Tarjeta de nivel ──────────────────── */}
                        <View style={styles.levelCard}>
                            <View style={styles.levelHeader}>
                                <View style={styles.levelIconCircle}>
                                    <MaterialCommunityIcons name={stats?.nivel?.icono || 'sprout'} size={22} color={BRAND_GREEN} />
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.levelTitle}>{nivelNombre}</Text>
                                    <Text style={styles.levelSub}>
                                        {puntosParaSiguiente > 0
                                            ? `${puntosParaSiguiente} pts para el siguiente nivel`
                                            : '¡Nivel máximo alcanzado!'}
                                    </Text>
                                </View>
                            </View>
                            <ProgressBar value={nivelProgreso} maxValue={1} color={BRAND_GREEN} />
                            <Text style={styles.levelPercent}>{Math.round(nivelProgreso * 100)}% completado</Text>
                        </View>

                        {/* ── Desglose de estadísticas ──────────── */}
                        <Text style={styles.sectionTitle}>Resumen detallado</Text>

                        <View style={styles.detailCard}>
                            <View style={styles.detailRow}>
                                <View style={[styles.detailIcon, { backgroundColor: '#DCFCE7' }]}>
                                    <MaterialCommunityIcons name="trophy-outline" size={20} color={BRAND_GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.detailLabel}>Puntos totales ganados</Text>
                                    <Text style={styles.detailValue}>{stats?.puntos_ganados ?? 0} pts</Text>
                                </View>
                            </View>

                            <View style={styles.detailDivider} />

                            <View style={styles.detailRow}>
                                <View style={[styles.detailIcon, { backgroundColor: '#EFF6FF' }]}>
                                    <MaterialCommunityIcons name="wallet-outline" size={20} color="#3B82F6" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.detailLabel}>Puntos disponibles (saldo)</Text>
                                    <Text style={styles.detailValue}>{stats?.puntos_totales ?? 0} pts</Text>
                                </View>
                            </View>

                            <View style={styles.detailDivider} />

                            <View style={styles.detailRow}>
                                <View style={[styles.detailIcon, { backgroundColor: '#FFF7ED' }]}>
                                    <MaterialCommunityIcons name="calendar-week" size={20} color="#F97316" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.detailLabel}>Puntos esta semana</Text>
                                    <Text style={styles.detailValue}>{stats?.puntos_semana ?? 0} pts</Text>
                                </View>
                            </View>

                            <View style={styles.detailDivider} />

                            <View style={styles.detailRow}>
                                <View style={[styles.detailIcon, { backgroundColor: '#FAF5FF' }]}>
                                    <MaterialCommunityIcons name="calendar-month" size={20} color="#A855F7" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.detailLabel}>Puntos este mes</Text>
                                    <Text style={styles.detailValue}>{stats?.puntos_mes ?? 0} pts</Text>
                                </View>
                            </View>

                            <View style={styles.detailDivider} />

                            <View style={styles.detailRow}>
                                <View style={[styles.detailIcon, { backgroundColor: '#ECFEFF' }]}>
                                    <MaterialCommunityIcons name="chart-line" size={20} color="#06B6D4" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.detailLabel}>Promedio por registro</Text>
                                    <Text style={styles.detailValue}>{promedioRegistro} pts</Text>
                                </View>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconCircle}>
                            <MaterialCommunityIcons name="trending-up" size={32} color="#D1D5DB" />
                        </View>
                        <Text style={styles.emptyTitle}>Sin datos para {periodLabel}</Text>
                        <Text style={styles.emptySub}>Comienza a reciclar para ver tus estadísticas aquí</Text>
                    </View>
                )}
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    header:         { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingVertical:14, borderBottomWidth:1, borderBottomColor:'#F3F4F6', backgroundColor:'#FFFFFF' },
    headerLeft:     { flexDirection:'row', alignItems:'center' },
    headerTitle:    { fontSize:16, fontWeight:'700', color:'#111827' },
    headerSub:      { fontSize:12, color:'#6B7280' },
    userIcon:       { width:38, height:38, borderRadius:19, backgroundColor:'#F0FDF4', alignItems:'center', justifyContent:'center' },

    scroll:         { flex:1, backgroundColor:'#F9FAFB' },
    scrollContent:  { padding:20, paddingBottom:30 },

    pageTitle:      { fontSize:24, fontWeight:'700', color:'#111827', marginBottom:4 },
    pageSubtitle:   { fontSize:14, color:'#6B7280', marginBottom:20 },

    metricsRow:     { flexDirection:'row', marginBottom:20 },
    metricCard:     { flex:1, borderRadius:14, padding:14, alignItems:'flex-start', justifyContent:'flex-end', minHeight:100 },
    metricValue:    { fontSize:22, fontWeight:'700', color:'#FFFFFF', marginBottom:2 },
    metricLabel:    { fontSize:11, color:'rgba(255,255,255,0.85)', fontWeight:'500' },

    // ─── Tarjeta de nivel ────────────────
    levelCard:      { backgroundColor:'#FFFFFF', borderRadius:16, padding:18, marginBottom:20, elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:8 },
    levelHeader:    { flexDirection:'row', alignItems:'center', marginBottom:14 },
    levelIconCircle:{ width:44, height:44, borderRadius:22, backgroundColor:'#F0FDF4', alignItems:'center', justifyContent:'center' },
    levelTitle:     { fontSize:16, fontWeight:'700', color:'#111827' },
    levelSub:       { fontSize:12, color:'#6B7280', marginTop:2 },
    levelPercent:   { fontSize:12, color:'#6B7280', marginTop:8, textAlign:'right' },

    progressBarBg:  { height:8, backgroundColor:'#F3F4F6', borderRadius:4, overflow:'hidden' },
    progressBarFill:{ height:8, borderRadius:4 },

    // ─── Resumen detallado ───────────────
    sectionTitle:   { fontSize:18, fontWeight:'700', color:'#111827', marginBottom:14 },

    detailCard:     { backgroundColor:'#FFFFFF', borderRadius:16, padding:16, marginBottom:20, elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:8 },
    detailRow:      { flexDirection:'row', alignItems:'center', paddingVertical:12 },
    detailIcon:     { width:40, height:40, borderRadius:12, justifyContent:'center', alignItems:'center', marginRight:14 },
    detailLabel:    { fontSize:13, color:'#6B7280', marginBottom:2 },
    detailValue:    { fontSize:16, fontWeight:'700', color:'#111827' },
    detailDivider:  { height:1, backgroundColor:'#F3F4F6' },

    // ─── Empty / Loading ─────────────────
    emptyCard:      { backgroundColor:'#FFFFFF', borderRadius:16, padding:40, alignItems:'center', elevation:2 },
    emptyIconCircle:{ width:64, height:64, borderRadius:32, backgroundColor:'#F3F4F6', alignItems:'center', justifyContent:'center', marginBottom:16 },
    emptyTitle:     { fontSize:16, fontWeight:'700', color:'#111827', marginBottom:8, textAlign:'center' },
    emptySub:       { fontSize:13, color:'#6B7280', textAlign:'center', lineHeight:20 },

    centerBox:      { flex:1, justifyContent:'center', alignItems:'center', padding:24 },
    loadingText:    { marginTop:12, fontSize:14, color:'#6B7280' },
});
