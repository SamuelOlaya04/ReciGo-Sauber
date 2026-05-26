import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import MainLayout from '../components/MainLayout';
import AppLogo from '../components/AppLogo';

const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';

const TIPOS = [
    { label: 'Plástico', icon: 'recycle',          color: '#3B82F6', pts: 2, id: 1 },
    { label: 'Cartón',   icon: 'package-variant',   color: '#F97316', pts: 1.5, id: 2 },
    { label: 'Vidrio',   icon: 'glass-fragile',     color: '#8B5CF6', pts: 3, id: 3 },
    { label: 'Metal',    icon: 'cog-outline',       color: '#6B7280', pts: 4, id: 4 },
    { label: 'Orgánico', icon: 'leaf',              color: '#22C55E', pts: 1, id: 5 },
];

const Header = ({ navigation }) => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            <AppLogo size={40} />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.headerTitle}>ReciGo</Text>
                <Text style={styles.headerSub}>Aplicación de reciclaje</Text>
            </View>
        </View>

        <TouchableOpacity
            style={styles.userIcon}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate('Profile')}
        >
            <MaterialIcons name="person-outline" size={22} color={BRAND_GREEN} />
        </TouchableOpacity>
    </View>
);

export default function AgregarScreen({ navigation }) {
    const [tipo, setTipo] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [loading, setLoading] = useState(false);
    const [idUsuario, setIdUsuario] = useState(null);

    // Cargar el ID del usuario real desde AsyncStorage al montar
    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const stored = await AsyncStorage.getItem('usuario');
                const user = stored ? JSON.parse(stored) : null;
                if (user?.id_usuario) {
                    setIdUsuario(user.id_usuario);
                }
            } catch (err) {
                console.log('Error cargando usuario en AgregarScreen:', err.message);
            }
        };
        cargarUsuario();
    }, []);

    const registrarReciclaje = async () => {
        if (!tipo) {
            Alert.alert('Material requerido', 'Por favor selecciona un tipo de material.');
            return;
        }

        if (!cantidad || isNaN(cantidad) || parseInt(cantidad) <= 0) {
            Alert.alert('Cantidad inválida', 'Por favor ingresa una cantidad válida mayor a 0.');
            return;
        }

        if (!idUsuario) {
            Alert.alert('Error de sesión', 'No se pudo identificar al usuario. Vuelve a iniciar sesión.');
            return;
        }

        const tipoSeleccionado = TIPOS.find(t => t.label === tipo);
        if (!tipoSeleccionado) {
            Alert.alert('Error', 'Tipo de material no reconocido.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `${API_URL}/api/reciclaje`,
                {
                    id_usuario: idUsuario,
                    id_categoria: tipoSeleccionado.id,
                    cantidad: parseInt(cantidad),
                }
            );

            Alert.alert(
                '♻️ Registro enviado',
                'Tu reciclaje fue registrado correctamente y está pendiente de validación por un administrador. ¡Tus puntos se agregarán una vez aprobado!',
                [{ text: 'Entendido', style: 'default' }]
            );
            setCantidad('');
            setTipo(null);

        } catch (error) {
            console.log('ERROR COMPLETO:', error.response?.data || error.message || error);
            Alert.alert('Error', JSON.stringify(error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Calcular puntos estimados en tiempo real
    const tipoSel = TIPOS.find(t => t.label === tipo);
    const cantidadNum = parseInt(cantidad) || 0;
    const puntosEstimados = tipoSel ? tipoSel.pts * cantidadNum : 0;

    return (
        <MainLayout navigation={navigation} activeScreen="Agregar">
            <Header navigation={navigation} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.pageTitle}>Registrar Reciclaje</Text>
                <Text style={styles.pageSubtitle}>
                    Tu registro será validado por un administrador para acreditar tus puntos
                </Text>

                {/* ── Banner informativo ─── */}
                <View style={styles.infoBanner}>
                    <MaterialCommunityIcons name="information" size={18} color="#3B82F6" />
                    <Text style={styles.infoBannerText}>
                        Los puntos se acreditarán una vez que un administrador apruebe tu registro.
                    </Text>
                </View>

                <Text style={styles.sectionLabel}>Tipo de residuo</Text>

                <View style={styles.tiposGrid}>
                    {TIPOS.map((t) => (
                        <TouchableOpacity
                            key={t.label}
                            style={[
                                styles.tipoCard,
                                tipo === t.label ? styles.tipoCardSelected : null,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => setTipo(t.label)}
                        >
                            <MaterialCommunityIcons 
                                name={t.icon} 
                                size={32} 
                                color={tipo === t.label ? BRAND_GREEN : t.color} 
                                style={{ marginBottom: 6 }} 
                            />
                            <Text style={[
                                styles.tipoLabel,
                                tipo === t.label ? styles.tipoLabelSelected : null,
                            ]}>
                                {t.label}
                            </Text>
                            <Text style={[styles.tipoPts, tipo === t.label ? styles.tipoPtsSelected : null]}>
                                {t.pts} pts/u
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionLabel}>Cantidad de objetos</Text>

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 25"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        value={cantidad}
                        onChangeText={setCantidad}
                    />
                    <Text style={styles.inputSuffix}>unidades</Text>
                </View>

                {/* ── Preview de puntos estimados ─── */}
                {puntosEstimados > 0 && (
                    <View style={styles.previewCard}>
                        <MaterialCommunityIcons name="star-outline" size={20} color="#F97316" />
                        <Text style={styles.previewText}>
                            Puntos estimados:{' '}
                            <Text style={styles.previewPts}>{puntosEstimados} pts</Text>
                            {' '}(pendientes de aprobación)
                        </Text>
                    </View>
                )}

                <View style={styles.infoCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 }}>
                        <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="#1E40AF" />
                        <Text style={[styles.infoTitle, { marginBottom: 0 }]}>Puntos por tipo</Text>
                    </View>
                    {TIPOS.map((t) => (
                        <Text key={t.label} style={styles.infoItem}>
                            • {t.label}:{' '}
                            <Text style={styles.infoPts}>{t.pts} pts/unidad</Text>
                        </Text>
                    ))}
                </View>

                <TouchableOpacity
                    activeOpacity={loading ? 1 : 0.85}
                    style={{ marginTop: 8 }}
                    onPress={registrarReciclaje}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={loading ? ['#9CA3AF', '#6B7280'] : [BRAND_GREEN_DARK, BRAND_GREEN]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.registerBtn}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <MaterialCommunityIcons
                                    name="plus-circle-outline"
                                    size={20}
                                    color="#fff"
                                />
                                <Text style={styles.registerBtnText}>Enviar para validación</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    headerSub: {
        fontSize: 12,
        color: '#6B7280',
    },
    userIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 36,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
        lineHeight: 20,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 24,
        gap: 10,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    infoBannerText: {
        flex: 1,
        fontSize: 13,
        color: '#1D4ED8',
        lineHeight: 18,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    tiposGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },
    tipoCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 18,
        paddingHorizontal: 8,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        marginBottom: 12,
        marginRight: '2%',
        elevation: 2,
    },
    tipoCardSelected: {
        borderColor: BRAND_GREEN,
        backgroundColor: '#F0FDF4',
    },
    tipoEmoji: {
        fontSize: 32,
        marginBottom: 6,
    },
    tipoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 2,
    },
    tipoLabelSelected: {
        color: BRAND_GREEN,
    },
    tipoPts: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    tipoPtsSelected: {
        color: BRAND_GREEN_DARK,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#111827',
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    },
    inputSuffix: {
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    previewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        gap: 10,
        borderWidth: 1,
        borderColor: '#FED7AA',
    },
    previewText: {
        flex: 1,
        fontSize: 13,
        color: '#374151',
        lineHeight: 18,
    },
    previewPts: {
        fontWeight: '700',
        color: '#F97316',
    },
    infoCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E40AF',
        marginBottom: 10,
    },
    infoItem: {
        fontSize: 13,
        color: '#374151',
        marginBottom: 4,
    },
    infoPts: {
        fontWeight: '700',
        color: '#1E40AF',
    },
    registerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        paddingVertical: 16,
        gap: 8,
    },
    registerBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});