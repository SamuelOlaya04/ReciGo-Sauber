import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// ─── Brand Colors ───────────────────────────────────────────────────────
const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';

// ─── Main Screen ────────────────────────────────────────────────────────
export default function ForgotPasswordScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.container}>
                    {/* ── Back Button ──────────── */}
                    <TouchableOpacity
                        style={styles.backButton}
                        activeOpacity={0.6}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#374151" />
                    </TouchableOpacity>

                    {/* ── Content ──────────────── */}
                    <View style={styles.content}>
                        {/* Shield Icon */}
                        <View style={styles.shieldContainer}>
                            <View style={styles.shieldCircle}>
                                <MaterialCommunityIcons
                                    name="shield-check-outline"
                                    size={48}
                                    color={BRAND_GREEN}
                                />
                            </View>
                        </View>

                        {/* Heading */}
                        <Text style={styles.heading}>Recuperar contraseña</Text>
                        <Text style={styles.subheading}>
                            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
                        </Text>

                        {/* Email Field */}
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
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Send Button */}
                        <TouchableOpacity activeOpacity={0.8}>
                            <LinearGradient
                                colors={[BRAND_GREEN, BRAND_GREEN_DARK]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.sendButton}
                            >
                                <Text style={styles.sendButtonText}>Enviar instrucciones</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Cancel Link */}
                        <TouchableOpacity
                            style={styles.cancelRow}
                            activeOpacity={0.6}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    container: {
        flex: 1,
        paddingHorizontal: 28,
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
    },

    /* ── Content ──────────────── */
    content: {
        alignItems: 'center',
        paddingTop: 40,
    },

    /* ── Shield Icon ──────────── */
    shieldContainer: {
        marginBottom: 24,
    },
    shieldCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* ── Heading ──────────────── */
    heading: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 10,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 28,
        paddingHorizontal: 10,
        fontWeight: '400',
    },

    /* ── Input Field ──────────── */
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 54,
        width: '100%',
        marginBottom: 20,
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

    /* ── Send Button ──────────── */
    sendButton: {
        borderRadius: 16,
        paddingVertical: 17,
        paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minWidth: 300,
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 8,
    },
    sendButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    /* ── Cancel ───────────────── */
    cancelRow: {
        marginTop: 20,
        paddingVertical: 8,
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#9CA3AF',
    },
});
