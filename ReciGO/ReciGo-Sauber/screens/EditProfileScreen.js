import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Animated,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
    Alert,
    Modal,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile } from '../services/authService';

// ─── Brand Colors ───────────────────────────────────────────────────────
const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';

// ─── Header ─────────────────────────────────────────────────────────────
const Header = ({ navigation }) => (
    <View style={styles.header}>
        <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation?.goBack()}
        >
            <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <View style={{ width: 38 }} />
    </View>
);

// ─── Campo de texto reutilizable ────────────────────────────────────────
const InputField = ({
    icon,
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    secureTextEntry = false,
    showToggle = false,
    showPassword,
    onTogglePassword,
    autoCapitalize = 'none',
    delay = 0,
}) => {
    const translateY = useRef(new Animated.Value(20)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, friction: 7, tension: 60, delay, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[{ opacity, transform: [{ translateY }] }]}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                    name={icon}
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry && !showPassword}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                />
                {showToggle && (
                    <TouchableOpacity
                        onPress={onTogglePassword}
                        style={styles.eyeButton}
                        activeOpacity={0.6}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
};

// ─── Modal de éxito ─────────────────────────────────────────────────────
const SuccessModal = ({ visible, onClose }) => {
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            scaleAnim.setValue(0.5);
            opacityAnim.setValue(0);
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 60,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim,
                        },
                    ]}
                >
                    <View style={styles.modalIconCircle}>
                        <MaterialCommunityIcons name="check-bold" size={40} color="#FFFFFF" />
                    </View>
                    <Text style={styles.modalTitle}>¡Perfil actualizado!</Text>
                    <Text style={styles.modalMessage}>
                        Tus datos han sido guardados correctamente.
                    </Text>
                    <TouchableOpacity
                        style={styles.modalButton}
                        activeOpacity={0.8}
                        onPress={onClose}
                    >
                        <LinearGradient
                            colors={[BRAND_GREEN, BRAND_GREEN_DARK]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.modalButtonGradient}
                        >
                            <Text style={styles.modalButtonText}>Aceptar</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

