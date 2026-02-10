const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const universidadRoutes = require('./routes/universidadRoutes');
const modalidadRoutes = require('./routes/modalidadRoutes');
const becadoRoutes = require('./routes/becadoRoutes');

// Crear aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido al API del Sistema de Becas',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            universidades: '/api/universidades',
            modalidades: '/api/modalidades',
            becados: '/api/becados'
        }
    });
});

// Ruta de salud
app.get('/health', async (req, res) => {
    const dbStatus = await testConnection();
    
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbStatus ? 'Connected' : 'Disconnected',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Configurar rutas
const apiPrefix = process.env.API_PREFIX || '/api';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/usuarios`, usuarioRoutes);
app.use(`${apiPrefix}/universidades`, universidadRoutes);
app.use(`${apiPrefix}/modalidades`, modalidadRoutes);
app.use(`${apiPrefix}/becados`, becadoRoutes);

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app;