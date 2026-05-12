import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ─────────────────────────────────────────────────────────────────────────────
// DETECCIÓN AUTOMÁTICA DE IP
//
// Cada desarrollador del equipo tiene una IP diferente en su PC.
// En lugar de hardcodear una IP (que rompería el proyecto para otros),
// leemos la IP directamente de Expo — la misma que usa el dispositivo
// físico para conectarse al servidor de desarrollo.
//
// ✅ Funciona para TODOS sin cambiar ningún archivo.
// ─────────────────────────────────────────────────────────────────────────────

const getApiUrl = () => {
    // En navegador web, el backend está en la misma máquina
    if (Platform.OS === 'web') {
        return 'http://localhost:3001';
    }

    // Expo expone la IP del PC en estas propiedades (varía según versión de Expo)
    const hostUri =
        Constants.expoConfig?.hostUri ||
        Constants.manifest2?.extra?.expoGo?.debuggerHost ||
        Constants.manifest?.debuggerHost;

    if (hostUri) {
        // hostUri tiene formato "192.168.x.x:8081" — tomamos solo la IP
        const ip = hostUri.split(':')[0];
        return `http://${ip}:3001`;
    }

    // ⚠️ Solo si Expo no expone la IP (muy raro), cambiar manualmente:
    return 'http://localhost:3001';
};

export const API_URL = getApiUrl();

