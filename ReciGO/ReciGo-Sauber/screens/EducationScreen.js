import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import MainLayout from '../components/MainLayout';
import AppLogo from '../components/AppLogo';

const BRAND = '#22C55E';

const items = [
    { title:'Tipos de plástico reciclable',       icon:'recycle',       color:BRAND      },
    { title:'Cómo preparar cartón para reciclar',  icon:'cube-outline',  color:'#F59E0B'  },
    { title:'El vidrio: infinitamente reciclable', icon:'glass-fragile', color:'#3B82F6'  },
    { title:'Importancia del reciclaje de metal',  icon:'tools',         color:'#6B7280'  },
    { title:'Compostaje de residuos orgánicos',    icon:'leaf',          color:'#10B981'  },
];

const Header = () => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            <AppLogo size={40} />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.headerTitle}>ReciGo</Text>
                <Text style={styles.headerSub}>Aplicación de reciclaje</Text>
            </View>
        </View>
        <View style={styles.userIcon}>
            <MaterialIcons name="person-outline" size={22} color={BRAND} />
        </View>
    </View>
);

export default function EducationScreen({ navigation }) {
    return (
        <MainLayout navigation={navigation} activeScreen="Education">
            <Header />
            <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Educación</Text>
                <Text style={styles.subtitle}>Aprende sobre reciclaje y sostenibilidad</Text>
                <View style={styles.banner}>
                    <MaterialCommunityIcons name="book-open-variant" size={24} color="#fff" />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.bannerTitle}>Contenido educativo</Text>
                        <Text style={styles.bannerText}>Explora nuestros artículos para aprender mejores prácticas</Text>
                    </View>
                </View>
                {items.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.card}>
                        <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                            <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
                        </View>
                        <Text style={styles.cardText}>{item.title}</Text>
                        <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                ))}
                <View style={{ height: 20 }} />
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#F3F4F6' },
    headerLeft: { flexDirection:'row', alignItems:'center' },
    logo: { width:40, height:40, borderRadius:10, backgroundColor:'#22C55E', alignItems:'center', justifyContent:'center' },
    headerTitle: { fontWeight:'700', fontSize:16 },
    headerSub: { fontSize:11, color:'#6B7280' },
    userIcon: { width:38, height:38, borderRadius:19, backgroundColor:'#F0FDF4', alignItems:'center', justifyContent:'center' },
    title: { fontSize:20, fontWeight:'700', marginBottom:4 },
    subtitle: { color:'#6B7280', marginBottom:10 },
    banner: { flexDirection:'row', backgroundColor:BRAND, padding:15, borderRadius:16, marginBottom:15, alignItems:'center' },
    bannerTitle: { color:'#fff', fontWeight:'700' },
    bannerText: { color:'#fff', fontSize:12 },
    card: { flexDirection:'row', backgroundColor:'#fff', padding:15, borderRadius:14, marginBottom:10, alignItems:'center' },
    iconBox: { width:40, height:40, borderRadius:10, justifyContent:'center', alignItems:'center', marginRight:10 },
    cardText: { flex:1, fontSize:14 },
});
