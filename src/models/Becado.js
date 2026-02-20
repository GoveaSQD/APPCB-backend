const { pool } = require('../config/database');
const logger = require('../utils/logger');

class Becado {
    // Crear becado
    static async create(data) {
        let connection;
        try {
            const {
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
            } = data;

            // Valores por defecto basados en la estructura de la tabla
            const values = [
                nombre,                                     // NOT NULL
                apellido_p,                                 // NOT NULL
                apellido_m || null,                         // DEFAULT NULL
                estatus !== undefined ? estatus : 1,        // DEFAULT '1'
                carrera || null,                             // DEFAULT NULL
                id_universidad || null,                      // DEFAULT NULL
                id_modalidad || null,                        // DEFAULT NULL
                monto_autorizado !== undefined ? monto_autorizado : 0.00,  // DEFAULT '0.00'
                monto_1 !== undefined ? monto_1 : 0.00,                    // DEFAULT '0.00'
                monto_2 !== undefined ? monto_2 : 0.00,                    // DEFAULT '0.00'
                monto_3 !== undefined ? monto_3 : 0.00,                    // DEFAULT '0.00'
                monto_4 !== undefined ? monto_4 : 0.00,                    // DEFAULT '0.00'
                monto_5 !== undefined ? monto_5 : 0.00,                    // DEFAULT '0.00'
                monto_6 !== undefined ? monto_6 : 0.00,                    // DEFAULT '0.00'
                erogado !== undefined ? erogado : 0.00,                    // DEFAULT '0.00'
                pendiente_erogar !== undefined ? pendiente_erogar : 0.00   // DEFAULT '0.00'
            ];

            // Verificar campos requeridos (NOT NULL)
            if (!values[0] || !values[1]) {
                throw new Error('Nombre y apellido paterno son campos requeridos');
            }

            connection = await pool.getConnection();
            
            const [result] = await connection.execute(
                `INSERT INTO becados (
                    nombre, apellido_p, apellido_m, estatus, carrera, 
                    id_universidad, id_modalidad, monto_autorizado,
                    monto_1, monto_2, monto_3, monto_4, monto_5, monto_6,
                    erogado, pendiente_erogar
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                values
            );
            
            logger.debug('Becado creado en BD', { 
                insertId: result.insertId,
                nombre,
                apellido_p 
            });
            
            return result.insertId;

        } catch (error) {
            logger.error('Error en Becado.create:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Obtener todos los becados con información relacionada
    static async getAll() {
        let connection;
        try {
            connection = await pool.getConnection();
            
            const [rows] = await connection.execute(`
                SELECT 
                    b.*, 
                    u.nombre as universidad_nombre,
                    u.ciudad as universidad_ciudad,
                    u.pais as universidad_pais,
                    m.tipo as modalidad_tipo
                FROM becados b
                LEFT JOIN universidades u ON b.id_universidad = u.id_universidad
                LEFT JOIN modalidades m ON b.id_modalidad = m.id_modalidad
                ORDER BY b.apellido_p, b.apellido_m, b.nombre
            `);
            
            logger.debug('Becados obtenidos de BD', { count: rows.length });
            return rows;

        } catch (error) {
            logger.error('Error en Becado.getAll:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Obtener becado por ID
    static async findById(id) {
        let connection;
        try {
            connection = await pool.getConnection();
            
            const [rows] = await connection.execute(`
                SELECT 
                    b.*, 
                    u.nombre as universidad_nombre,
                    u.ciudad as universidad_ciudad,
                    u.pais as universidad_pais,
                    m.tipo as modalidad_tipo
                FROM becados b
                LEFT JOIN universidades u ON b.id_universidad = u.id_universidad
                LEFT JOIN modalidades m ON b.id_modalidad = m.id_modalidad
                WHERE b.id_becado = ?
            `, [id]);
            
            logger.debug('Becado obtenido por ID', { id, found: rows.length > 0 });
            return rows[0];

        } catch (error) {
            logger.error('Error en Becado.findById:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Actualizar becado
    static async update(id, data) {
        let connection;
        try {
            const {
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
            } = data;

            const values = [
                nombre,                                     // NOT NULL
                apellido_p,                                 // NOT NULL
                apellido_m !== undefined ? apellido_m : null,
                estatus !== undefined ? estatus : 1,
                carrera !== undefined ? carrera : null,
                id_universidad !== undefined ? id_universidad : null,
                id_modalidad !== undefined ? id_modalidad : null,
                monto_autorizado !== undefined ? monto_autorizado : 0.00,
                monto_1 !== undefined ? monto_1 : 0.00,
                monto_2 !== undefined ? monto_2 : 0.00,
                monto_3 !== undefined ? monto_3 : 0.00,
                monto_4 !== undefined ? monto_4 : 0.00,
                monto_5 !== undefined ? monto_5 : 0.00,
                monto_6 !== undefined ? monto_6 : 0.00,
                erogado !== undefined ? erogado : 0.00,
                pendiente_erogar !== undefined ? pendiente_erogar : 0.00,
                id
            ];

            connection = await pool.getConnection();
            
            const [result] = await connection.execute(
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
                values
            );
            
            logger.debug('Becado actualizado en BD', { 
                id, 
                affectedRows: result.affectedRows 
            });
            
            return result.affectedRows > 0;

        } catch (error) {
            logger.error('Error en Becado.update:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Eliminar becado
    static async delete(id) {
        let connection;
        try {
            connection = await pool.getConnection();
            
            const [result] = await connection.execute(
                'DELETE FROM becados WHERE id_becado = ?',
                [id]
            );
            
            logger.debug('Becado eliminado de BD', { 
                id, 
                affectedRows: result.affectedRows 
            });
            
            return result.affectedRows > 0;

        } catch (error) {
            logger.error('Error en Becado.delete:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Métodos adicionales útiles
    static async findByUniversidad(universidadId) {
        let connection;
        try {
            connection = await pool.getConnection();
            
            const [rows] = await connection.execute(
                `SELECT b.*, m.tipo as modalidad_tipo
                 FROM becados b
                 LEFT JOIN modalidades m ON b.id_modalidad = m.id_modalidad
                 WHERE b.id_universidad = ?
                 ORDER BY b.apellido_p, b.apellido_m, b.nombre`,
                [universidadId]
            );
            
            return rows;

        } catch (error) {
            logger.error('Error en Becado.findByUniversidad:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async findByModalidad(modalidadId) {
        let connection;
        try {
            connection = await pool.getConnection();
            
            const [rows] = await connection.execute(
                `SELECT b.*, u.nombre as universidad_nombre
                 FROM becados b
                 LEFT JOIN universidades u ON b.id_universidad = u.id_universidad
                 WHERE b.id_modalidad = ?
                 ORDER BY b.apellido_p, b.apellido_m, b.nombre`,
                [modalidadId]
            );
            
            return rows;

        } catch (error) {
            logger.error('Error en Becado.findByModalidad:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getResumenEstadistico() {
        let connection;
        try {
            connection = await pool.getConnection();
            
            const [rows] = await connection.execute(`
                SELECT 
                    COUNT(*) as total_becados,
                    SUM(CASE WHEN estatus = 1 THEN 1 ELSE 0 END) as activos,
                    SUM(CASE WHEN estatus = 0 THEN 1 ELSE 0 END) as inactivos,
                    COALESCE(SUM(monto_autorizado), 0) as total_autorizado,
                    COALESCE(SUM(erogado), 0) as total_erogado,
                    COALESCE(SUM(pendiente_erogar), 0) as total_pendiente,
                    COALESCE(AVG(monto_autorizado), 0) as promedio_autorizado
                FROM becados
            `);
            
            return rows[0];

        } catch (error) {
            logger.error('Error en Becado.getResumenEstadistico:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = Becado;