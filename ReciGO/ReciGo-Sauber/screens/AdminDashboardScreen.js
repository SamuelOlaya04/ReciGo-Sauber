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
    Modal,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config';
import AppLogo from '../components/AppLogo';
import MainLayout from '../components/MainLayout';

const BRAND_BLUE = '#3B82F6';
const BRAND_BLUE_DARK = '#1D4ED8';
const BRAND_GREEN = '#22C55E';
const BRAND_RED = '#EF4444';
const BRAND_AMBER = '#F59E0B';

// ─── Categorías disponibles ─────────────────────────────────────────────────
const CATEGORIAS = [
    { id: 1, nombre: 'Plastico', icon: 'recycle',          color: '#3B82F6', pts: 2 },
    { id: 2, nombre: 'Carton',   icon: 'package-variant',   color: '#F97316', pts: 1.5 },
    { id: 3, nombre: 'Vidrio',   icon: 'glass-fragile',     color: '#8B5CF6', pts: 3 },
    { id: 4, nombre: 'Metal',    icon: 'cog-outline',       color: '#6B7280', pts: 4 },
    { id: 5, nombre: 'Organico', icon: 'leaf',              color: '#22C55E', pts: 1 },
];

// ─── Íconos por categoría ───────────────────────────────────────────────────
const CATEGORIA_ICON = {
    'Plastico': { icon: 'recycle',        color: '#3B82F6' },
    'Plástico': { icon: 'recycle',        color: '#3B82F6' },
    'Carton':   { icon: 'package-variant', color: '#F97316' },
    'Cartón':   { icon: 'package-variant', color: '#F97316' },
    'Vidrio':   { icon: 'glass-fragile',   color: '#8B5CF6' },
    'Metal':    { icon: 'cog-outline',     color: '#6B7280' },
    'Organico': { icon: 'leaf',            color: '#22C55E' },
    'Orgánico': { icon: 'leaf',            color: '#22C55E' },
};

const getCatIcon = (categoria) => CATEGORIA_ICON[categoria] || { icon: 'recycle', color: '#3B82F6' };

