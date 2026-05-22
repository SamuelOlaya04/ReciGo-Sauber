import { API_URL } from '../config';

// ─── Registrar nuevo usuario ───────────────────────────────────────────────
export const registerUser = async (nombre_completo, correo, contrasena) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre_completo, correo, contrasena }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Lanzar el mensaje de error que viene del backend
            throw new Error(data.error || 'Error al registrar usuario');
        }

        return data; // { message, usuario: { id_usuario, nombre_completo, correo } }

    } catch (error) {
        if (error.message === 'Network request failed') {
            throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
        }
        throw error;
    }
};

// ─── Iniciar sesión ────────────────────────────────────────────────────────
export const loginUser = async (correo, contrasena) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, contrasena }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al iniciar sesión');
        }

        return data; // { message, usuario: { id_usuario, nombre_completo, correo } }

    } catch (error) {
        if (error.message === 'Network request failed') {
            throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
        }
        throw error;
    }
};
