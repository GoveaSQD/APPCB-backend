const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT;

// Función para iniciar el servidor
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`
        SERVIDOR INICIADO
        ========================
        URL: http://localhost:${PORT}
        Entorno: ${process.env.NODE_ENV || 'development'}
        Inicio: ${new Date().toLocaleString()}
        
        ENDPOINTS DISPONIBLES:
        ========================
        GET  /              - Documentación del API
        GET  /health        - Estado del sistema
        
        AUTENTICACIÓN:
        POST /api/auth/register  - Registrar usuario
        POST /api/auth/login     - Iniciar sesión
        GET  /api/auth/profile   - Perfil de usuario
        
        USUARIOS:
        GET    /api/usuarios     - Listar usuarios
        GET    /api/usuarios/:id - Obtener usuario
        PUT    /api/usuarios/:id - Actualizar usuario
        DELETE /api/usuarios/:id - Eliminar usuario
        
        UNIVERSIDADES:
        POST   /api/universidades     - Crear universidad
        GET    /api/universidades     - Listar universidades
        GET    /api/universidades/:id - Obtener universidad
        PUT    /api/universidades/:id - Actualizar universidad
        DELETE /api/universidades/:id - Eliminar universidad
        
        MODALIDADES:
        POST   /api/modalidades     - Crear modalidad
        GET    /api/modalidades     - Listar modalidades
        GET    /api/modalidades/:id - Obtener modalidad
        PUT    /api/modalidades/:id - Actualizar modalidad
        DELETE /api/modalidades/:id - Eliminar modalidad
        
        BECADOS:
        POST   /api/becados     - Crear becado
        GET    /api/becados     - Listar becados
        GET    /api/becados/:id - Obtener becado
        PUT    /api/becados/:id - Actualizar becado
        DELETE /api/becados/:id - Eliminar becado
        
        NOTA: Todas las rutas excepto /auth requieren token JWT
        ==========================================================
        `);
    });
};

// Manejar cierre del servidor
process.on('SIGINT', () => {
    console.log('\nervidor detenido');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nServidor terminado');
    process.exit(0);
});

// Iniciar servidor
startServer();