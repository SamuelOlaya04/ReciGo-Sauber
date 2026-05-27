const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const reciclajeRoutes = require('./routes/reciclaje');
const db = require('./db');

const app = express();
const PORT = 3001;

// ─── Middlewares ───────────────────────────────────────────────────────────
app.use(cors());                    // Permitir peticiones desde la app
app.use(express.json());            // Parsear JSON en el body

// ─── Rutas ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/reciclaje', reciclajeRoutes);

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'ReciGo Backend funcionando correctamente',
        timestamp: new Date().toISOString(),
    });
});

// ─── Iniciar servidor ──────────────────────────────────────────────────────
// '0.0.0.0' permite conexiones desde la red local (dispositivo físico)
(async () => {
    await db.initDatabase;

    app.listen(PORT, '0.0.0.0', () => {
        console.log('');
        console.log('========================================');
        console.log(`   ReciGo Backend corriendo`);
        console.log(`   Local:   http://localhost:${PORT}`);
        console.log(`   Red:     http://192.168.1.7:${PORT}`);
        console.log('==========================================');
        console.log('');
    });
})().catch(err => {
    console.error('No se pudo iniciar el backend:', err.message);
    process.exit(1);
});
