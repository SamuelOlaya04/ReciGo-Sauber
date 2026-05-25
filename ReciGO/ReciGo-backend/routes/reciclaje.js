const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// ─── Tabla de niveles (12 niveles con progresión considerada) ─────────────
// Los rangos casi se duplican entre nivel y nivel para que los rangos altos
// sean aspiracionales y requieran constancia real.
const NIVELES = [
    { nombre: 'Principiante',          min: 0,       max: 100,     icono: 'sprout' },
    { nombre: 'Ecoamigo',              min: 100,     max: 300,     icono: 'leaf' },
    { nombre: 'Eco-Activista',         min: 300,     max: 700,     icono: 'flower' },
    { nombre: 'Defensor Verde',        min: 700,     max: 1500,    icono: 'tree-outline' },
    { nombre: 'Protector del Bosque',  min: 1500,    max: 3000,    icono: 'pine-tree' },
    { nombre: 'Guardián de la Tierra', min: 3000,    max: 6000,    icono: 'shield-check' },
    { nombre: 'Maestro Verde',         min: 6000,    max: 12000,   icono: 'crown' },
    { nombre: 'Embajador Eco',         min: 12000,   max: 25000,   icono: 'medal' },
    { nombre: 'Héroe del Planeta',     min: 25000,   max: 50000,   icono: 'trophy' },
    { nombre: 'Leyenda Ecológica',     min: 50000,   max: 100000,  icono: 'star' },
    { nombre: 'Titán Verde',           min: 100000,  max: 250000,  icono: 'diamond-stone' },
    { nombre: 'Sabio Inmortal',        min: 250000,  max: 9999999, icono: 'earth' },
];

function calcularNivel(puntos) {
    const nivel = NIVELES.find(n => puntos >= n.min && puntos < n.max) || NIVELES[NIVELES.length - 1];
    const rango = nivel.max - nivel.min;
    const progreso = rango > 0 ? (puntos - nivel.min) / rango : 1;
    return {
        nombre: nivel.nombre,
        icono: nivel.icono,
        puntos_min: nivel.min,
        puntos_max: nivel.max,
        puntos_siguiente: Math.max(0, nivel.max - puntos),
        progreso: Math.min(1, Math.max(0, progreso)),
    };
}

function listarNiveles(puntos) {
    return NIVELES.map((n, idx) => {
        const esUltimo = idx === NIVELES.length - 1;
        const es_actual = esUltimo
            ? puntos >= n.min
            : puntos >= n.min && puntos < n.max;
        const conseguido = !esUltimo && puntos >= n.max;
        return {
            nombre:     n.nombre,
            icono:      n.icono,
            puntos_min: n.min,
            puntos_max: n.max,
            es_ultimo:  esUltimo,
            es_actual,
            conseguido,
        };
    });
}

