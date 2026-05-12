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

// Verificar conexión al iniciar
pool.getConnection()
    .then(conn => {
        console.log('Conexión a MySQL exitosa');
        conn.release();
    })
    .catch(err => {
        console.error('Error al conectar a MySQL:', err.message);
    });

module.exports = pool;