// ─── Header premium ──────────────────────────────────────────────────────────
const AdminHeader = ({ usuario, navigation }) => (
    <LinearGradient
        colors={[BRAND_BLUE_DARK, BRAND_BLUE]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={hStyles.container}
    >
        <View style={hStyles.left}>
            <View style={hStyles.logoWrap}>
                <MaterialCommunityIcons name="shield-check" size={22} color="#fff" />
            </View>
            <View style={{ marginLeft: 12 }}>
                <Text style={hStyles.greeting}>Panel de Administrador</Text>
                <Text style={hStyles.name}>{usuario?.nombre_completo || 'Admin'}</Text>
            </View>
        </View>
        <TouchableOpacity
            style={hStyles.profileBtn}
            onPress={() => navigation?.navigate('Profile')}
            activeOpacity={0.7}
        >
            <Ionicons name="person-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
    </LinearGradient>
);

const hStyles = StyleSheet.create({
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
    profileBtn: { padding: 4 },
});

// ─── Tarjeta de solicitud pendiente con animación ───────────────────────────
const PendienteCard = ({ item, onAprobar, onRechazar, onEditar, index }) => {
    const translateY = useRef(new Animated.Value(40)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, friction: 7, tension: 60, delay: index * 80, useNativeDriver: true }),
        ]).start();
    }, []);

    const fecha = new Date(item.fecha_registro).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    return (
        <Animated.View style={[cardStyles.wrap, { opacity, transform: [{ translateY }] }]}>
            {/* Header de la tarjeta */}
            <View style={cardStyles.header}>
                <View style={[cardStyles.emojiCircle, { backgroundColor: getCatIcon(item.categoria).color + '15' }]}>
                    <MaterialCommunityIcons name={getCatIcon(item.categoria).icon} size={26} color={getCatIcon(item.categoria).color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={cardStyles.userName}>{item.nombre_completo}</Text>
                    <Text style={cardStyles.userEmail} numberOfLines={1}>{item.correo}</Text>
                </View>
                <View style={cardStyles.pendingBadge}>
                    <MaterialCommunityIcons name="clock-outline" size={12} color="#F97316" />
                    <Text style={cardStyles.pendingText}>Pendiente</Text>
                </View>
            </View>

            {/* Detalle del reciclaje */}
            <View style={cardStyles.detailRow}>
                <View style={cardStyles.detailItem}>
                    <Text style={cardStyles.detailLabel}>Material</Text>
                    <Text style={cardStyles.detailValue}>{item.categoria}</Text>
                </View>
                <View style={[cardStyles.detailItem, { alignItems: 'center' }]}>
                    <Text style={cardStyles.detailLabel}>Cantidad</Text>
                    <Text style={cardStyles.detailValue}>{item.cantidad} unid.</Text>
                </View>
                <View style={[cardStyles.detailItem, { alignItems: 'flex-end' }]}>
                    <Text style={cardStyles.detailLabel}>Puntos</Text>
                    <Text style={[cardStyles.detailValue, { color: BRAND_GREEN }]}>
                        {parseFloat(item.puntos_generados).toFixed(0)} pts
                    </Text>
                </View>
            </View>

            {/* Fecha */}
            <View style={cardStyles.fechaRow}>
                <MaterialCommunityIcons name="calendar-clock" size={13} color="#9CA3AF" />
                <Text style={cardStyles.fechaText}>{fecha}</Text>
            </View>

            {/* Botones de acción */}
            <View style={cardStyles.actions}>
                <TouchableOpacity
                    style={cardStyles.rechazarBtn}
                    activeOpacity={0.8}
                    onPress={() => onRechazar(item.id_registro)}
                >
                    <MaterialCommunityIcons name="close-circle-outline" size={18} color={BRAND_RED} />
                    <Text style={cardStyles.rechazarText}>Rechazar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={cardStyles.editarBtn}
                    activeOpacity={0.8}
                    onPress={() => onEditar(item)}
                >
                    <MaterialCommunityIcons name="pencil-outline" size={18} color={BRAND_AMBER} />
                    <Text style={cardStyles.editarText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onAprobar(item.id_registro, item.puntos_generados, item.nombre_completo)}
                    style={{ flex: 1 }}
                >
                    <LinearGradient
                        colors={[BRAND_GREEN, '#16A34A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={cardStyles.aprobarBtn}
                    >
                        <MaterialCommunityIcons name="check-circle-outline" size={18} color="#fff" />
                        <Text style={cardStyles.aprobarText}>Aprobar</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const cardStyles = StyleSheet.create({
    wrap: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    emojiCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    userName: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
    userEmail: { fontSize: 12, color: '#6B7280' },
    pendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 4,
        borderWidth: 1,
        borderColor: '#FED7AA',
    },
    pendingText: { fontSize: 10, fontWeight: '600', color: '#F97316' },
    detailRow: { flexDirection: 'row', marginBottom: 12, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12 },
    detailItem: { flex: 1 },
    detailLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '500', marginBottom: 3 },
    detailValue: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
    fechaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 14 },
    fechaText: { fontSize: 12, color: '#9CA3AF' },
    actions: { flexDirection: 'row', gap: 8 },
    rechazarBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 4,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    rechazarText: { fontSize: 13, fontWeight: '700', color: BRAND_RED },
    editarBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFBEB',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 4,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    editarText: { fontSize: 13, fontWeight: '700', color: BRAND_AMBER },
    aprobarBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 12,
        gap: 6,
    },
    aprobarText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});

