const { pool } = require('../config/database');

class Usuario {
    static async create({ nombre, email, password }) {
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, password]
        );
        return result.insertId;
    }

    // Buscar por email
    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    // Buscar por ID
    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, email FROM usuarios WHERE id_usuario = ?',
            [id]
        );
        return rows[0];
    }

    // Obtener todos los usuarios
    static async getAll() {
        const [rows] = await pool.execute(
            'SELECT id_usuario, nombre, email FROM usuarios ORDER BY nombre'
        );
        return rows;
    }

    // Actualizar usuario
    static async update(id, { nombre, email }) {
        const [result] = await pool.execute(
            'UPDATE usuarios SET nombre = ?, email = ? WHERE id_usuario = ?',
            [nombre, email, id]
        );
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