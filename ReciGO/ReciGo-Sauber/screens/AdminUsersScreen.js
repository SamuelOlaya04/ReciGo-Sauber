import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Platform,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config';
import MainLayout from '../components/MainLayout';

const BRAND_BLUE = '#3B82F6';
const BRAND_BLUE_DARK = '#1D4ED8';
const BRAND_GREEN = '#22C55E';
const BRAND_RED = '#EF4444';
const BRAND_AMBER = '#F59E0B';

// ─── Header premium azul ────────────────────────────────────────────────────
const AdminHeader = ({ usuario }) => (
    <LinearGradient
        colors={[BRAND_BLUE_DARK, BRAND_BLUE]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={headerStyles.container}
    >
        <View style={headerStyles.left}>
            <View style={headerStyles.logoWrap}>
                <MaterialCommunityIcons name="account-group" size={22} color="#fff" />
            </View>
            <View style={{ marginLeft: 12 }}>
                <Text style={headerStyles.greeting}>Gestión de Usuarios</Text>
                <Text style={headerStyles.name}>{usuario?.nombre_completo || 'Admin'}</Text>
            </View>
        </View>
    </LinearGradient>
);

const headerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    logoWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greeting: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginBottom: 2 },
    name: { fontSize: 16, color: '#fff', fontWeight: '700' },
});

// ─── Avatar con iniciales ───────────────────────────────────────────────────
const UserAvatar = ({ nombre, esAdmin, activo }) => {
    const iniciales = nombre
        ? nombre.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    const bgColor = !activo ? '#F3F4F6' : esAdmin ? '#EFF6FF' : '#DCFCE7';
    const textColor = !activo ? '#9CA3AF' : esAdmin ? BRAND_BLUE : BRAND_GREEN;

    return (
        <View style={[avatarStyles.circle, { backgroundColor: bgColor }]}>
            <Text style={[avatarStyles.text, { color: textColor }]}>{iniciales}</Text>
            {!activo && (
                <View style={avatarStyles.inactiveDot} />
            )}
        </View>
    );
};

const avatarStyles = StyleSheet.create({
    circle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
    },
    inactiveDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
});

// ─── Tarjeta de usuario animada ─────────────────────────────────────────────
const UserCard = ({ item, index, onToggleActivo, onEliminar, procesando }) => {
    const translateY = useRef(new Animated.Value(30)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, friction: 7, tension: 60, delay: index * 60, useNativeDriver: true }),
        ]).start();
    }, []);

    const esAdmin = item.rol === 'admin';
    const activo = !!item.activo;
    const isProcessing = procesando === item.id_usuario;

    const fecha = new Date(item.fecha_creacion).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

    return (
        <Animated.View style={[
            cardStyles.wrap,
            { opacity, transform: [{ translateY }] },
            !activo && cardStyles.wrapInactive,
            isProcessing && { opacity: 0.6 },
        ]}>
            {/* Header de la tarjeta */}
            <View style={cardStyles.header}>
                <UserAvatar nombre={item.nombre_completo} esAdmin={esAdmin} activo={activo} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[cardStyles.userName, !activo && cardStyles.textMuted]}>
                        {item.nombre_completo}
                    </Text>
                    <Text style={cardStyles.userEmail} numberOfLines={1}>{item.correo}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    {/* Badge de rol */}
                    {esAdmin ? (
                        <View style={[cardStyles.badge, cardStyles.badgeAdmin]}>
                            <MaterialCommunityIcons name="shield-check" size={11} color={BRAND_BLUE} />
                            <Text style={[cardStyles.badgeText, { color: BRAND_BLUE }]}>Admin</Text>
                        </View>
                    ) : (
                        <View style={[cardStyles.badge, cardStyles.badgeUser]}>
                            <MaterialCommunityIcons name="account" size={11} color="#6B7280" />
                            <Text style={[cardStyles.badgeText, { color: '#6B7280' }]}>Usuario</Text>
                        </View>
                    )}
                    {/* Badge de estado */}
                    <View style={[
                        cardStyles.badge,
                        activo ? cardStyles.badgeActivo : cardStyles.badgeInactivo,
                    ]}>
                        <View style={[
                            cardStyles.statusDot,
                            { backgroundColor: activo ? BRAND_GREEN : BRAND_RED },
                        ]} />
                        <Text style={[
                            cardStyles.badgeText,
                            { color: activo ? BRAND_GREEN : BRAND_RED },
                        ]}>
                            {activo ? 'Activo' : 'Inactivo'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Info extra */}
            <View style={cardStyles.infoRow}>
                <View style={cardStyles.infoItem}>
                    <MaterialCommunityIcons name="calendar-outline" size={14} color="#9CA3AF" />
                    <Text style={cardStyles.infoText}>{fecha}</Text>
                </View>
                <View style={cardStyles.infoItem}>
                    <MaterialCommunityIcons name="star-outline" size={14} color={BRAND_AMBER} />
                    <Text style={cardStyles.infoText}>{parseFloat(item.puntos_totales).toFixed(0)} pts</Text>
                </View>
                <View style={cardStyles.infoItem}>
                    <MaterialCommunityIcons name="recycle" size={14} color={BRAND_GREEN} />
                    <Text style={cardStyles.infoText}>{item.registros_totales} reg.</Text>
                </View>
            </View>

            {/* Botones de acción (no mostrar para admins) */}
            {!esAdmin && (
                <View style={cardStyles.actions}>
                    <TouchableOpacity
                        style={[
                            cardStyles.actionBtn,
                            activo ? cardStyles.actionBtnWarning : cardStyles.actionBtnSuccess,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => onToggleActivo(item)}
                        disabled={isProcessing}
                    >
                        <MaterialCommunityIcons
                            name={activo ? 'account-off-outline' : 'account-check-outline'}
                            size={16}
                            color={activo ? BRAND_AMBER : BRAND_GREEN}
                        />
                        <Text style={[
                            cardStyles.actionBtnText,
                            { color: activo ? BRAND_AMBER : BRAND_GREEN },
                        ]}>
                            {activo ? 'Desactivar' : 'Activar'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[cardStyles.actionBtn, cardStyles.actionBtnDanger]}
                        activeOpacity={0.8}
                        onPress={() => onEliminar(item)}
                        disabled={isProcessing}
                    >
                        <MaterialCommunityIcons name="delete-outline" size={16} color={BRAND_RED} />
                        <Text style={[cardStyles.actionBtnText, { color: BRAND_RED }]}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Animated.View>
    );
};

const cardStyles = StyleSheet.create({
    wrap: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    wrapInactive: {
        borderColor: '#FECACA',
        backgroundColor: '#FEFEFE',
    },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    userName: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
    textMuted: { color: '#9CA3AF' },
    userEmail: { fontSize: 12, color: '#6B7280' },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 7,
        paddingVertical: 3,
        gap: 3,
    },
    badgeAdmin: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' },
    badgeUser: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
    badgeActivo: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' },
    badgeInactivo: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
    badgeText: { fontSize: 10, fontWeight: '600' },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    infoRow: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        gap: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 10,
        gap: 6,
        borderWidth: 1,
    },
    actionBtnWarning: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FDE68A',
    },
    actionBtnSuccess: {
        backgroundColor: '#F0FDF4',
        borderColor: '#BBF7D0',
    },
    actionBtnDanger: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },
    actionBtnText: { fontSize: 13, fontWeight: '700' },
});

