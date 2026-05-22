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
import { registerUser } from '../services/authService';

// ─── Brand Colors ───────────────────────────────────────────────────────
const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';

// ─── Main Screen ────────────────────────────────────────────────────────
export default function RegisterScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successVisible, setSuccessVisible] = useState(false);

    const isFormValid =
        name.trim() !== '' &&
        email.trim() !== '' &&
        password.length >= 6 &&
        confirmPassword === password &&
        acceptedTerms;

    const handleRegister = async () => {
        setErrorMsg('');
        if (!isFormValid) {
            if (!name.trim() || !email.trim()) {
                setErrorMsg('Por favor completa todos los campos.');
            } else if (password.length < 6) {
                setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
            } else if (confirmPassword !== password) {
                setErrorMsg('Las contraseñas no coinciden.');
            } else if (!acceptedTerms) {
                setErrorMsg('Debes aceptar los términos y condiciones.');
            }
            return;
        }
        setLoading(true);
        try {
            await registerUser(name.trim(), email.trim(), password);
            setSuccessVisible(true);
            setTimeout(() => {
                navigation.navigate('Login');
            }, 2500);
        } catch (error) {
            setErrorMsg(error.message || 'Ocurrió un error al crear la cuenta.');
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

                    {/* ── Heading ──────────────── */}
                    <Text style={styles.heading}>Crea tu cuenta 🌱</Text>
                    <Text style={styles.subheading}>Únete y comienza a hacer la diferencia</Text>

                    {/* ── Success Banner ──────── */}
                    {successVisible && (
                        <View style={styles.successBox}>
                            <Ionicons name="checkmark-circle-outline" size={24} color="#16A34A" style={{ marginRight: 12 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.successTitle}>¡Cuenta creada exitosamente! 🌱</Text>
                                <Text style={styles.successSubtitle}>Redirigiendo al inicio de sesión...</Text>
                            </View>
                        </View>
                    )}

                    {/* ── Name Field ───────────── */}
                    <Text style={styles.label}>Nombre completo</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="account-outline"
                            size={20}
                            color="#9CA3AF"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Ana García"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={(t) => { setName(t); setErrorMsg(''); }}
                            autoCapitalize="words"
                        />
                    </View>

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
                            placeholder="Mínimo 6 caracteres"
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

                    {/* ── Confirm Password Field ─ */}
                    <Text style={styles.label}>Confirmar contraseña</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="lock-outline"
                            size={20}
                            color="#9CA3AF"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Repite tu contraseña"
                            placeholderTextColor="#9CA3AF"
                            value={confirmPassword}
                            onChangeText={(t) => { setConfirmPassword(t); setErrorMsg(''); }}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* ── Error Message ─────────── */}
                    {!!errorMsg && (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
                            <Text style={styles.errorText}>{errorMsg}</Text>
                        </View>
                    )}

                    {/* ── Terms Checkbox ───────── */}
                    <TouchableOpacity
                        style={styles.termsRow}
                        activeOpacity={0.7}
                        onPress={() => setAcceptedTerms(!acceptedTerms)}
                    >
                        <View style={[
                            styles.checkbox,
                            acceptedTerms && styles.checkboxChecked,
                        ]}>
                            {acceptedTerms && (
                                <Ionicons name="checkmark" size={14} color="#fff" />
                            )}
                        </View>
                        <Text style={styles.termsText}>
                            Acepto los{' '}
                            <Text style={styles.termsLink}>Términos y condiciones</Text>
                            {' '}y la{' '}
                            <Text style={styles.termsLink}>Política de privacidad</Text>
                            {' '}de ReciGo
                        </Text>
                    </TouchableOpacity>

                    {/* ── Register Button ──────── */}
                    <TouchableOpacity
                        activeOpacity={isFormValid && !loading ? 0.8 : 1}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={isFormValid && !loading
                                ? [BRAND_GREEN, BRAND_GREEN_DARK]
                                : ['#D1D5DB', '#9CA3AF']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.registerButton}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.registerButtonText}>Crear cuenta</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* ── Login Link ───────────── */}
                    <View style={styles.loginRow}>
                        <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginLink}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
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

    /* ── Success Banner ───────── */
    successBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        borderWidth: 1.5,
        borderColor: '#86EFAC',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#15803D',
        marginBottom: 2,
    },
    successSubtitle: {
        fontSize: 12,
        color: '#16A34A',
        fontWeight: '400',
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
        marginBottom: 16,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: '#DC2626',
        fontWeight: '500',
        lineHeight: 18,
    },

    /* ── Terms ────────────────── */
    termsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
        gap: 12,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
    },
    checkboxChecked: {
        backgroundColor: BRAND_GREEN,
        borderColor: BRAND_GREEN,
    },
    termsText: {
        flex: 1,
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
    termsLink: {
        color: BRAND_GREEN,
        fontWeight: '700',
    },

    /* ── Register Button ──────── */
    registerButton: {
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
    registerButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    /* ── Login Link ───────────── */
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    loginText: {
        fontSize: 14,
        color: '#6B7280',
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '700',
        color: BRAND_GREEN,
        textDecorationLine: 'underline',
    },
});