// ─── Modal de edición ───────────────────────────────────────────────────────
const EditModal = ({ visible, item, onClose, onSave, saving }) => {
    const [editCategoria, setEditCategoria] = useState(item?.id_categoria || 1);
    const [editCantidad, setEditCantidad] = useState(String(item?.cantidad || ''));

    // Sincronizar cuando cambia el item
    useEffect(() => {
        if (item) {
            setEditCategoria(item.id_categoria);
            setEditCantidad(String(item.cantidad));
        }
    }, [item]);

    const categoriaSeleccionada = CATEGORIAS.find(c => c.id === editCategoria);
    const cantidadNum = parseInt(editCantidad) || 0;
    const puntosEstimados = categoriaSeleccionada ? categoriaSeleccionada.pts * cantidadNum : 0;

    const handleGuardar = () => {
        if (!editCantidad || cantidadNum <= 0) {
            Alert.alert('Error', 'Ingresa una cantidad válida mayor a 0.');
            return;
        }
        onSave(item.id_registro, editCategoria, cantidadNum, item.nombre_completo);
    };

    if (!item) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={mStyles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={mStyles.backdrop}>
                    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
                </View>

                <View style={mStyles.container}>
                    {/* Handle visual */}
                    <View style={mStyles.handle} />

                    {/* Header */}
                    <View style={mStyles.header}>
                        <View style={mStyles.headerIconCircle}>
                            <MaterialCommunityIcons name="pencil-outline" size={22} color={BRAND_BLUE} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={mStyles.headerTitle}>Editar registro</Text>
                            <Text style={mStyles.headerSub}>{item.nombre_completo}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={mStyles.closeBtn}>
                            <Ionicons name="close" size={22} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 450 }}>
                        {/* Selector de categoría */}
                        <Text style={mStyles.label}>Tipo de material</Text>
                        <View style={mStyles.categoriasGrid}>
                            {CATEGORIAS.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        mStyles.catCard,
                                        editCategoria === cat.id && mStyles.catCardSelected,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => setEditCategoria(cat.id)}
                                >
                                    <MaterialCommunityIcons name={cat.icon} size={24} color={editCategoria === cat.id ? BRAND_BLUE : cat.color} />
                                    <Text style={[
                                        mStyles.catName,
                                        editCategoria === cat.id && mStyles.catNameSelected,
                                    ]}>
                                        {cat.nombre}
                                    </Text>
                                    <Text style={[
                                        mStyles.catPts,
                                        editCategoria === cat.id && mStyles.catPtsSelected,
                                    ]}>
                                        {cat.pts} pts/u
                                    </Text>
                                    {editCategoria === cat.id && (
                                        <View style={mStyles.catCheck}>
                                            <Ionicons name="checkmark-circle" size={16} color={BRAND_BLUE} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Campo de cantidad */}
                        <Text style={mStyles.label}>Cantidad</Text>
                        <View style={mStyles.inputRow}>
                            <TextInput
                                style={mStyles.input}
                                value={editCantidad}
                                onChangeText={setEditCantidad}
                                keyboardType="numeric"
                                placeholder="Ej: 25"
                                placeholderTextColor="#9CA3AF"
                            />
                            <Text style={mStyles.inputSuffix}>unidades</Text>
                        </View>

                        {/* Preview de puntos */}
                        {puntosEstimados > 0 && (
                            <View style={mStyles.previewCard}>
                                <MaterialCommunityIcons name="star-outline" size={18} color={BRAND_AMBER} />
                                <Text style={mStyles.previewText}>
                                    Puntos recalculados:{' '}
                                    <Text style={mStyles.previewPts}>{puntosEstimados} pts</Text>
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Botones */}
                    <View style={mStyles.footer}>
                        <TouchableOpacity style={mStyles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                            <Text style={mStyles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={saving ? 1 : 0.8}
                            onPress={handleGuardar}
                            disabled={saving}
                            style={{ flex: 1 }}
                        >
                            <LinearGradient
                                colors={saving ? ['#9CA3AF', '#6B7280'] : [BRAND_BLUE, BRAND_BLUE_DARK]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={mStyles.saveBtn}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <MaterialCommunityIcons name="content-save-outline" size={18} color="#fff" />
                                        <Text style={mStyles.saveText}>Guardar cambios</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const mStyles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        maxHeight: '85%',
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    headerIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    headerSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 10 },
    categoriasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    catCard: {
        width: '31%',
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        position: 'relative',
    },
    catCardSelected: {
        borderColor: BRAND_BLUE,
        backgroundColor: '#EFF6FF',
    },
    catName: { fontSize: 11, fontWeight: '600', color: '#6B7280', marginTop: 4 },
    catNameSelected: { color: BRAND_BLUE },
    catPts: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
    catPtsSelected: { color: BRAND_BLUE_DARK },
    catCheck: { position: 'absolute', top: 6, right: 6 },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#111827',
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    },
    inputSuffix: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
    previewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    previewText: { flex: 1, fontSize: 13, color: '#374151' },
    previewPts: { fontWeight: '700', color: BRAND_AMBER },
    footer: { flexDirection: 'row', gap: 10, marginTop: 8 },
    cancelBtn: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 6,
    },
    saveText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

// ─── Tarjeta de historial ───────────────────────────────────────────────────
const HistorialCard = ({ item }) => {
    const esAprobado = item.estado === 'aprobado';
    const fecha = new Date(item.fecha_registro).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

    return (
        <View style={hcStyles.wrap}>
            <View style={[hcStyles.indicator, { backgroundColor: esAprobado ? '#DCFCE7' : '#FEF2F2' }]}>
                <MaterialCommunityIcons
                    name={esAprobado ? 'check-circle' : 'close-circle'}
                    size={20}
                    color={esAprobado ? BRAND_GREEN : BRAND_RED}
                />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={hcStyles.userName} numberOfLines={1}>{item.nombre_completo}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                    <MaterialCommunityIcons name={getCatIcon(item.categoria).icon} size={14} color={getCatIcon(item.categoria).color} />
                    <Text style={hcStyles.detail}>{item.categoria} • {item.cantidad} unid.</Text>
                </View>
                <Text style={hcStyles.fecha}>{fecha}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={[hcStyles.pts, { color: esAprobado ? BRAND_GREEN : BRAND_RED }]}>
                    {esAprobado ? '+' : '✗'} {parseFloat(item.puntos_generados).toFixed(0)} pts
                </Text>
                <Text style={[hcStyles.estadoText, { color: esAprobado ? BRAND_GREEN : BRAND_RED }]}>
                    {esAprobado ? 'Aprobado' : 'Rechazado'}
                </Text>
            </View>
        </View>
    );
};

const hcStyles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    indicator: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    userName: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
    detail: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
    fecha: { fontSize: 11, color: '#9CA3AF' },
    pts: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
    estadoText: { fontSize: 11, fontWeight: '600' },
});

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function AdminDashboardScreen({ navigation }) {
    const [usuario, setUsuario] = useState(null);
    const [pendientes, setPendientes] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [procesando, setProcesando] = useState(null);

    // Estado del modal de edición
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [saving, setSaving] = useState(false);

    const cargarDatos = async () => {
        try {
            const stored = await AsyncStorage.getItem('usuario');
            const user = stored ? JSON.parse(stored) : null;
            setUsuario(user);

            const [resPendientes, resHistorial] = await Promise.all([
                axios.get(`${API_URL}/api/reciclaje/pendientes`),
                axios.get(`${API_URL}/api/reciclaje/historial-admin`),
            ]);

            setPendientes(resPendientes.data.pendientes || []);
            setHistorial(resHistorial.data.historial || []);
        } catch (err) {
            console.log('Error cargando datos admin:', err.message);
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

    const validarRegistro = async (id_registro, estado, nombre, pts) => {
        setProcesando(id_registro);
        try {
            await axios.post(`${API_URL}/api/reciclaje/validar`, { id_registro, estado });

            setPendientes(prev => prev.filter(p => p.id_registro !== id_registro));

            const item = pendientes.find(p => p.id_registro === id_registro);
            if (item) {
                setHistorial(prev => [{ ...item, estado }, ...prev].slice(0, 20));
            }

            if (estado === 'aprobado') {
                Alert.alert(
                    '✅ Aprobado',
                    `Se acreditaron ${parseFloat(pts).toFixed(0)} puntos a ${nombre}.`,
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert('❌ Rechazado', `El registro de ${nombre} fue rechazado.`, [{ text: 'OK' }]);
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || err.message);
        } finally {
            setProcesando(null);
        }
    };

    const confirmarAprobar = (id_registro, pts, nombre) => {
        if (Platform.OS === 'web') {
            if (window.confirm(`¿Aprobar el registro de ${nombre}? Se le acreditarán ${parseFloat(pts).toFixed(0)} puntos.`)) {
                validarRegistro(id_registro, 'aprobado', nombre, pts);
            }
        } else {
            Alert.alert(
                '¿Aprobar registro?',
                `Se acreditarán ${parseFloat(pts).toFixed(0)} puntos a ${nombre}.`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Aprobar', style: 'default', onPress: () => validarRegistro(id_registro, 'aprobado', nombre, pts) },
                ]
            );
        }
    };

    const confirmarRechazar = (id_registro) => {
        const item = pendientes.find(p => p.id_registro === id_registro);
        const nombre = item?.nombre_completo || 'el usuario';
        if (Platform.OS === 'web') {
            if (window.confirm(`¿Rechazar el registro de ${nombre}?`)) {
                validarRegistro(id_registro, 'rechazado', nombre, 0);
            }
        } else {
            Alert.alert(
                '¿Rechazar registro?',
                `Se rechazará el registro de ${nombre}. No se otorgarán puntos.`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Rechazar', style: 'destructive', onPress: () => validarRegistro(id_registro, 'rechazado', nombre, 0) },
                ]
            );
        }
    };

    // ─── Edición ─────────────────────────────────────────────────
    const abrirEditar = (item) => {
        setEditItem(item);
        setEditModalVisible(true);
    };

    const guardarEdicion = async (id_registro, id_categoria, cantidad, nombre) => {
        setSaving(true);
        try {
            const { data } = await axios.put(`${API_URL}/api/reciclaje/editar`, {
                id_registro,
                id_categoria,
                cantidad,
            });

            // Actualizar la lista de pendientes localmente
            setPendientes(prev => prev.map(p => {
                if (p.id_registro === id_registro) {
                    return {
                        ...p,
                        id_categoria: data.id_categoria,
                        categoria: data.categoria,
                        cantidad: data.cantidad,
                        puntos_generados: data.puntos_generados,
                    };
                }
                return p;
            }));

            setEditModalVisible(false);
            setEditItem(null);

            Alert.alert(
                '✏️ Editado',
                `Registro de ${nombre} actualizado: ${data.categoria} x${data.cantidad} = ${data.puntos_generados} pts.`,
                [{ text: 'OK' }]
            );
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <MainLayout navigation={navigation} activeScreen="AdminDashboard">
                <AdminHeader usuario={usuario} navigation={navigation} />
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color={BRAND_BLUE} />
                    <Text style={styles.loadingText}>Cargando solicitudes...</Text>
                </View>
            </MainLayout>
        );
    }

    return (
        <MainLayout navigation={navigation} activeScreen="AdminDashboard">
            <AdminHeader usuario={usuario} navigation={navigation} />

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
                {/* ── Stats cards superiores ── */}
                <View style={styles.statsRow}>
                    <LinearGradient
                        colors={[BRAND_BLUE_DARK, BRAND_BLUE]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.statCard, { marginRight: 10 }]}
                    >
                        <MaterialCommunityIcons name="clock-check-outline" size={24} color="rgba(255,255,255,0.9)" style={{ marginBottom: 8 }} />
                        <Text style={styles.statNumber}>{pendientes.length}</Text>
                        <Text style={styles.statLabel}>Pendientes</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={[BRAND_GREEN, '#16A34A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.statCard, { marginRight: 10 }]}
                    >
                        <MaterialCommunityIcons name="check-all" size={24} color="rgba(255,255,255,0.9)" style={{ marginBottom: 8 }} />
                        <Text style={styles.statNumber}>
                            {historial.filter(h => h.estado === 'aprobado').length}
                        </Text>
                        <Text style={styles.statLabel}>Aprobados</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={[BRAND_RED, '#DC2626']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statCard}
                    >
                        <MaterialCommunityIcons name="close-octagon-outline" size={24} color="rgba(255,255,255,0.9)" style={{ marginBottom: 8 }} />
                        <Text style={styles.statNumber}>
                            {historial.filter(h => h.estado === 'rechazado').length}
                        </Text>
                        <Text style={styles.statLabel}>Rechazados</Text>
                    </LinearGradient>
                </View>

                {/* ── Sección: Solicitudes pendientes ── */}
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="inbox-arrow-down" size={20} color="#1F2937" />
                    <Text style={styles.sectionTitle}>Solicitudes pendientes</Text>
                    {pendientes.length > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>{pendientes.length}</Text>
                        </View>
                    )}
                </View>

                {pendientes.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconCircle}>
                            <MaterialCommunityIcons name="check-decagram" size={40} color={BRAND_GREEN} />
                        </View>
                        <Text style={styles.emptyTitle}>¡Todo al día! 🎉</Text>
                        <Text style={styles.emptySub}>
                            No hay registros de reciclaje pendientes de validación.{'\n'}¡Buen trabajo!
                        </Text>
                    </View>
                ) : (
                    pendientes.map((item, index) => (
                        <View key={item.id_registro} style={{ opacity: procesando === item.id_registro ? 0.6 : 1 }}>
                            <PendienteCard
                                item={item}
                                index={index}
                                onAprobar={confirmarAprobar}
                                onRechazar={confirmarRechazar}
                                onEditar={abrirEditar}
                            />
                            {procesando === item.id_registro && (
                                <View style={styles.procesandoOverlay}>
                                    <ActivityIndicator size="small" color={BRAND_BLUE} />
                                    <Text style={styles.procesandoText}>Procesando...</Text>
                                </View>
                            )}
                        </View>
                    ))
                )}

                {/* ── Sección: Historial reciente ── */}
                {historial.length > 0 && (
                    <>
                        <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                            <MaterialCommunityIcons name="history" size={20} color="#1F2937" />
                            <Text style={styles.sectionTitle}>Historial reciente</Text>
                        </View>
                        {historial.map((item) => (
                            <HistorialCard key={`h-${item.id_registro}`} item={item} />
                        ))}
                    </>
                )}

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* ── Modal de edición ── */}
            <EditModal
                visible={editModalVisible}
                item={editItem}
                onClose={() => { setEditModalVisible(false); setEditItem(null); }}
                onSave={guardarEdicion}
                saving={saving}
            />
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    scroll: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 30 },

    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },

    statsRow: { flexDirection: 'row', marginBottom: 24 },
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
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
    emptySub: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },

    procesandoOverlay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -10,
        marginBottom: 14,
        gap: 8,
    },
    procesandoText: { fontSize: 13, color: BRAND_BLUE, fontWeight: '600' },
});
