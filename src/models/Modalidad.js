const { pool } = require('../config/database');

class Modalidad {
    // Crear modalidad
    static async create({ tipo }) {
        const [result] = await pool.execute(
            'INSERT INTO modalidades (tipo) VALUES (?)',
            [tipo]
        );
        return result.insertId;
    }

    // Obtener todas las modalidades
    static async getAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM modalidades ORDER BY tipo'
        );
        return rows;
    }

    // Obtener por ID
    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM modalidades WHERE id_modalidad = ?',
            [id]
        );
        return rows[0];
    }

    // Actualizar modalidad
    static async update(id, { tipo }) {
        const [result] = await pool.execute(
            'UPDATE modalidades SET tipo = ? WHERE id_modalidad = ?',
            [tipo, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar modalidad
    static async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM modalidades WHERE id_modalidad = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Modalidad;