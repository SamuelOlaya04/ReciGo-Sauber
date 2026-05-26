import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/AppLogo';

const { width } = Dimensions.get('window');

// ─── Brand Colors ───────────────────────────────────────────────────────
const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';
const BRAND_GREEN_LIGHT = '#4ADE80';


const googleStyles = StyleSheet.create({
    container: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    g: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4285F4',
    },
});

// ─── Hero Header ────────────────────────────────────────────────────────
const HeroHeader = () => (
    <LinearGradient
        colors={['#16A34A', '#22C55E', '#4ADE80']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroContainer}
    >
        {/* Decorative circles */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
        <View style={[styles.decorCircle, styles.decorCircle3]} />

        {/* Logo */}
        <View style={styles.logoWrapper}>
            <AppLogo size={80} animated={false} />
        </View>

        {/* App Name */}
        <Text style={styles.heroTitle}>ReciGo</Text>

        {/* Tagline */}
        <Text style={styles.heroSubtitle}>
            Recicla, aprende y gana recompensas{'\n'}por cuidar nuestro planeta <MaterialCommunityIcons name="leaf" size={16} color="rgba(255,255,255,0.9)" />
        </Text>
    </LinearGradient>
);

// ─── Welcome Section ────────────────────────────────────────────────────
const WelcomeSection = () => (
    <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
        <Text style={styles.welcomeSubtitle}>Elige cómo deseas continuar</Text>
    </View>
);

// ─── Login Buttons ──────────────────────────────────────────────────────
const LoginButtons = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.buttonsContainer}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Login')}
            >
                <LinearGradient
                    colors={[BRAND_GREEN, BRAND_GREEN_DARK]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.emailButton}
                >
                    <MaterialCommunityIcons name="email-outline" size={22} color="#fff" />
                    <Text style={styles.emailButtonText}>Iniciar sesión con correo</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpRow}>
                <Text style={styles.signUpText}>¿Eres nuevo en ReciGo? </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.signUpLink}>Crear cuenta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ─── Bottom Feature Cards ───────────────────────────────────────────────
const FeatureCard = ({ icon, iconColor, bgColor, title, subtitle }) => (
    <View style={styles.featureCard}>
        <View style={[styles.featureIconCircle, { backgroundColor: bgColor }]}>
            <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureSubtitle}>{subtitle}</Text>
    </View>
);

const BottomFeatures = () => (
    <View style={styles.featuresRow}>
        <FeatureCard
            icon="recycle"
            iconColor={BRAND_GREEN}
            bgColor="#DCFCE7"
            title="Registra"
            subtitle="Tu reciclaje diario"
        />
        <FeatureCard
            icon="gift-outline"
            iconColor="#EF4444"
            bgColor="#FEE2E2"
            title="Gana"
            subtitle="Puntos"
        />
        <FeatureCard
            icon="earth"
            iconColor="#3B82F6"
            bgColor="#DBEAFE"
            title="Impacta"
            subtitle="El planeta positivo"
        />
    </View>
);

// ─── Main Screen ────────────────────────────────────────────────────────
export default function WelcomeScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={BRAND_GREEN_DARK} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <HeroHeader />
                <WelcomeSection />
                <LoginButtons />
                <BottomFeatures />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    /* ── Layout ───────────────── */
    safe: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },

    /* ── Hero Header ──────────── */
    heroContainer: {
        width: '100%',
        paddingTop: 40,
        paddingBottom: 36,
        alignItems: 'center',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        overflow: 'hidden',
        position: 'relative',
    },
    decorCircle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    decorCircle1: {
        width: 180,
        height: 180,
        top: -40,
        right: -30,
    },
    decorCircle2: {
        width: 120,
        height: 120,
        bottom: -20,
        left: -20,
    },
    decorCircle3: {
        width: 80,
        height: 80,
        top: 30,
        left: 40,
    },
    logoWrapper: {
        marginBottom: 16,
        position: 'relative',
    },
    logoBox: {
        width: 80,
        height: 80,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    checkBadge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    heroSubtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
        paddingHorizontal: 20,
    },

    /* ── Welcome Section ──────── */
    welcomeSection: {
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 8,
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 6,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '400',
    },

    /* ── Buttons ──────────────── */
    buttonsContainer: {
        paddingHorizontal: 28,
        paddingTop: 24,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingVertical: 16,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    separatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    separatorText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    emailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 16,
        gap: 10,
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    emailButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    signUpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    signUpText: {
        fontSize: 14,
        color: '#6B7280',
    },
    signUpLink: {
        fontSize: 14,
        fontWeight: '700',
        color: BRAND_GREEN,
    },

    /* ── Bottom Features ──────── */
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingTop: 36,
        paddingBottom: 28,
        marginTop: 'auto',
    },
    featureCard: {
        alignItems: 'center',
        flex: 1,
    },
    featureIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: BRAND_GREEN,
        marginBottom: 2,
    },
    featureSubtitle: {
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'center',
        fontWeight: '500',
    },
});
