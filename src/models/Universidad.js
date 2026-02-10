const { pool } = require('../config/database');

class Universidad {
    // Crear universidad
    static async create({ nombre }) {
        const [result] = await pool.execute(
            'INSERT INTO universidades (nombre) VALUES (?)',
            [nombre]
        );
        return result.insertId;
    }

    // Obtener todas las universidades
    static async getAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM universidades ORDER BY nombre'
        );
        return rows;
    }

    // Obtener por ID
    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM universidades WHERE id_universidad = ?',
            [id]
        );
        return rows[0];
    }

    // Actualizar universidad
    static async update(id, { nombre }) {
        const [result] = await pool.execute(
            'UPDATE universidades SET nombre = ? WHERE id_universidad = ?',
            [nombre, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar universidad
    static async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM universidades WHERE id_universidad = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Universidad;