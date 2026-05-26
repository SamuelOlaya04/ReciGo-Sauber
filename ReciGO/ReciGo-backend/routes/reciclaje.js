const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// ─── Tabla de niveles (12 niveles con progresión considerada) ─────────────
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
// POST /api/reciclaje — registrar un nuevo reciclaje (queda pendiente)
// ═══════════════════════════════════════════════════════════════════════════
router.post('/', async (req, res) => {
    const { id_usuario, id_categoria, cantidad } = req.body;

    if (!id_usuario || !id_categoria || !cantidad) {
        return res.status(400).json({ ok: false, message: 'Faltan datos' });
    }

    try {
        // Insertar con estado 'pendiente' explícitamente
        const [result] = await pool.query(
            `INSERT INTO registros_reciclaje (id_usuario, id_categoria, cantidad, estado)
             VALUES (?, ?, ?, 'pendiente')`,
            [id_usuario, id_categoria, cantidad]
        );

        const [[registro]] = await pool.query(
            `SELECT puntos_generados FROM registros_reciclaje WHERE id_registro = ?`,
            [result.insertId]
        );

        // El total de puntos no cambia aún (el registro está pendiente)
        const [[totales]] = await pool.query(
            `SELECT COALESCE(SUM(puntos), 0) AS total FROM puntos WHERE id_usuario = ?`,
            [id_usuario]
        );

        res.json({
            ok:               true,
            message:          'Reciclaje registrado y pendiente de validación',
            id_registro:      result.insertId,
            puntos_generados: registro.puntos_generados,
            total_puntos:     totales.total,
            estado:           'pendiente',
        });

    } catch (error) {
        console.error('Error reciclaje:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/reciclaje/estadisticas/:id_usuario — estadísticas de gamificación
// Solo considera registros con estado = 'aprobado'
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

        // 5. Número total de registros APROBADOS
        const [[registros]] = await pool.query(
            `SELECT COUNT(*) AS registros_totales
             FROM registros_reciclaje
             WHERE id_usuario = ? AND estado = 'aprobado'`,
            [id_usuario]
        );

        // 6. Número de registros PENDIENTES del usuario
        const [[pendientes]] = await pool.query(
            `SELECT COUNT(*) AS registros_pendientes
             FROM registros_reciclaje
             WHERE id_usuario = ? AND estado = 'pendiente'`,
            [id_usuario]
        );

        // 7. Días distintos con actividad APROBADA (para racha)
        const [diasRegistro] = await pool.query(
            `SELECT DISTINCT DATE(fecha_registro) AS dia
             FROM registros_reciclaje
             WHERE id_usuario = ? AND estado = 'aprobado'
             ORDER BY dia DESC`,
            [id_usuario]
        );

        const puntos_totales    = parseFloat(totales.puntos_totales);
        const puntos_ganados    = parseFloat(ganadosRow.puntos_ganados);
        const puntos_semana     = parseFloat(semana.puntos_semana);
        const puntos_mes        = parseFloat(mes.puntos_mes);
        const registros_totales = parseInt(registros.registros_totales);
        const registros_pendientes = parseInt(pendientes.registros_pendientes);

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
            registros_pendientes,
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
// GET /api/reciclaje/pendientes — listar registros pendientes (para admin)
// ═══════════════════════════════════════════════════════════════════════════
router.get('/pendientes', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                rr.id_registro,
                rr.cantidad,
                rr.puntos_generados,
                rr.fecha_registro,
                rr.estado,
                u.id_usuario,
                u.nombre_completo,
                u.correo,
                c.nombre AS categoria,
                c.id_categoria
             FROM registros_reciclaje rr
             JOIN usuarios u ON rr.id_usuario = u.id_usuario
             JOIN categorias c ON rr.id_categoria = c.id_categoria
             WHERE rr.estado = 'pendiente'
             ORDER BY rr.fecha_registro ASC`
        );

        res.json({ ok: true, pendientes: rows });

    } catch (error) {
        console.error('Error pendientes:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/reciclaje/historial-admin — historial reciente de validaciones
// ═══════════════════════════════════════════════════════════════════════════
router.get('/historial-admin', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                rr.id_registro,
                rr.cantidad,
                rr.puntos_generados,
                rr.fecha_registro,
                rr.estado,
                u.nombre_completo,
                u.correo,
                c.nombre AS categoria
             FROM registros_reciclaje rr
             JOIN usuarios u ON rr.id_usuario = u.id_usuario
             JOIN categorias c ON rr.id_categoria = c.id_categoria
             WHERE rr.estado IN ('aprobado', 'rechazado')
             ORDER BY rr.fecha_registro DESC
             LIMIT 20`
        );

        res.json({ ok: true, historial: rows });

    } catch (error) {
        console.error('Error historial admin:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/reciclaje/validar — aprobar o rechazar un registro (admin)
// ═══════════════════════════════════════════════════════════════════════════
router.post('/validar', async (req, res) => {
    const { id_registro, estado } = req.body;

    if (!id_registro || !['aprobado', 'rechazado'].includes(estado)) {
        return res.status(400).json({ ok: false, message: 'Datos inválidos. estado debe ser aprobado o rechazado' });
    }

    try {
        // Verificar que el registro exista y esté pendiente
        const [[registro]] = await pool.query(
            `SELECT id_registro, id_usuario, puntos_generados, estado
             FROM registros_reciclaje WHERE id_registro = ?`,
            [id_registro]
        );

        if (!registro) {
            return res.status(404).json({ ok: false, message: 'Registro no encontrado' });
        }

        if (registro.estado !== 'pendiente') {
            return res.status(400).json({
                ok: false,
                message: `El registro ya fue procesado (estado: ${registro.estado})`,
            });
        }

        // Actualizar el estado del registro
        await pool.query(
            `UPDATE registros_reciclaje SET estado = ? WHERE id_registro = ?`,
            [estado, id_registro]
        );

        // Si es aprobado → acreditar puntos en la tabla `puntos`
        if (estado === 'aprobado') {
            await pool.query(
                `INSERT INTO puntos (id_usuario, id_registro, puntos)
                 VALUES (?, ?, ?)`,
                [registro.id_usuario, id_registro, registro.puntos_generados]
            );
            console.log(`✅ Registro #${id_registro} aprobado — ${registro.puntos_generados} pts acreditados a usuario #${registro.id_usuario}`);
        } else {
            console.log(`❌ Registro #${id_registro} rechazado`);
        }

        res.json({
            ok: true,
            message: estado === 'aprobado'
                ? `Registro aprobado. Se acreditaron ${registro.puntos_generados} puntos.`
                : 'Registro rechazado.',
            id_registro,
            estado,
            puntos_acreditados: estado === 'aprobado' ? parseFloat(registro.puntos_generados) : 0,
        });

    } catch (error) {
        console.error('Error validar:', error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// PUT /api/reciclaje/editar — editar un registro pendiente (admin)
// Permite modificar la categoría y/o cantidad antes de aprobar/rechazar
// ═══════════════════════════════════════════════════════════════════════════
router.put('/editar', async (req, res) => {
    const { id_registro, id_categoria, cantidad } = req.body;

    if (!id_registro || !id_categoria || !cantidad || cantidad <= 0) {
        return res.status(400).json({ ok: false, message: 'Datos inválidos. Se requiere id_registro, id_categoria y cantidad > 0' });
    }

    try {
        // Verificar que el registro exista y esté pendiente
        const [[registro]] = await pool.query(
            `SELECT id_registro, estado FROM registros_reciclaje WHERE id_registro = ?`,
            [id_registro]
        );

        if (!registro) {
            return res.status(404).json({ ok: false, message: 'Registro no encontrado' });
        }

        if (registro.estado !== 'pendiente') {
            return res.status(400).json({
                ok: false,
                message: `Solo se pueden editar registros pendientes (estado actual: ${registro.estado})`,
            });
        }

        // Obtener puntos_por_unidad de la nueva categoría
        const [[categoria]] = await pool.query(
            `SELECT nombre, puntos_por_unidad FROM categorias WHERE id_categoria = ?`,
            [id_categoria]
        );

        if (!categoria) {
            return res.status(400).json({ ok: false, message: 'Categoría no encontrada' });
        }

        const nuevos_puntos = parseInt(cantidad) * parseFloat(categoria.puntos_por_unidad);

        // Actualizar el registro
        await pool.query(
            `UPDATE registros_reciclaje
             SET id_categoria = ?, cantidad = ?, puntos_generados = ?
             WHERE id_registro = ?`,
            [id_categoria, parseInt(cantidad), nuevos_puntos, id_registro]
        );

        console.log(`✏️ Registro #${id_registro} editado — ${categoria.nombre} x${cantidad} = ${nuevos_puntos} pts`);

        res.json({
            ok: true,
            message: 'Registro editado correctamente',
            id_registro,
            categoria: categoria.nombre,
            id_categoria: parseInt(id_categoria),
            cantidad: parseInt(cantidad),
            puntos_generados: nuevos_puntos,
        });

    } catch (error) {
        console.error('Error editar:', error.message);
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
