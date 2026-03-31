import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';

// ─── Icon Circle helper ─────────────────────────────────────────────────
const IconCircle = ({ bg, children }) => (
    <View style={[styles.iconCircle, { backgroundColor: bg }]}>{children}</View>
);

// ─── Header ─────────────────────────────────────────────────────────────
const Header = () => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            <View style={styles.logoCircle}>
                <MaterialCommunityIcons name="sprout" size={24} color="#22C55E" />
            </View>
            <View>
                <Text style={styles.headerTitle}>ReciGo</Text>
                <Text style={styles.headerSubtitle}>Aplicación de reciclaje</Text>
            </View>
        </View>
        <View style={styles.userIconCircle}>
            <MaterialIcons name="person-outline" size={22} color="#22C55E" />
        </View>
    </View>
);

// ─── Impact Card ────────────────────────────────────────────────────────
const ImpactCard = () => (
    <View style={styles.impactCard}>
        <View style={styles.impactTop}>
            <View style={{ flex: 1 }}>
                <Text style={styles.impactLabel}>Tu impacto total</Text>
                <Text style={styles.impactNumber}>0</Text>
                <Text style={styles.impactPoints}>puntos acumulados</Text>
            </View>
            <View style={styles.leafBadge}>
                <MaterialCommunityIcons name="leaf" size={28} color="#fff" />
            </View>
        </View>
        <View style={styles.impactStatsRow}>
            <View style={styles.impactStatBox}>
                <Text style={styles.impactStatLabel}>Racha actual</Text>
                <View style={styles.impactStatValueRow}>
                    <Text style={styles.impactStatNumber}>0</Text>
                    <Text style={styles.fireEmoji}> 🔥</Text>
                </View>
            </View>
            <View style={styles.impactStatBox}>
                <Text style={styles.impactStatLabel}>Esta semana</Text>
                <Text style={styles.impactStatNumber}>0</Text>
            </View>
        </View>
    </View>
);

// ─── Quick Action Card ──────────────────────────────────────────────────
const QuickActionCard = ({ iconName, iconFamily, iconColor, bgColor, title, subtitle }) => {
    const IconComponent =
        iconFamily === 'MaterialIcons' ? MaterialIcons :
            iconFamily === 'Ionicons' ? Ionicons :
                MaterialCommunityIcons;

    return (
        <View style={styles.quickActionCard}>
            <IconCircle bg={bgColor}>
                <IconComponent name={iconName} size={24} color={iconColor} />
            </IconCircle>
            <Text style={styles.quickActionTitle}>{title}</Text>
            <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
        </View>
    );
};

// ─── Quick Actions Section ──────────────────────────────────────────────
const QuickActions = () => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        <View style={styles.quickActionsGrid}>
            <QuickActionCard
                iconName="recycle"
                iconFamily="MaterialCommunityIcons"
                iconColor="#22C55E"
                bgColor="#DCFCE7"
                title="Registrar"
                subtitle="Agregar reciclaje"
            />
            <QuickActionCard
                iconName="medal-outline"
                iconFamily="MaterialCommunityIcons"
                iconColor="#F97316"
                bgColor="#FFF7ED"
                title="Logros"
                subtitle="Ver puntos"
            />
            <QuickActionCard
                iconName="trending-up"
                iconFamily="MaterialCommunityIcons"
                iconColor="#3B82F6"
                bgColor="#EFF6FF"
                title="Estadísticas"
                subtitle="Ver dashboard"
            />
            <QuickActionCard
                iconName="book-open-outline"
                iconFamily="MaterialCommunityIcons"
                iconColor="#A855F7"
                bgColor="#FAF5FF"
                title="Aprender"
                subtitle="Contenido educativo"
            />
        </View>
    </View>
);

// ─── Recent Activity ────────────────────────────────────────────────────
const RecentActivity = () => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividad reciente</Text>
        <View style={styles.emptyActivity}>
            <View style={styles.emptyIconCircle}>
                <MaterialCommunityIcons name="recycle" size={30} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyText}>
                Aún no has registrado ningún reciclaje
            </Text>
        </View>
    </View>
);

// ─── Bottom Tab Bar ─────────────────────────────────────────────────────
const tabItems = [
    { icon: 'home', family: 'MaterialCommunityIcons', label: 'Inicio', active: true },
    { icon: 'plus', family: 'MaterialCommunityIcons', label: 'Agregar', active: false },
    { icon: 'trophy-outline', family: 'MaterialCommunityIcons', label: 'Puntos', active: false },
    { icon: 'book-open-variant', family: 'MaterialCommunityIcons', label: 'Educación', active: false },
    { icon: 'chart-bar', family: 'MaterialCommunityIcons', label: 'Dashboard', active: false },
];

const BottomTabBar = () => (
    <View style={styles.bottomBar}>
        {tabItems.map((tab, i) => {
            const IconComp = tab.family === 'MaterialIcons' ? MaterialIcons : MaterialCommunityIcons;
            return (
                <View key={i} style={styles.tabItem}>
                    <IconComp
                        name={tab.icon}
                        size={24}
                        color={tab.active ? '#22C55E' : '#9CA3AF'}
                    />
                    <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>
                        {tab.label}
                    </Text>
                </View>
            );
        })}
    </View>
);

// ─── Main Screen ────────────────────────────────────────────────────────
export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <ImpactCard />
                <QuickActions />
                <RecentActivity />
            </ScrollView>
            <BottomTabBar />
        </SafeAreaView>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────────
const BRAND_GREEN = '#22C55E';

const styles = StyleSheet.create({
    /* ── Layout ───────────────── */
    safe: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },

    /* ── Header ───────────────── */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 1,
    },
    userIconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* ── Impact Card ──────────── */
    impactCard: {
        backgroundColor: BRAND_GREEN,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    impactTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    impactLabel: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        fontWeight: '500',
    },
    impactNumber: {
        color: '#fff',
        fontSize: 44,
        fontWeight: '800',
        lineHeight: 52,
    },
    impactPoints: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        fontWeight: '500',
    },
    leafBadge: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    impactStatsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    impactStatBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    impactStatLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    impactStatValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    impactStatNumber: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
    },
    fireEmoji: {
        fontSize: 16,
    },

    /* ── Sections ─────────────── */
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 14,
    },

    /* ── Quick Actions ────────── */
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickActionCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    quickActionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    quickActionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },

    /* ── Recent Activity ──────── */
    emptyActivity: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    emptyIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
    },

    /* ── Bottom Tab Bar ───────── */
    bottomBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingVertical: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500',
        marginTop: 2,
    },
    tabLabelActive: {
        color: BRAND_GREEN,
        fontWeight: '600',
    },
});
