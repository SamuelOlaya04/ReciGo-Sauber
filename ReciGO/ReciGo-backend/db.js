// ─── Conexión a MySQL ──────────────────────────────────────────────────────
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',           // Contraseña vacía (phpMyAdmin por defecto)
    database: 'recigo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const initDatabase = (async () => {
    const conn = await pool.getConnection();

    try {
        console.log('Conexión a MySQL exitosa');

        const [columns] = await conn.query(
            "SHOW COLUMNS FROM usuarios LIKE 'activo'"
        );

        if (columns.length === 0) {
            await conn.query(
                'ALTER TABLE usuarios ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER rol'
            );

            console.log('Columna usuarios.activo creada correctamente');
        }
    } finally {
        conn.release();
    }
})().catch(err => {
    console.error('Error al preparar la base de datos:', err.message);
    throw err;
});

module.exports = pool;
module.exports.initDatabase = initDatabase;
