import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import MainLayout from '../components/MainLayout';
import AppLogo from '../components/AppLogo';

const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';
const BRAND_GREEN_LIGHT = '#4ADE80';

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
    return (
        <MainLayout navigation={navigation} activeScreen="Gamification">
            <Header />
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.pageTitle}>Gamificación</Text>
                <Text style={styles.pageSubtitle}>Tus logros y recompensas</Text>
                <LinearGradient colors={[BRAND_GREEN_DARK, BRAND_GREEN, BRAND_GREEN_LIGHT]} start={{ x:0,y:0 }} end={{ x:1,y:1 }} style={styles.levelCard}>
                    <View style={styles.levelCardTop}>
                        <View>
                            <Text style={styles.levelCardLabel}>Puntos totales</Text>
                            <Text style={styles.levelCardPoints}>0</Text>
                        </View>
                        <View style={styles.trophyCircle}>
                            <MaterialCommunityIcons name="trophy-outline" size={30} color="#fff" />
                        </View>
                    </View>
                    <View style={styles.levelRow}>
                        <MaterialCommunityIcons name="sprout" size={22} color="#fff" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.levelName}>Principiante</Text>
                            <Text style={styles.levelNext}>100 pts para el siguiente nivel</Text>
                        </View>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { flex: 0.01 }]} />
                        <View style={{ flex: 0.99 }} />
                    </View>
                </LinearGradient>
                <View style={styles.streakCard}>
                    <View style={styles.streakIcon}>
                        <MaterialCommunityIcons name="fire" size={26} color="#9CA3AF" />
                    </View>
                    <View style={{ marginLeft: 14 }}>
                        <Text style={styles.streakDays}>0 días</Text>
                        <Text style={styles.streakSub}>Registra hoy para iniciar tu racha</Text>
                    </View>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statCard}><View style={[styles.statIconCircle,{backgroundColor:'#EFF6FF'}]}><MaterialCommunityIcons name="lightning-bolt" size={20} color="#3B82F6" /></View><Text style={styles.statValue}>0</Text><Text style={styles.statLabel}>Puntos esta semana</Text></View>
                    <View style={styles.statCard}><View style={[styles.statIconCircle,{backgroundColor:'#F0FDF4'}]}><MaterialCommunityIcons name="trending-up" size={20} color={BRAND_GREEN} /></View><Text style={styles.statValue}>0</Text><Text style={styles.statLabel}>Puntos este mes</Text></View>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statCard}><View style={[styles.statIconCircle,{backgroundColor:'#F5F3FF'}]}><MaterialCommunityIcons name="medal-outline" size={20} color="#8B5CF6" /></View><Text style={styles.statValue}>0</Text><Text style={styles.statLabel}>Registros totales</Text></View>
                    <View style={styles.statCard}><View style={[styles.statIconCircle,{backgroundColor:'#FFF7ED'}]}><MaterialCommunityIcons name="star-outline" size={20} color="#F97316" /></View><Text style={styles.statValue}>0</Text><Text style={styles.statLabel}>Promedio por registro</Text></View>
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
    levelCard: { borderRadius:16, padding:20, marginBottom:16 },
    levelCardTop: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 },
    levelCardLabel: { fontSize:13, color:'rgba(255,255,255,0.85)', marginBottom:4 },
    levelCardPoints: { fontSize:36, fontWeight:'700', color:'#FFFFFF' },
    trophyCircle: { width:52, height:52, borderRadius:26, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
    levelRow: { flexDirection:'row', alignItems:'center', marginBottom:12 },
    levelName: { fontSize:15, fontWeight:'700', color:'#FFFFFF' },
    levelNext: { fontSize:12, color:'rgba(255,255,255,0.8)' },
    progressBar: { height:6, backgroundColor:'rgba(255,255,255,0.3)', borderRadius:3, flexDirection:'row' },
    progressFill: { height:6, backgroundColor:'#FFFFFF', borderRadius:3 },
    streakCard: { flexDirection:'row', alignItems:'center', backgroundColor:'#FFFFFF', borderRadius:14, padding:18, marginBottom:16, elevation:2 },
    streakIcon: { width:48, height:48, borderRadius:24, backgroundColor:'#F3F4F6', alignItems:'center', justifyContent:'center' },
    streakDays: { fontSize:18, fontWeight:'700', color:'#111827' },
    streakSub: { fontSize:13, color:'#6B7280', marginTop:2 },
    statsRow: { flexDirection:'row', marginBottom:12 },
    statCard: { flex:1, backgroundColor:'#FFFFFF', borderRadius:14, padding:16, marginRight:12, elevation:2 },
    statIconCircle: { width:38, height:38, borderRadius:10, alignItems:'center', justifyContent:'center', marginBottom:10 },
    statValue: { fontSize:22, fontWeight:'700', color:'#111827', marginBottom:4 },
    statLabel: { fontSize:12, color:'#6B7280' },
});
