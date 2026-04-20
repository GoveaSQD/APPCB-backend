const { pool } = require('../config/database');

class Usuario {
    // CREAR usuario
    static async create({ nombre, ap_paterno, ap_materno, email, password, tipo_usuario }) {
        const [result] = await pool.execute(
            `INSERT INTO usuarios 
            (nombre, ap_paterno, ap_materno, email, password, tipo_usuario) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, ap_paterno || null, ap_materno || null, email, password, tipo_usuario || 2]
        );
        return result.insertId;
    }

    // Buscar por email
    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, ap_paterno, ap_materno, email, tipo_usuario, password FROM usuarios WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    // Buscar por ID
    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, ap_paterno, ap_materno, email, tipo_usuario FROM usuarios WHERE id_usuario = ?',
            [id]
        );
        return rows[0];
    }

    // Obtener todos los usuarios
    static async getAll() {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, ap_paterno, ap_materno, email, tipo_usuario FROM usuarios ORDER BY id_usuario DESC'
        );
        return rows;
    }

    // Actualizar usuario
    static async update(id, { nombre, ap_paterno, ap_materno, email, tipo_usuario, password }) {
        let query = 'UPDATE usuarios SET nombre = ?, ap_paterno = ?, ap_materno = ?, email = ?, tipo_usuario = ?';
        let params = [nombre, ap_paterno || null, ap_materno || null, email, tipo_usuario];
        
        // Si se proporciona password, actualizarlo también
        if (password) {
            query += ', password = ?';
            params.push(password);
        }
        
        query += ' WHERE id_usuario = ?';
        params.push(id);
        
        const [result] = await pool.execute(query, params);
        return result.affectedRows > 0;
    }

    // Eliminar usuario
    static async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM usuarios WHERE id_usuario = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Usuario;