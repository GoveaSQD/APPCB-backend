const { pool } = require('../config/database');
const logger = require('../utils/logger');

class Becado {
    // Crear becado
    // Becado.js - Reemplazar método create
    static async create(data) {
    let connection;
    try {
        const {
            nombre, apellido_p, apellido_m, estatus, tipo_inactivo,
            carrera, id_universidad, id_modalidad, monto_autorizado,
            pagos = []  // ← NUEVO: array de pagos
        } = data;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Insertar becado
        const [result] = await connection.execute(
            `INSERT INTO becados (
                nombre, apellido_p, apellido_m, estatus, tipo_inactivo,
                carrera, id_universidad, id_modalidad, monto_autorizado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido_p, apellido_m, estatus || 1, tipo_inactivo || null,
             carrera || null, id_universidad || null, id_modalidad || null, monto_autorizado || 0]
        );

        const id_becado = result.insertId;

        // 2. Insertar pagos
        for (const pago of pagos) {
            await connection.execute(
                `INSERT INTO pagos_becados (id_becado, concepto, monto, fecha_pago)
                 VALUES (?, ?, ?, ?)`,
                [id_becado, pago.concepto || 'Pago', pago.monto || 0, pago.fecha_pago || new Date()]
            );
        }

        await connection.commit();
        
        // Calcular erogado total
        const erogado = pagos.reduce((sum, p) => sum + (p.monto || 0), 0);
        const pendiente = (monto_autorizado || 0) - erogado;
        
        // Actualizar erogado y pendiente en becados
        await connection.execute(
            `UPDATE becados SET erogado = ?, pendiente_erogar = ? WHERE id_becado = ?`,
            [erogado, pendiente, id_becado]
        );

        logger.debug('Becado creado con pagos', { id_becado, totalPagos: pagos.length });
        return id_becado;

    } catch (error) {
        if (connection) await connection.rollback();
        logger.error('Error en Becado.create:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

    // Obtener todos los becados con información relacionada
static async getAll(anio = null) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        let becadosQuery = `
            SELECT 
                b.*, 
                u.nombre as universidad_nombre,
                u.ciudad as universidad_ciudad,
                u.pais as universidad_pais,
                m.tipo as modalidad_tipo
            FROM becados b
            LEFT JOIN universidades u ON b.id_universidad = u.id_universidad
            LEFT JOIN modalidades m ON b.id_modalidad = m.id_modalidad
        `;
        
        if (anio) {
            becadosQuery += ` WHERE YEAR(b.fecha_creacion) = ?`;
        }
        
        becadosQuery += ` ORDER BY b.apellido_p, b.apellido_m, b.nombre`;
        
        const params = anio ? [anio] : [];
        const [becados] = await connection.execute(becadosQuery, params);
        
        // Obtener pagos para cada becado
        for (let becado of becados) {
            const [pagos] = await connection.execute(
                `SELECT id_pago, concepto, monto, fecha_pago 
                 FROM pagos_becados 
                 WHERE id_becado = ? 
                 ORDER BY fecha_pago`,
                [becado.id_becado]
            );
            becado.pagos = pagos;
            
            // Recalcular erogado desde los pagos
            const erogado = pagos.reduce((sum, p) => sum + (p.monto || 0), 0);
            becado.erogado = erogado;
            becado.pendiente_erogar = (becado.monto_autorizado || 0) - erogado;
        }
        
        return becados;

    } catch (error) {
        logger.error('Error en Becado.getAll:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// Becado.js - Reemplazar método findById
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
        
        if (rows[0]) {
            const [pagos] = await connection.execute(
                `SELECT id_pago, concepto, monto, fecha_pago 
                 FROM pagos_becados 
                 WHERE id_becado = ? 
                 ORDER BY fecha_pago`,
                [id]
            );
            rows[0].pagos = pagos;
            
            // Recalcular erogado
            const erogado = pagos.reduce((sum, p) => sum + (p.monto || 0), 0);
            rows[0].erogado = erogado;
            rows[0].pendiente_erogar = (rows[0].monto_autorizado || 0) - erogado;
        }
        
        return rows[0];

    } catch (error) {
        logger.error('Error en Becado.findById:', error);
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

    // Becado.js - Reemplazar método update
    static async update(id, data) {
        let connection;
        try {
            const {
                nombre, apellido_p, apellido_m, estatus, tipo_inactivo,
                carrera, id_universidad, id_modalidad, monto_autorizado,
                pagos = []
            } = data;

            connection = await pool.getConnection();
            await connection.beginTransaction();

            // 1. Actualizar datos del becado
            await connection.execute(
                `UPDATE becados 
                SET nombre = ?, apellido_p = ?, apellido_m = ?, 
                    estatus = ?, tipo_inactivo = ?, carrera = ?, 
                    id_universidad = ?, id_modalidad = ?, monto_autorizado = ?
                WHERE id_becado = ?`,
                [nombre, apellido_p, apellido_m, estatus || 1, tipo_inactivo || null,
                carrera || null, id_universidad || null, id_modalidad || null,
                monto_autorizado || 0, id]
            );

            // 2. Eliminar pagos antiguos
            await connection.execute(`DELETE FROM pagos_becados WHERE id_becado = ?`, [id]);

            // 3. Insertar pagos nuevos
            for (const pago of pagos) {
                await connection.execute(
                    `INSERT INTO pagos_becados (id_becado, concepto, monto, fecha_pago)
                    VALUES (?, ?, ?, ?)`,
                    [id, pago.concepto || 'Pago', pago.monto || 0, pago.fecha_pago || new Date()]
                );
            }

            // 4. Calcular y actualizar erogado
            const erogado = pagos.reduce((sum, p) => sum + (p.monto || 0), 0);
            const pendiente = (monto_autorizado || 0) - erogado;
            
            await connection.execute(
                `UPDATE becados SET erogado = ?, pendiente_erogar = ? WHERE id_becado = ?`,
                [erogado, pendiente, id]
            );

            await connection.commit();
            return true;

        } catch (error) {
            if (connection) await connection.rollback();
            logger.error('Error en Becado.update:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = Becado;