// ─── Pantalla principal ─────────────────────────────────────────────────
export default function EditProfileScreen({ navigation, route }) {
    const usuario = route?.params?.usuario;

    const [nombre, setNombre] = useState(usuario?.nombre_completo || '');
    const [correo, setCorreo] = useState(usuario?.correo || '');
    const [contrasenaActual, setContrasenaActual] = useState('');
    const [contrasenaNueva, setContrasenaNueva] = useState('');
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [cambiarContrasena, setCambiarContrasena] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Animaciones
    const passwordSectionHeight = useRef(new Animated.Value(0)).current;
    const passwordSectionOpacity = useRef(new Animated.Value(0)).current;

    const toggleCambiarContrasena = () => {
        const newValue = !cambiarContrasena;
        setCambiarContrasena(newValue);
        setErrorMsg('');

        if (newValue) {
            Animated.parallel([
                Animated.timing(passwordSectionHeight, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(passwordSectionOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(passwordSectionHeight, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: false,
                }),
                Animated.timing(passwordSectionOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start();
            setContrasenaActual('');
            setContrasenaNueva('');
        }
    };

    // Validaciones frontend
    const validar = () => {
        if (!nombre.trim()) {
            setErrorMsg('El nombre es obligatorio.');
            return false;
        }
        if (!correo.trim()) {
            setErrorMsg('El correo es obligatorio.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.trim())) {
            setErrorMsg('El formato del correo no es válido.');
            return false;
        }
        if (cambiarContrasena) {
            if (!contrasenaActual.trim()) {
                setErrorMsg('Ingresa tu contraseña actual.');
                return false;
            }
            if (!contrasenaNueva.trim()) {
                setErrorMsg('Ingresa la nueva contraseña.');
                return false;
            }
            if (contrasenaNueva.trim().length < 6) {
                setErrorMsg('La nueva contraseña debe tener al menos 6 caracteres.');
                return false;
            }
        }
        return true;
    };

    const handleGuardar = async () => {
        setErrorMsg('');
        if (!validar()) return;

        setLoading(true);
        try {
            const datos = {
                nombre_completo: nombre.trim(),
                correo: correo.trim(),
            };

            if (cambiarContrasena) {
                datos.contrasena_actual = contrasenaActual;
                datos.contrasena_nueva = contrasenaNueva;
            }

            const data = await updateProfile(usuario.id_usuario, datos);

            // Actualizar AsyncStorage con los datos nuevos
            const storedRaw = await AsyncStorage.getItem('usuario');
            const storedUser = storedRaw ? JSON.parse(storedRaw) : {};
            const updatedUser = {
                ...storedUser,
                nombre_completo: data.usuario.nombre_completo,
                correo: data.usuario.correo,
            };
            await AsyncStorage.setItem('usuario', JSON.stringify(updatedUser));

            // Mostrar confirmación
            setShowSuccess(true);

        } catch (error) {
            setErrorMsg(error.message || 'Error al actualizar perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigation?.goBack();
    };

    // Verificar si hay cambios
    const hayCambios =
        nombre.trim() !== (usuario?.nombre_completo || '') ||
        correo.trim() !== (usuario?.correo || '') ||
        (cambiarContrasena && contrasenaActual.trim() && contrasenaNueva.trim());

    const maxPasswordHeight = passwordSectionHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 220],
    });

    return (
        <View style={styles.safe}>
            <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 50, backgroundColor: '#FFFFFF' }} />
            <Header navigation={navigation} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Avatar ──────────────────── */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarOuter}>
                            <View style={styles.avatarInner}>
                                <MaterialCommunityIcons name="account-edit" size={40} color={BRAND_GREEN} />
                            </View>
                        </View>
                        <Text style={styles.avatarLabel}>Modificar información</Text>
                    </View>

                    {/* ── Formulario ──────────────── */}
                    <View style={styles.formCard}>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons name="account-outline" size={20} color={BRAND_GREEN} />
                            <Text style={styles.sectionTitle}>Datos personales</Text>
                        </View>

                        <InputField
                            icon="account-outline"
                            label="Nombre completo"
                            value={nombre}
                            onChangeText={(t) => { setNombre(t); setErrorMsg(''); }}
                            placeholder="Tu nombre completo"
                            autoCapitalize="words"
                            delay={0}
                        />

                        <InputField
                            icon="email-outline"
                            label="Correo electrónico"
                            value={correo}
                            onChangeText={(t) => { setCorreo(t); setErrorMsg(''); }}
                            placeholder="tu@correo.com"
                            keyboardType="email-address"
                            delay={80}
                        />
                    </View>

                    {/* ── Sección contraseña ─────── */}
                    <View style={styles.formCard}>
                        <TouchableOpacity
                            style={styles.passwordToggle}
                            activeOpacity={0.7}
                            onPress={toggleCambiarContrasena}
                        >
                            <View style={styles.passwordToggleLeft}>
                                <View style={[styles.toggleIconCircle, cambiarContrasena && styles.toggleIconCircleActive]}>
                                    <MaterialCommunityIcons
                                        name={cambiarContrasena ? 'lock-open-outline' : 'lock-outline'}
                                        size={20}
                                        color={cambiarContrasena ? '#FFFFFF' : '#6B7280'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.passwordToggleText}>Cambiar contraseña</Text>
                                    <Text style={styles.passwordToggleHint}>
                                        {cambiarContrasena ? 'Ingresa tu contraseña actual y la nueva' : 'Toca para cambiar tu contraseña'}
                                    </Text>
                                </View>
                            </View>
                            <MaterialCommunityIcons
                                name={cambiarContrasena ? 'chevron-up' : 'chevron-down'}
                                size={24}
                                color="#9CA3AF"
                            />
                        </TouchableOpacity>

                        <Animated.View
                            style={{
                                maxHeight: maxPasswordHeight,
                                opacity: passwordSectionOpacity,
                                overflow: 'hidden',
                            }}
                        >
                            <View style={styles.passwordFields}>
                                <Text style={styles.label}>Contraseña actual</Text>
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
                                        value={contrasenaActual}
                                        onChangeText={(t) => { setContrasenaActual(t); setErrorMsg(''); }}
                                        secureTextEntry={!showCurrentPwd}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowCurrentPwd(!showCurrentPwd)}
                                        style={styles.eyeButton}
                                        activeOpacity={0.6}
                                    >
                                        <Ionicons
                                            name={showCurrentPwd ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color="#9CA3AF"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.label}>Nueva contraseña</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons
                                        name="lock-plus-outline"
                                        size={20}
                                        color="#9CA3AF"
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Mínimo 6 caracteres"
                                        placeholderTextColor="#9CA3AF"
                                        value={contrasenaNueva}
                                        onChangeText={(t) => { setContrasenaNueva(t); setErrorMsg(''); }}
                                        secureTextEntry={!showNewPwd}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowNewPwd(!showNewPwd)}
                                        style={styles.eyeButton}
                                        activeOpacity={0.6}
                                    >
                                        <Ionicons
                                            name={showNewPwd ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color="#9CA3AF"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    </View>

                    {/* ── Error ───────────────────── */}
                    {!!errorMsg && (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
                            <Text style={styles.errorText}>{errorMsg}</Text>
                        </View>
                    )}

                    {/* ── Botón Guardar ───────────── */}
                    <TouchableOpacity
                        activeOpacity={loading || !hayCambios ? 1 : 0.8}
                        onPress={handleGuardar}
                        disabled={loading || !hayCambios}
                    >
                        <LinearGradient
                            colors={
                                loading || !hayCambios
                                    ? ['#D1D5DB', '#9CA3AF']
                                    : [BRAND_GREEN, BRAND_GREEN_DARK]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveButton}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <View style={styles.saveButtonContent}>
                                    <MaterialCommunityIcons name="content-save-outline" size={20} color="#FFFFFF" />
                                    <Text style={styles.saveButtonText}>Guardar cambios</Text>
                                </View>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* ── Botón Cancelar ──────────── */}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        activeOpacity={0.7}
                        onPress={() => navigation?.goBack()}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <View style={{ height: 30 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── Modal de éxito ──────────── */}
            <SuccessModal visible={showSuccess} onClose={handleSuccessClose} />
        </View>
    );
}

