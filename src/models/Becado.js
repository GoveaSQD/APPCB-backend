const { pool } = require('../config/database');

class Becado {
    // Crear becado (actualizado con nuevos campos)
    static async create({nombre, apellido_p, apellido_m, estatus, carrera, id_universidad, id_modalidad, monto_autorizado, monto_1, monto_2, monto_3, monto_4, monto_5, monto_6, erogado, pendiente_erogar
    }) {
        const [result] = await pool.execute(
            `INSERT INTO becados (
                nombre, apellido_p, apellido_m, estatus, carrera, 
                id_universidad, id_modalidad, monto_autorizado,
                monto_1, monto_2, monto_3, monto_4, monto_5, monto_6,
                erogado, pendiente_erogar
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido_p, apellido_m, estatus || 1, carrera, id_universidad, id_modalidad, monto_autorizado, monto_1, monto_2, monto_3, monto_4, monto_5, monto_6, erogado, pendiente_erogar]
        );
        return result.insertId;
    }

    // Obtener todos los becados con información relacionada
    static async getAll() {
        const [rows] = await pool.execute(`
            SELECT b.*, 
                   u.nombre as universidad_nombre,
                   m.tipo as modalidad_tipo
            FROM becados b
            LEFT JOIN universidades u ON b.id_universidad = u.id_universidad
            LEFT JOIN modalidades m ON b.id_modalidad = m.id_modalidad
            ORDER BY b.apellido_p, b.apellido_m, b.nombre
        `);
        return rows;
    }

    // Obtener becado por ID
    static async findById(id) {
        const [rows] = await pool.execute(`
            SELECT b.*, 
                   u.nombre as universidad_nombre,
                   m.tipo as modalidad_tipo
            FROM becados b
            LEFT JOIN universidades u ON b.id_universidad = u.id_universidad
            LEFT JOIN modalidades m ON b.id_modalidad = m.id_modalidad
            WHERE b.id_becado = ?
        `, [id]);
        return rows[0];
    }

    // Actualizar becado (actualizado con nuevos campos)
    static async update(id, { 
        nombre, 
        apellido_p, 
        apellido_m, 
        estatus, 
        carrera, 
        id_universidad, 
        id_modalidad,
        monto_autorizado,
        monto_1,
        monto_2,
        monto_3,
        monto_4,
        monto_5,
        monto_6,
        erogado,
        pendiente_erogar
    }) {
        const [result] = await pool.execute(
            `UPDATE becados 
             SET nombre = ?, 
                 apellido_p = ?, 
                 apellido_m = ?, 
                 estatus = ?, 
                 carrera = ?, 
                 id_universidad = ?, 
                 id_modalidad = ?,
                 monto_autorizado = ?,
                 monto_1 = ?,
                 monto_2 = ?,
                 monto_3 = ?,
                 monto_4 = ?,
                 monto_5 = ?,
                 monto_6 = ?,
                 erogado = ?,
                 pendiente_erogar = ?
             WHERE id_becado = ?`,
            [
                nombre, 
                apellido_p, 
                apellido_m, 
                estatus, 
                carrera, 
                id_universidad, 
                id_modalidad,
                monto_autorizado,
                monto_1,
                monto_2,
                monto_3,
                monto_4,
                monto_5,
                monto_6,
                erogado,
                pendiente_erogar,
                id
            ]
        );
        return result.affectedRows > 0;
    }

    // Eliminar becado
    static async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM becados WHERE id_becado = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Becado;