// ─── Pantalla principal ─────────────────────────────────────────────────────
export default function AdminUsersScreen({ navigation }) {
    const [usuario, setUsuario] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [procesando, setProcesando] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const cargarDatos = async () => {
        try {
            const stored = await AsyncStorage.getItem('usuario');
            const user = stored ? JSON.parse(stored) : null;
            setUsuario(user);

            const { data } = await axios.get(`${API_URL}/api/auth/usuarios`);
            setUsuarios(data.usuarios || []);
        } catch (err) {
            console.log('Error cargando usuarios:', err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            cargarDatos();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        cargarDatos();
    };

    // Filtrar usuarios por búsqueda
    const usuariosFiltrados = usuarios.filter(u => {
        const term = busqueda.toLowerCase().trim();
        if (!term) return true;
        return (
            u.nombre_completo.toLowerCase().includes(term) ||
            u.correo.toLowerCase().includes(term)
        );
    });

    const totalActivos = usuarios.filter(u => u.activo).length;
    const totalInactivos = usuarios.filter(u => !u.activo).length;

    // ─── Acciones ────────────────────────────────────────────────────────────

    const handleToggleActivo = (item) => {
        const accion = item.activo ? 'desactivar' : 'activar';
        const mensaje = item.activo
            ? `¿Desactivar a ${item.nombre_completo}? No podrá iniciar sesión.`
            : `¿Activar a ${item.nombre_completo}? Podrá iniciar sesión nuevamente.`;

        const ejecutar = async () => {
            setProcesando(item.id_usuario);
            try {
                const { data } = await axios.put(
                    `${API_URL}/api/auth/usuarios/${item.id_usuario}/toggle-activo`
                );
                // Actualizar estado local
                setUsuarios(prev => prev.map(u =>
                    u.id_usuario === item.id_usuario
                        ? { ...u, activo: data.usuario.activo }
                        : u
                ));
                Alert.alert(
                    item.activo ? '⛔ Desactivado' : '✅ Activado',
                    data.message,
                    [{ text: 'OK' }]
                );
            } catch (err) {
                Alert.alert('Error', err.response?.data?.error || err.message);
            } finally {
                setProcesando(null);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(mensaje)) ejecutar();
        } else {
            Alert.alert(
                `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
                mensaje,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: accion.charAt(0).toUpperCase() + accion.slice(1),
                        style: item.activo ? 'destructive' : 'default',
                        onPress: ejecutar,
                    },
                ]
            );
        }
    };

    const handleEliminar = (item) => {
        const mensaje = `¿Eliminar a ${item.nombre_completo}?\n\nEsto eliminará permanentemente todos sus datos: registros de reciclaje, puntos y canjes. Esta acción no se puede deshacer.`;

        const ejecutar = async () => {
            setProcesando(item.id_usuario);
            try {
                const { data } = await axios.delete(
                    `${API_URL}/api/auth/usuarios/${item.id_usuario}`
                );
                // Remover de la lista local
                setUsuarios(prev => prev.filter(u => u.id_usuario !== item.id_usuario));
                Alert.alert('🗑️ Eliminado', data.message, [{ text: 'OK' }]);
            } catch (err) {
                Alert.alert('Error', err.response?.data?.error || err.message);
            } finally {
                setProcesando(null);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(mensaje)) ejecutar();
        } else {
            Alert.alert(
                '⚠️ Eliminar usuario',
                mensaje,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Eliminar', style: 'destructive', onPress: ejecutar },
                ]
            );
        }
    };

    // ─── Loading ─────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <MainLayout navigation={navigation} activeScreen="AdminUsers">
                <AdminHeader usuario={usuario} />
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color={BRAND_BLUE} />
                    <Text style={styles.loadingText}>Cargando usuarios...</Text>
                </View>
            </MainLayout>
        );
    }

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <MainLayout navigation={navigation} activeScreen="AdminUsers">
            <AdminHeader usuario={usuario} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[BRAND_BLUE]}
                        tintColor={BRAND_BLUE}
                    />
                }
            >
                {/* ── Stats cards ──────────────── */}
                <View style={styles.statsRow}>
                    <LinearGradient
                        colors={[BRAND_BLUE_DARK, BRAND_BLUE]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.statCard, { marginRight: 10 }]}
                    >
                        <MaterialCommunityIcons name="account-group" size={24} color="rgba(255,255,255,0.9)" style={{ marginBottom: 8 }} />
                        <Text style={styles.statNumber}>{usuarios.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={[BRAND_GREEN, '#16A34A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.statCard, { marginRight: 10 }]}
                    >
                        <MaterialCommunityIcons name="account-check" size={24} color="rgba(255,255,255,0.9)" style={{ marginBottom: 8 }} />
                        <Text style={styles.statNumber}>{totalActivos}</Text>
                        <Text style={styles.statLabel}>Activos</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={[BRAND_RED, '#DC2626']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statCard}
                    >
                        <MaterialCommunityIcons name="account-off" size={24} color="rgba(255,255,255,0.9)" style={{ marginBottom: 8 }} />
                        <Text style={styles.statNumber}>{totalInactivos}</Text>
                        <Text style={styles.statLabel}>Inactivos</Text>
                    </LinearGradient>
                </View>

                {/* ── Barra de búsqueda ────────── */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por nombre o correo..."
                        placeholderTextColor="#9CA3AF"
                        value={busqueda}
                        onChangeText={setBusqueda}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {busqueda.length > 0 && (
                        <TouchableOpacity onPress={() => setBusqueda('')} activeOpacity={0.6}>
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Título sección ──────────── */}
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="account-multiple" size={20} color="#1F2937" />
                    <Text style={styles.sectionTitle}>
                        {busqueda ? `Resultados (${usuariosFiltrados.length})` : 'Todos los usuarios'}
                    </Text>
                    {!busqueda && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>{usuarios.length}</Text>
                        </View>
                    )}
                </View>

                {/* ── Lista de usuarios ────────── */}
                {usuariosFiltrados.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconCircle}>
                            <MaterialCommunityIcons
                                name={busqueda ? 'account-search' : 'account-group-outline'}
                                size={40}
                                color={BRAND_BLUE}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>
                            {busqueda ? 'Sin resultados' : 'No hay usuarios'}
                        </Text>
                        <Text style={styles.emptySub}>
                            {busqueda
                                ? `No se encontraron usuarios con "${busqueda}".`
                                : 'No hay usuarios registrados en el sistema.'
                            }
                        </Text>
                    </View>
                ) : (
                    usuariosFiltrados.map((item, index) => (
                        <UserCard
                            key={item.id_usuario}
                            item={item}
                            index={index}
                            onToggleActivo={handleToggleActivo}
                            onEliminar={handleEliminar}
                            procesando={procesando}
                        />
                    ))
                )}

                <View style={{ height: 20 }} />
            </ScrollView>
        </MainLayout>
    );
}

// ─── Estilos principales ────────────────────────────────────────────────────
const styles = StyleSheet.create({
    scroll: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 30 },

    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },

    // Stats
    statsRow: { flexDirection: 'row', marginBottom: 20 },
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 14,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        minHeight: 110,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
    },
    statNumber: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
    statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },

    // Búsqueda
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },

    // Sección
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 8,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', flex: 1 },
    countBadge: {
        backgroundColor: BRAND_BLUE,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    countBadgeText: { fontSize: 13, fontWeight: '700', color: '#fff' },

    // Vacío
    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        marginBottom: 20,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
    emptySub: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
});
