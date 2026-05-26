const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');

// ─── POST /api/auth/register ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
    const { nombre_completo, correo, contrasena, rol } = req.body;

    // Validar campos obligatorios
    if (!nombre_completo || !correo || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validar formato de correo básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'El formato del correo no es válido' });
    }

    // Validar longitud de contraseña
    if (contrasena.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Validar rol — solo permitir 'usuario' o 'admin'
    const rolValido = ['usuario', 'admin'].includes(rol) ? rol : 'usuario';

    try {
        // Verificar si el correo ya existe
        const [existing] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE correo = ?',
            [correo.toLowerCase().trim()]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: 'Este correo ya está registrado' });
        }

        // Hashear la contraseña con bcrypt (salt rounds = 10)
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Insertar usuario en la base de datos con el rol correspondiente
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre_completo, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
            [nombre_completo.trim(), correo.toLowerCase().trim(), hashedPassword, rolValido]
        );

        console.log(`✅ Nuevo usuario registrado: ${correo} (ID: ${result.insertId}, Rol: ${rolValido})`);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: {
                id_usuario: result.insertId,
                nombre_completo: nombre_completo.trim(),
                correo: correo.toLowerCase().trim(),
                rol: rolValido,
            },
        });

    } catch (error) {
        console.error('❌ Error en registro:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ─── POST /api/auth/login ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    // Validar campos obligatorios
    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    try {
        // Buscar usuario por correo — incluir los campos `rol` y `activo`
        const [rows] = await pool.query(
            'SELECT id_usuario, nombre_completo, correo, contrasena, rol, activo FROM usuarios WHERE correo = ?',
            [correo.toLowerCase().trim()]
        );

        // No revelar si el correo existe o no (seguridad)
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const user = rows[0];

        // Verificar si la cuenta está activa
        if (!user.activo) {
            return res.status(403).json({ error: 'Tu cuenta ha sido desactivada. Contacta al administrador.' });
        }

        // Comparar contraseña con hash almacenado
        const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        console.log(`✅ Login exitoso: ${correo} (Rol: ${user.rol || 'usuario'})`);

        res.json({
            message: 'Inicio de sesión exitoso',
            usuario: {
                id_usuario: user.id_usuario,
                nombre_completo: user.nombre_completo,
                correo: user.correo,
                rol: user.rol || 'usuario',
            },
        });

    } catch (error) {
        console.error('❌ Error en login:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ─── PUT /api/auth/profile/:id ─────────────────────────────────────────────
router.put('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_completo, correo, contrasena_actual, contrasena_nueva } = req.body;

    // Validar campos obligatorios
    if (!nombre_completo || !correo) {
        return res.status(400).json({ error: 'El nombre y el correo son obligatorios' });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'El formato del correo no es válido' });
    }

    try {
        // Verificar que el usuario existe
        const [users] = await pool.query(
            'SELECT id_usuario, contrasena FROM usuarios WHERE id_usuario = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar que el correo no esté en uso por OTRO usuario
        const [existing] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE correo = ? AND id_usuario != ?',
            [correo.toLowerCase().trim(), id]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: 'Este correo ya está registrado por otro usuario' });
        }

        // Si quiere cambiar contraseña, validar la actual y la nueva
        let hashedNewPassword = null;
        if (contrasena_actual && contrasena_nueva) {
            const passwordMatch = await bcrypt.compare(contrasena_actual, users[0].contrasena);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
            }
            if (contrasena_nueva.length < 6) {
                return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
            }
            hashedNewPassword = await bcrypt.hash(contrasena_nueva, 10);
        } else if (contrasena_nueva && !contrasena_actual) {
            return res.status(400).json({ error: 'Debes ingresar tu contraseña actual para cambiarla' });
        }

        // Construir UPDATE dinámico
        if (hashedNewPassword) {
            await pool.query(
                'UPDATE usuarios SET nombre_completo = ?, correo = ?, contrasena = ? WHERE id_usuario = ?',
                [nombre_completo.trim(), correo.toLowerCase().trim(), hashedNewPassword, id]
            );
        } else {
            await pool.query(
                'UPDATE usuarios SET nombre_completo = ?, correo = ? WHERE id_usuario = ?',
                [nombre_completo.trim(), correo.toLowerCase().trim(), id]
            );
        }

        // Obtener datos actualizados (sin contraseña)
        const [updated] = await pool.query(
            'SELECT id_usuario, nombre_completo, correo, rol, fecha_creacion FROM usuarios WHERE id_usuario = ?',
            [id]
        );

        console.log(`✅ Perfil actualizado: ${correo} (ID: ${id})`);

        res.json({
            message: 'Perfil actualizado exitosamente',
            usuario: updated[0],
        });

    } catch (error) {
        console.error('❌ Error al actualizar perfil:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ─── GET /api/auth/usuarios ────────────────────────────────────────────────
// Lista todos los usuarios con estadísticas básicas (para admin)
router.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                u.id_usuario,
                u.nombre_completo,
                u.correo,
                u.rol,
                u.activo,
                u.fecha_creacion,
                COALESCE((SELECT SUM(p.puntos) FROM puntos p WHERE p.id_usuario = u.id_usuario), 0) AS puntos_totales,
                COALESCE((SELECT COUNT(*) FROM registros_reciclaje rr WHERE rr.id_usuario = u.id_usuario AND rr.estado = 'aprobado'), 0) AS registros_totales
             FROM usuarios u
             ORDER BY u.fecha_creacion DESC`
        );

        res.json({
            ok: true,
            usuarios: rows,
        });

    } catch (error) {
        console.error('❌ Error listando usuarios:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ─── PUT /api/auth/usuarios/:id/toggle-activo ──────────────────────────────
// Alterna el estado activo/inactivo de un usuario
router.put('/usuarios/:id/toggle-activo', async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar que el usuario existe
        const [users] = await pool.query(
            'SELECT id_usuario, nombre_completo, rol, activo FROM usuarios WHERE id_usuario = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = users[0];

        // No permitir desactivar a un admin
        if (user.rol === 'admin') {
            return res.status(403).json({ error: 'No se puede desactivar a un administrador' });
        }

        const nuevoEstado = user.activo ? 0 : 1;

        await pool.query(
            'UPDATE usuarios SET activo = ? WHERE id_usuario = ?',
            [nuevoEstado, id]
        );

        console.log(`${nuevoEstado ? '✅' : '⛔'} Usuario ${user.nombre_completo} (ID: ${id}) ${nuevoEstado ? 'activado' : 'desactivado'}`);

        res.json({
            message: nuevoEstado
                ? `Usuario ${user.nombre_completo} activado exitosamente`
                : `Usuario ${user.nombre_completo} desactivado exitosamente`,
            usuario: {
                id_usuario: parseInt(id),
                activo: nuevoEstado,
            },
        });

    } catch (error) {
        console.error('❌ Error toggle activo:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ─── DELETE /api/auth/usuarios/:id ─────────────────────────────────────────
// Elimina un usuario y todos sus datos relacionados (cascada)
router.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar que el usuario existe
        const [users] = await pool.query(
            'SELECT id_usuario, nombre_completo, rol FROM usuarios WHERE id_usuario = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = users[0];

        // No permitir eliminar a un admin
        if (user.rol === 'admin') {
            return res.status(403).json({ error: 'No se puede eliminar a un administrador' });
        }

        // Eliminar en cascada: canjes → puntos → registros_reciclaje → usuario
        await pool.query('DELETE FROM canjes WHERE id_usuario = ?', [id]);
        await pool.query('DELETE FROM puntos WHERE id_usuario = ?', [id]);
        await pool.query('DELETE FROM registros_reciclaje WHERE id_usuario = ?', [id]);
        await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

        console.log(`🗑️ Usuario ${user.nombre_completo} (ID: ${id}) eliminado con todos sus datos`);

        res.json({
            message: `Usuario ${user.nombre_completo} eliminado exitosamente`,
        });

    } catch (error) {
        console.error('❌ Error eliminando usuario:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
