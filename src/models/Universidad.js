const { pool } = require('../config/database');

class Universidad {
    // Crear universidad
    static async create({ nombre, ciudad, pais, estado, estatus }) {
        const [result] = await pool.execute(
            'INSERT INTO universidades (nombre, ciudad, pais, estado, estatus) VALUES (?, ?, ?, ?, ?',
            [nombre, ciudad, pais, estado, estatus]
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
    static async update(id, { nombre, ciudad, pais, estado, estatus }) {
        const [result] = await pool.execute(
            'UPDATE universidades SET nombre = ?, ciudad = ?, pais = ?, estado = ?, estatus = ? WHERE id_universidad = ?',
            [nombre, ciudad, pais, estado, estatus, id]
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

    //Universidades estatus
    static async getByEstatus(estatus) {
        const [rows] = await pool.execute(
            'SELECT * FROM universidades WHERE estatus = ? ORDER BY nombre',
            [estatus]
        );
        return rows;
    }

    //Cambiar estatus
        static async cambiarEstatus(id, nuevoEstatus) {
        const [result] = await pool.execute(
            'UPDATE universidades SET estatus = ? WHERE id_universidad = ?',
            [nuevoEstatus, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Universidad;