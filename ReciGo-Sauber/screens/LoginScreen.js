import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../services/authService';

// ─── Brand Colors ───────────────────────────────────────────────────────
const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';

// ─── Google "G" Icon ────────────────────────────────────────────────────
const GoogleIcon = () => (
    <View style={googleStyles.container}>
        <Text style={googleStyles.g}>G</Text>
    </View>
);

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

// ─── Main Screen ────────────────────────────────────────────────────────
export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
        setErrorMsg('');
        if (!email.trim() || !password.trim()) {
            setErrorMsg('Por favor ingresa tu correo y contraseña.');
            return;
        }
        setLoading(true);
        try {
            const data = await loginUser(email.trim(), password);
            // Login exitoso → guardar datos y navegar
            navigation.navigate('Home', { usuario: data.usuario });
        } catch (error) {
            setErrorMsg(error.message || 'Correo o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Back Button ──────────── */}
                    <TouchableOpacity
                        style={styles.backButton}
                        activeOpacity={0.6}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#374151" />
                    </TouchableOpacity>

                    {/* ── Logo Row ─────────────── */}
                    <View style={styles.logoRow}>
                        <View style={styles.logoCircle}>
                            <MaterialCommunityIcons name="recycle" size={20} color={BRAND_GREEN} />
                        </View>
                        <Text style={styles.logoText}>ReciGo</Text>
                    </View>

                    {/* ── Heading ──────────────── */}
                    <Text style={styles.heading}>Bienvenido de vuelta 👋</Text>
                    <Text style={styles.subheading}>Ingresa tus datos para continuar</Text>

                    {/* ── Email Field ──────────── */}
                    <Text style={styles.label}>Correo electrónico</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="email-outline"
                            size={20}
                            color="#9CA3AF"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="tu@correo.com"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={(t) => { setEmail(t); setErrorMsg(''); }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    {/* ── Password Field ───────── */}
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="lock-outline"
                            size={20}
                            color="#9CA3AF"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#9CA3AF"
                            value={password}
                            onChangeText={(t) => { setPassword(t); setErrorMsg(''); }}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeButton}
                            activeOpacity={0.6}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#9CA3AF"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* ── Error Message ─────────── */}
                    {!!errorMsg && (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
                            <Text style={styles.errorText}>{errorMsg}</Text>
                        </View>
                    )}

                    {/* ── Forgot Password ──────── */}
                    <TouchableOpacity
                        style={styles.forgotRow}
                        activeOpacity={0.6}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    {/* ── Login Button ─────────── */}
                    <TouchableOpacity
                        activeOpacity={loading ? 1 : 0.8}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={loading ? ['#9CA3AF', '#6B7280'] : [BRAND_GREEN, BRAND_GREEN_DARK]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.loginButton}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* ── Separator ────────────── */}
                    <View style={styles.separatorRow}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>o continúa con</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    {/* ── Google Button ────────── */}
                    <TouchableOpacity
                        style={styles.googleButton}
                        activeOpacity={0.7}
                        onPress={() => Alert.alert('Próximamente', 'El inicio de sesión con Google estará disponible pronto.')}
                    >
                        <GoogleIcon />
                        <Text style={styles.googleButtonText}>Continuar con Google</Text>
                    </TouchableOpacity>

                    {/* ── Register Link ────────── */}
                    <View style={styles.registerRow}>
                        <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={styles.registerLink}>Regístrate</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingHorizontal: 28,
        paddingBottom: 40,
    },

    /* ── Back Button ──────────── */
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 20,
    },

    /* ── Logo ─────────────────── */
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    logoCircle: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: '700',
        color: BRAND_GREEN,
    },

    /* ── Heading ──────────────── */
    heading: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 6,
    },
    subheading: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 28,
        fontWeight: '400',
    },

    /* ── Labels ───────────────── */
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },

    /* ── Input Fields ─────────── */
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        paddingHorizontal: 14,
        marginBottom: 20,
        height: 54,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
        height: '100%',
    },
    eyeButton: {
        padding: 6,
    },

    /* ── Forgot Password ──────── */
    forgotRow: {
        alignItems: 'flex-end',
        marginBottom: 12,
        marginTop: -8,
    },
    forgotText: {
        fontSize: 13,
        fontWeight: '600',
        color: BRAND_GREEN,
    },

    /* ── Error Message ────────── */
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 20,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: '#DC2626',
        fontWeight: '500',
        lineHeight: 18,
    },

    /* ── Login Button ─────────── */
    loginButton: {
        borderRadius: 16,
        paddingVertical: 17,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 8,
    },
    loginButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    /* ── Separator ────────────── */
    separatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    separatorText: {
        marginHorizontal: 14,
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    /* ── Google Button ────────── */
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

    /* ── Register Link ────────── */
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
    },
    registerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    registerLink: {
        fontSize: 14,
        fontWeight: '700',
        color: BRAND_GREEN,
    },
});
