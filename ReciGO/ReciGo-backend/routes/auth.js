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
        // Buscar usuario por correo — incluir el campo `rol`
        const [rows] = await pool.query(
            'SELECT id_usuario, nombre_completo, correo, contrasena, rol FROM usuarios WHERE correo = ?',
            [correo.toLowerCase().trim()]
        );

        // No revelar si el correo existe o no (seguridad)
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const user = rows[0];

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

module.exports = router;