function calcularRacha(diasRegistro) {
    if (diasRegistro.length === 0) return 0;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    const fechas = diasRegistro.map(d => {
        const f = new Date(d.dia);
        f.setHours(0, 0, 0, 0);
        return f.getTime();
    });

    let racha = 0;
    let fechaEsperada;

    if (fechas[0] === hoy.getTime()) {
        fechaEsperada = new Date(hoy);
        racha = 1;
    } else if (fechas[0] === ayer.getTime()) {
        fechaEsperada = new Date(ayer);
        racha = 1;
    } else {
        return 0;
    }

    for (let i = 1; i < fechas.length; i++) {
        fechaEsperada.setDate(fechaEsperada.getDate() - 1);
        if (fechas[i] === fechaEsperada.getTime()) {
            racha++;
        } else {
            break;
        }
    }

    return racha;
}

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/reciclaje — registrar un nuevo reciclaje
// ═══════════════════════════════════════════════════════════════════════════
router.post('/', async (req, res) => {
    const { id_usuario, id_categoria, cantidad } = req.body;

    if (!id_usuario || !id_categoria || !cantidad) {
        return res.status(400).json({ ok: false, message: 'Faltan datos' });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO registros_reciclaje (id_usuario, id_categoria, cantidad)
             VALUES (?, ?, ?)`,
            [id_usuario, id_categoria, cantidad]
        );

        const [[registro]] = await pool.query(
            `SELECT puntos_generados FROM registros_reciclaje WHERE id_registro = ?`,
            [result.insertId]
        );

        const [[totales]] = await pool.query(
            `SELECT COALESCE(SUM(puntos), 0) AS total FROM puntos WHERE id_usuario = ?`,
            [id_usuario]
        );

        res.json({
            ok:               true,
            message:          'Reciclaje registrado',
            id_registro:      result.insertId,
            puntos_generados: registro.puntos_generados,
            total_puntos:     totales.total,
        });

    } catch (error) {
        console.error('Error reciclaje:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/reciclaje/estadisticas/:id_usuario — estadísticas de gamificación
// ═══════════════════════════════════════════════════════════════════════════
router.get('/estadisticas/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        // 1. Saldo neto: puntos ganados menos canjes realizados
        const [[totales]] = await pool.query(
            `SELECT
                COALESCE((SELECT SUM(puntos)       FROM puntos WHERE id_usuario = ?), 0) -
                COALESCE((SELECT SUM(puntos_costo) FROM canjes WHERE id_usuario = ?), 0)
                AS puntos_totales`,
            [id_usuario, id_usuario]
        );

        // 2. Puntos GANADOS de por vida (no afectados por canjes)
        const [[ganadosRow]] = await pool.query(
            `SELECT COALESCE(SUM(puntos), 0) AS puntos_ganados
             FROM puntos WHERE id_usuario = ?`,
            [id_usuario]
        );

        // 3. Puntos ganados en los últimos 7 días
        const [[semana]] = await pool.query(
            `SELECT COALESCE(SUM(puntos), 0) AS puntos_semana
             FROM puntos
             WHERE id_usuario = ?
               AND fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
            [id_usuario]
        );

        // 4. Puntos ganados en el mes calendario actual
        const [[mes]] = await pool.query(
            `SELECT COALESCE(SUM(puntos), 0) AS puntos_mes
             FROM puntos
             WHERE id_usuario = ?
               AND YEAR(fecha) = YEAR(CURDATE())
               AND MONTH(fecha) = MONTH(CURDATE())`,
            [id_usuario]
        );

        // 5. Número total de registros
        const [[registros]] = await pool.query(
            `SELECT COUNT(*) AS registros_totales
             FROM registros_reciclaje
             WHERE id_usuario = ?`,
            [id_usuario]
        );

        // 6. Días distintos con actividad (para racha)
        const [diasRegistro] = await pool.query(
            `SELECT DISTINCT DATE(fecha_registro) AS dia
             FROM registros_reciclaje
             WHERE id_usuario = ?
             ORDER BY dia DESC`,
            [id_usuario]
        );

        const puntos_totales    = parseFloat(totales.puntos_totales);
        const puntos_ganados    = parseFloat(ganadosRow.puntos_ganados);
        const puntos_semana     = parseFloat(semana.puntos_semana);
        const puntos_mes        = parseFloat(mes.puntos_mes);
        const registros_totales = parseInt(registros.registros_totales);

        const promedio_por_registro = registros_totales > 0
            ? parseFloat((puntos_ganados / registros_totales).toFixed(2))
            : 0;

        const racha_dias = calcularRacha(diasRegistro);

        // Nivel basado en puntos GANADOS (no en saldo), así no baja al canjear
        const nivel   = calcularNivel(puntos_ganados);
        const niveles = listarNiveles(puntos_ganados);

        res.json({
            ok: true,
            puntos_totales,
            puntos_ganados,
            puntos_semana,
            puntos_mes,
            registros_totales,
            promedio_por_registro,
            racha_dias,
            nivel,
            niveles,
        });

    } catch (error) {
        console.error('Error estadisticas:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/reciclaje/canjear — canjear puntos por una recompensa
// ═══════════════════════════════════════════════════════════════════════════
router.post('/canjear', async (req, res) => {
    const { id_usuario, nombre_recompensa, puntos_costo } = req.body;

    if (!id_usuario || !nombre_recompensa || puntos_costo === undefined) {
        return res.status(400).json({ ok: false, message: 'Faltan datos' });
    }

    try {
        const [[saldoRow]] = await pool.query(
            `SELECT
                COALESCE((SELECT SUM(puntos)       FROM puntos WHERE id_usuario = ?), 0) -
                COALESCE((SELECT SUM(puntos_costo) FROM canjes WHERE id_usuario = ?), 0)
                AS saldo`,
            [id_usuario, id_usuario]
        );

        const saldo = parseFloat(saldoRow.saldo);
        const costo = parseFloat(puntos_costo);

        if (saldo < costo) {
            return res.status(400).json({
                ok: false,
                message: 'Puntos insuficientes',
                saldo,
                requerido: costo,
            });
        }

        const [result] = await pool.query(
            `INSERT INTO canjes (id_usuario, nombre_recompensa, puntos_costo)
             VALUES (?, ?, ?)`,
            [id_usuario, nombre_recompensa, costo]
        );

        res.json({
            ok: true,
            message: 'Canje exitoso',
            id_canje: result.insertId,
            nuevo_saldo: saldo - costo,
        });

    } catch (error) {
        console.error('Error canje:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
});

module.exports = router;
