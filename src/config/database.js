const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

const pool = mysql.createPool(dbConfig);

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conectado a MySQL');
        connection.release();
        return true;
    } catch (error) {
        console.error('Error conectando a MySQL:', error.message);
        console.log('1. Asegúrate que el Servicio de MySQL esté corriendo');
        console.log('2. Verifica usuario/contraseña en .env');
        return false;
    }
};

module.exports = {
    pool,
    testConnection
};