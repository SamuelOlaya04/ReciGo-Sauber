import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Platform,
    StatusBar,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import AppLogo from '../components/AppLogo';
import { API_URL } from '../config';

const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';



// ─── Header ───────────────────────────────────────────────────────────────────
const Header = ({ navigation }) => (
    <View style={styles.header}>
        <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation?.goBack()}
        >
            <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 38 }} />
    </View>
);

// ─── Avatar animado ───────────────────────────────────────────────────────────
const AnimatedAvatar = () => {
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 50,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.avatarContainer,
                {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={styles.avatarOuter}>
                <View style={styles.avatarInner}>
                    <MaterialIcons name="person" size={48} color={BRAND_GREEN} />
                </View>
            </View>
        </Animated.View>
    );
};

// ─── Tarjeta de información animada ───────────────────────────────────────────
const InfoCard = ({ icon, iconColor, bgColor, label, value, delay = 0 }) => {
    const translateY = useRef(new Animated.Value(20)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, friction: 7, tension: 60, delay, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.infoRow, { opacity, transform: [{ translateY }] }]}>
            <View style={[styles.infoIconCircle, { backgroundColor: bgColor }]}>
                <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
            </View>
            <View style={styles.infoTextWrap}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </Animated.View>
    );
};

// ─── Pantalla ─────────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation, route }) {
    const [usuario, setUsuario] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const logoutScale = useRef(new Animated.Value(1)).current;

    // Cargar datos del usuario desde AsyncStorage y estadísticas
    useFocusEffect(
        useCallback(() => {
            const cargarDatos = async () => {
                try {
                    setLoading(true);
                    // Leer usuario guardado en AsyncStorage
                    const stored = await AsyncStorage.getItem('usuario');
                    const user = stored ? JSON.parse(stored) : null;
                    setUsuario(user);

                    // Cargar estadísticas con el ID real del usuario
                    if (user?.id_usuario) {
                        const { data } = await axios.get(
                            `${API_URL}/api/reciclaje/estadisticas/${user.id_usuario}`
                        );
                        setStats(data);
                    }
                } catch (err) {
                    console.log('Error cargando perfil:', err.message);
                } finally {
                    setLoading(false);
                }
            };
            cargarDatos();
        }, [])
    );

    const nombreUsuario = usuario?.nombre_completo || 'EcoUsuario';
    const correoUsuario = usuario?.correo || 'usuario@recigo.com';

    // Formatear fecha de registro
    const getFechaRegistro = () => {
        if (usuario?.fecha_registro) {
            const fecha = new Date(usuario.fecha_registro);
            const meses = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
        }
        return 'Miembro activo';
    };

    // Manejar cierre de sesión
    const handleLogout = () => {
        const doLogout = async () => {
            // Limpiar datos del usuario de AsyncStorage
            await AsyncStorage.removeItem('usuario');
            navigation?.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        };

        if (Platform.OS === 'web') {
            if (window.confirm('¿Cerrar sesión?\n\n¿Estás seguro de que quieres cerrar tu sesión?')) {
                doLogout();
            }
        } else {
            Alert.alert(
                '¿Cerrar sesión?',
                '¿Estás seguro de que quieres cerrar tu sesión?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Cerrar sesión', style: 'destructive', onPress: doLogout },
                ]
            );
        }
    };

    const handleLogoutPressIn = () =>
        Animated.spring(logoutScale, { toValue: 0.95, useNativeDriver: true, friction: 5 }).start();
    const handleLogoutPressOut = () =>
        Animated.spring(logoutScale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();

    const puntosTotal = stats?.puntos_totales ?? 0;
    const nivelNombre = stats?.nivel?.nombre ?? 'Principiante';

    return (
        <MainLayout navigation={navigation} activeScreen="Profile">
            <Header navigation={navigation} />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Sección del avatar ─────────────── */}
                <View style={styles.profileSection}>
                    <AnimatedAvatar />
                    <Text style={styles.userName}>{nombreUsuario}</Text>
                    <View style={styles.badgeRow}>
                        <View style={styles.badge}>
                            <MaterialCommunityIcons name="leaf" size={14} color={BRAND_GREEN} />
                            <Text style={styles.badgeText}>{getFechaRegistro()}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Tarjeta de información de cuenta ── */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="information-outline" size={20} color={BRAND_GREEN} />
                        <Text style={styles.sectionTitle}>Información de cuenta</Text>
                    </View>

                    <InfoCard
                        icon="account-outline"
                        iconColor={BRAND_GREEN}
                        bgColor="#DCFCE7"
                        label="Nombre"
                        value={nombreUsuario}
                        delay={0}
                    />
                    <InfoCard
                        icon="email-outline"
                        iconColor="#3B82F6"
                        bgColor="#EFF6FF"
                        label="Correo electrónico"
                        value={correoUsuario}
                        delay={80}
                    />
                    <InfoCard
                        icon="star-outline"
                        iconColor="#F97316"
                        bgColor="#FFF7ED"
                        label="Puntos totales"
                        value={`${puntosTotal} pts`}
                        delay={160}
                    />
                    <InfoCard
                        icon="shield-check-outline"
                        iconColor="#A855F7"
                        bgColor="#FAF5FF"
                        label="Nivel"
                        value={nivelNombre}
                        delay={240}
                    />
                    <InfoCard
                        icon="calendar-outline"
                        iconColor="#06B6D4"
                        bgColor="#ECFEFF"
                        label="Miembro desde"
                        value={getFechaRegistro()}
                        delay={320}
                    />
                </View>

                {/* ── Botón de cerrar sesión ──────────── */}
                <Animated.View style={{ transform: [{ scale: logoutScale }] }}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        activeOpacity={1}
                        onPress={handleLogout}
                        onPressIn={handleLogoutPressIn}
                        onPressOut={handleLogoutPressOut}
                    >
                        <MaterialCommunityIcons name="logout" size={20} color="#FFFFFF" />
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
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

    // ─── Perfil / Avatar ────────────────
    profileSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatarOuter: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    avatarInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    badgeRow: {
        flexDirection: 'row',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
    },

    // ─── Sección de información ─────────
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 20,
        marginBottom: 20,
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

    // ─── Filas de info ──────────────────
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    infoIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    infoTextWrap: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#9CA3AF',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },

    // ─── Botón cerrar sesión ────────────
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF4444',
        borderRadius: 16,
        paddingVertical: 16,
        gap: 10,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
