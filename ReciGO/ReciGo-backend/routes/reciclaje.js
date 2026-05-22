const express = require('express');
const router  = express.Router();
const pool    = require('../db');

router.post('/', async (req, res) => {
    const { id_usuario, id_categoria, cantidad } = req.body;

    if (!id_usuario || !id_categoria || !cantidad) {
        return res.status(400).json({ ok: false, message: 'Faltan datos' });
    }

    try {
        // 1. Insertar — los triggers calculan y guardan los puntos solos
        const [result] = await pool.query(
            `INSERT INTO registros_reciclaje (id_usuario, id_categoria, cantidad)
             VALUES (?, ?, ?)`,
            [id_usuario, id_categoria, cantidad]
        );

        // 2. Leer cuántos puntos generó este registro
        const [[registro]] = await pool.query(
            `SELECT puntos_generados FROM registros_reciclaje WHERE id_registro = ?`,
            [result.insertId]
        );

        // 3. Total acumulado del usuario
        const [[totales]] = await pool.query(
            `SELECT COALESCE(SUM(puntos), 0) AS total FROM puntos WHERE id_usuario = ?`,
            [id_usuario]
        );

        res.json({
            ok:               true,
            message:          'Reciclaje registrado',
            id_registro:      result.insertId,
            puntos_generados: registro.puntos_generados,   // ← nuevo
            total_puntos:     totales.total,               // ← nuevo
        });

    } catch (error) {
        console.error('Error reciclaje:', error.message);   // más útil que console.log(error)
        res.status(500).json({ ok: false, message: error.message });  // ← muestra el error real
    }
});

module.exports = router;