import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

import MainLayout from '../components/MainLayout';
import AppLogo from '../components/AppLogo';

const BRAND_GREEN = '#22C55E';
const BRAND_GREEN_DARK = '#16A34A';

const TIPOS = [
    { label: 'Plástico', emoji: '♻️', pts: 2, id: 1 },
    { label: 'Cartón', emoji: '📦', pts: 1.5, id: 2 },
    { label: 'Vidrio', emoji: '🍾', pts: 3, id: 3 },
    { label: 'Metal', emoji: '🥫', pts: 4, id: 4 },
    { label: 'Orgánico', emoji: '🌱', pts: 1, id: 5 },
];

const Header = () => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            <AppLogo size={40} />

            <View style={{ marginLeft: 10 }}>
                <Text style={styles.headerTitle}>ReciGo</Text>
                <Text style={styles.headerSub}>
                    Aplicación de reciclaje
                </Text>
            </View>
        </View>

        <View style={styles.userIcon}>
            <MaterialIcons
                name="person-outline"
                size={22}
                color={BRAND_GREEN}
            />
        </View>
    </View>
);

export default function AgregarScreen({ navigation }) {

    const [tipo, setTipo] = useState(null);
    const [cantidad, setCantidad] = useState('');

    const registrarReciclaje = async () => {
        if (!tipo) {
            alert('Selecciona un tipo de material');
            return;
        }

        if (!cantidad || isNaN(cantidad)) {
            alert('Ingresa una cantidad válida');
            return;
        }

        // ─── Agrega esta guarda ──────────────────────────────────────
        const tipoSeleccionado = TIPOS.find(t => t.label === tipo);
        console.log('tipo actual:', tipo);
        console.log('TIPOS disponibles:', TIPOS.map(t => t.label));
        if (!tipoSeleccionado) {
            alert('Tipo de material no reconocido');
            return;
        }
        // ─────────────────────────────────────────────────────────────

        try {
            await axios.post(
                'http://192.168.1.7:3001/api/reciclaje',
                {
                    id_usuario: 1,
                    id_categoria: tipoSeleccionado.id,
                    cantidad: parseInt(cantidad)
                }
            );

            alert('♻️ Reciclaje registrado correctamente');
            setCantidad('');
            setTipo(null);

        } catch (error) {
            console.log('ERROR COMPLETO:', error.response?.data || error.message || error);
            alert(JSON.stringify(error.response?.data || error.message));
        }
    };

    return (
        <MainLayout navigation={navigation} activeScreen="Reciclar">

            <Header />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <Text style={styles.pageTitle}>
                    Registrar Reciclaje
                </Text>

                <Text style={styles.pageSubtitle}>
                    Suma puntos por cada registro que hagas
                </Text>

                <Text style={styles.sectionLabel}>
                    Tipo de residuo
                </Text>

                <View style={styles.tiposGrid}>

                    {TIPOS.map((t) => (

                        <TouchableOpacity
                            key={t.label}
                            style={[
                                styles.tipoCard,
                                tipo === t.label
                                    ? styles.tipoCardSelected
                                    : null
                            ]}
                            activeOpacity={0.7}
                            onPress={() => setTipo(t.label)}
                        >

                            <Text style={styles.tipoEmoji}>
                                {t.emoji}
                            </Text>

                            <Text
                                style={[
                                    styles.tipoLabel,
                                    tipo === t.label
                                        ? styles.tipoLabelSelected
                                        : null
                                ]}
                            >
                                {t.label}
                            </Text>

                        </TouchableOpacity>

                    ))}

                </View>

                <Text style={styles.sectionLabel}>
                    Cantidad de objetos
                </Text>

                <View style={styles.inputRow}>

                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 25"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        value={cantidad}
                        onChangeText={setCantidad}
                    />

                    <Text style={styles.inputSuffix}>
                        unidades
                    </Text>

                </View>

                <View style={styles.infoCard}>

                    <Text style={styles.infoTitle}>
                        💡 Puntos por tipo
                    </Text>

                    {TIPOS.map((t) => (

                        <Text
                            key={t.label}
                            style={styles.infoItem}
                        >
                            • {t.label}:{' '}
                            <Text style={styles.infoPts}>
                                {t.pts} pts/unidad
                            </Text>
                        </Text>

                    ))}

                </View>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={{ marginTop: 8 }}
                    onPress={registrarReciclaje}
                >

                    <LinearGradient
                        colors={[BRAND_GREEN_DARK, BRAND_GREEN]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.registerBtn}
                    >

                        <MaterialCommunityIcons
                            name="plus-circle-outline"
                            size={20}
                            color="#fff"
                        />

                        <Text style={styles.registerBtnText}>
                            Registrar reciclaje
                        </Text>

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
        backgroundColor: '#FFFFFF'
    },

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827'
    },

    headerSub: {
        fontSize: 12,
        color: '#6B7280'
    },

    userIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center'
    },

    scroll: {
        flex: 1,
        backgroundColor: '#F9FAFB'
    },

    scrollContent: {
        padding: 20,
        paddingBottom: 36
    },

    pageTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4
    },

    pageSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24
    },

    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12
    },

    tiposGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24
    },

    tipoCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 20,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        marginBottom: 12,
        marginRight: '2%',
        elevation: 2
    },

    tipoCardSelected: {
        borderColor: BRAND_GREEN,
        backgroundColor: '#F0FDF4'
    },

    tipoEmoji: {
        fontSize: 36,
        marginBottom: 8
    },

    tipoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151'
    },

    tipoLabelSelected: {
        color: BRAND_GREEN
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },

    input: {
        flex: 1,
        fontSize: 18,
        color: '#111827',
        paddingVertical: Platform.OS === 'ios' ? 14 : 10
    },

    inputSuffix: {
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '500'
    },

    infoCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#BFDBFE'
    },

    infoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E40AF',
        marginBottom: 10
    },

    infoItem: {
        fontSize: 13,
        color: '#374151',
        marginBottom: 4
    },

    infoPts: {
        fontWeight: '700',
        color: '#1E40AF'
    },

    registerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        paddingVertical: 16
    },

    registerBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 8
    }
});