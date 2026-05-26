import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BRAND = '#22C55E';

// Video component que funciona en web Y en móvil
const YoutubePlayer = ({ youtubeId, color }) => {
  if (Platform.OS === 'web') {
    // En web usamos iframe normal
    return (
      <View style={styles.videoWrapper}>
        <Text style={styles.videoLabel}>
          <MaterialCommunityIcons name="play-circle-outline" size={14} color="#374151" /> Video explicativo
        </Text>
        <iframe
          width="100%"
          height="200"
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
          frameBorder="0"
          allowFullScreen
          style={{ borderRadius: 14 }}
        />
      </View>
    );
  }

  // En móvil usamos WebView
  const { WebView } = require('react-native-webview');
  return (
    <View style={styles.videoWrapper}>
      <Text style={styles.videoLabel}>
        <MaterialCommunityIcons name="play-circle-outline" size={14} color="#374151" /> Video explicativo
      </Text>
      <WebView
        style={styles.video}
        source={{ uri: `https://www.youtube.com/embed/${youtubeId}?rel=0` }}
        allowsFullscreenVideo
        javaScriptEnabled
      />
    </View>
  );
};

export default function EducationDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { content, title, category, icon, color } = item;

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>

      {/* HEADER de color */}
      <View style={[styles.header, { backgroundColor: color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <MaterialCommunityIcons name={icon} size={28} color="#fff" />
          <Text style={styles.headerCategory}>{category}</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 30 }}>

        {/* Título */}
        <Text style={styles.title}>{title}</Text>

        {/* Imagen de portada */}
        {content.coverImage && (
          <Image
            source={{ uri: content.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        )}

        {/* Intro */}
        <Text style={styles.intro}>{content.intro}</Text>

        {/* Video — funciona en web y móvil */}
        {content.youtubeId && (
          <YoutubePlayer youtubeId={content.youtubeId} color={color} />
        )}

        {/* Secciones */}
        {content.sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text style={styles.sectionTitle}>{section.subtitle}</Text>
            </View>
            <Text style={styles.sectionText}>{section.text}</Text>
            {section.image && (
              <Image
                source={{ uri: section.image }}
                style={styles.sectionImage}
                resizeMode="cover"
              />
            )}
          </View>
        ))}

        {/* Consejo final */}
        <View style={[styles.tipBox, { borderLeftColor: color }]}>
          <View style={styles.tipHeader}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={color} />
            <Text style={[styles.tipTitle, { color }]}>Consejo práctico</Text>
          </View>
          <Text style={styles.tipText}>{content.tip}</Text>
        </View>

        {content.credits && (
          <View style={styles.creditsBox}>
            <MaterialCommunityIcons name="information-outline" size={13} color="#9CA3AF" />
            <Text style={styles.credit}> {content.credits}</Text>
          </View>
        )}




      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 20,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { alignItems: 'center', gap: 4 },
  headerCategory: { color: '#fff', fontWeight: '700', fontSize: 13, opacity: 0.9 },

  title: { fontSize: 21, fontWeight: '700', color: '#111827', marginBottom: 14, lineHeight: 28 },
  coverImage: { width: '100%', height: 190, borderRadius: 14, marginBottom: 14 },
  intro: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 20 },

  videoWrapper: { marginBottom: 20 },
  videoLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  video: { width: '100%', height: 200, borderRadius: 14, overflow: 'hidden' },

  sectionCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontWeight: '700', fontSize: 14, color: '#1F2937' },
  sectionText: { fontSize: 13, color: '#4B5563', lineHeight: 20, paddingLeft: 16 },
  sectionImage: { width: '100%', height: 150, borderRadius: 10, marginTop: 10 },

  tipBox: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginTop: 6, borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  tipTitle: { fontWeight: '700', fontSize: 13 },
  tipText: { fontSize: 13, color: '#4B5563', lineHeight: 20 },

  credit: { fontSize: 10, color: '#9CA3AF', textAlign: 'center', marginTop: 16 },

  creditsBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginTop: 16, padding: 10,
    backgroundColor: '#F3F4F6', borderRadius: 10,
  },
  credit: {
    fontSize: 10, color: '#9CA3AF',
    flex: 1, lineHeight: 16
  },
});