// ─── Estilos ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // ─── Header ─────────────────────────
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },

    // ─── Scroll ─────────────────────────
    scroll: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 24,
    },

    // ─── Avatar ─────────────────────────
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarOuter: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: 12,
    },
    avatarInner: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#6B7280',
    },

    // ─── Formulario Card ────────────────
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 20,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F0FDF4',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },

    // ─── Labels e inputs ────────────────
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        paddingHorizontal: 14,
        marginBottom: 18,
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

    // ─── Sección cambio de contraseña ───
    passwordToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    passwordToggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    toggleIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleIconCircleActive: {
        backgroundColor: BRAND_GREEN,
    },
    passwordToggleText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    passwordToggleHint: {
        fontSize: 12,
        fontWeight: '400',
        color: '#9CA3AF',
        marginTop: 2,
    },
    passwordFields: {
        marginTop: 18,
        paddingTop: 18,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },

    // ─── Error ──────────────────────────
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

    // ─── Botón Guardar ──────────────────
    saveButton: {
        borderRadius: 16,
        paddingVertical: 17,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 8,
        marginBottom: 12,
    },
    saveButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    saveButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    // ─── Botón Cancelar ─────────────────
    cancelButton: {
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },

    // ─── Modal de éxito ─────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 20,
    },
    modalIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: BRAND_GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    modalMessage: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    modalButton: {
        width: '100%',
    },
    modalButtonGradient: {
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
