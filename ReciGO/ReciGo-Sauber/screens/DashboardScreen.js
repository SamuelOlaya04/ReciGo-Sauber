import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import MainLayout from '../components/MainLayout';
import AppLogo from '../components/AppLogo';

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

export default function DashboardScreen({ navigation }) {
    const [period, setPeriod] = useState('Mes');
    const periodLabel = period === 'Semana' ? 'Esta semana' : period === 'Mes' ? 'Este mes' : 'Todo el tiempo';
    return (
        <MainLayout navigation={navigation} activeScreen="Dashboard">
            <Header />
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.pageTitle}>Dashboard</Text>
                <Text style={styles.pageSubtitle}>Visualiza tus estadísticas de reciclaje</Text>
                <AnimatedFilter period={period} onSelect={setPeriod} />
                <View style={styles.metricsRow}>
                    <LinearGradient colors={[BRAND_GREEN_DARK,BRAND_GREEN]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.metricCard}>
                        <MaterialCommunityIcons name="package-variant" size={24} color="#fff" style={{marginBottom:10}} />
                        <Text style={styles.metricValue}>0.0</Text>
                        <Text style={styles.metricLabel}>kg reciclados</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#2563EB','#60A5FA']} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.metricCard,{marginLeft:10}]}>
                        <MaterialCommunityIcons name="trending-up" size={24} color="#fff" style={{marginBottom:10}} />
                        <Text style={styles.metricValue}>0</Text>
                        <Text style={styles.metricLabel}>puntos</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#7C3AED','#C084FC']} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.metricCard,{marginLeft:10}]}>
                        <MaterialCommunityIcons name="calendar-month" size={24} color="#fff" style={{marginBottom:10}} />
                        <Text style={styles.metricValue}>0</Text>
                        <Text style={styles.metricLabel}>registros</Text>
                    </LinearGradient>
                </View>
                <View style={styles.emptyCard}>
                    <View style={styles.emptyIconCircle}>
                        <MaterialCommunityIcons name="trending-up" size={32} color="#D1D5DB" />
                    </View>
                    <Text style={styles.emptyTitle}>Sin datos para {periodLabel}</Text>
                    <Text style={styles.emptySub}>Comienza a reciclar para ver tus estadísticas aquí</Text>
                </View>
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingVertical:14, borderBottomWidth:1, borderBottomColor:'#F3F4F6', backgroundColor:'#FFFFFF' },
    headerLeft: { flexDirection:'row', alignItems:'center' },
    logo: { width:40, height:40, borderRadius:10, backgroundColor:BRAND_GREEN, alignItems:'center', justifyContent:'center' },
    headerTitle: { fontSize:16, fontWeight:'700', color:'#111827' },
    headerSub: { fontSize:12, color:'#6B7280' },
    userIcon: { width:38, height:38, borderRadius:19, backgroundColor:'#F0FDF4', alignItems:'center', justifyContent:'center' },
    scroll: { flex:1, backgroundColor:'#F9FAFB' },
    scrollContent: { padding:20, paddingBottom:30 },
    pageTitle: { fontSize:24, fontWeight:'700', color:'#111827', marginBottom:4 },
    pageSubtitle: { fontSize:14, color:'#6B7280', marginBottom:20 },
    filterRow: { flexDirection:'row', backgroundColor:'#FFFFFF', borderRadius:12, borderWidth:1, borderColor:'#E5E7EB', marginBottom:20 },
    filterBtn: { flex:1, paddingVertical:12, alignItems:'center', justifyContent:'center' },
    filterBtnActive: { backgroundColor:BRAND_GREEN, borderRadius:10, margin:3 },
    filterText: { fontSize:14, fontWeight:'600', color:'#6B7280' },
    filterTextActive: { color:'#FFFFFF' },
    metricsRow: { flexDirection:'row', marginBottom:20 },
    metricCard: { flex:1, borderRadius:14, padding:14, alignItems:'flex-start', justifyContent:'flex-end', minHeight:100 },
    metricValue: { fontSize:22, fontWeight:'700', color:'#FFFFFF', marginBottom:2 },
    metricLabel: { fontSize:11, color:'rgba(255,255,255,0.85)', fontWeight:'500' },
    emptyCard: { backgroundColor:'#FFFFFF', borderRadius:16, padding:40, alignItems:'center', elevation:2 },
    emptyIconCircle: { width:64, height:64, borderRadius:32, backgroundColor:'#F3F4F6', alignItems:'center', justifyContent:'center', marginBottom:16 },
    emptyTitle: { fontSize:16, fontWeight:'700', color:'#111827', marginBottom:8, textAlign:'center' },
    emptySub: { fontSize:13, color:'#6B7280', textAlign:'center', lineHeight:20 },
});
