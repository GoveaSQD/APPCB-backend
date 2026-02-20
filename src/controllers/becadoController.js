const Becado = require('../models/Becado');
const Universidad = require('../models/Universidad');
const Modalidad = require('../models/Modalidad');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');

const becadoController = {
    // Crear becado
    create: async (req, res) => {
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
            } = req.body;

            // Validar campos requeridos (según estructura NOT NULL)
            if (!nombre || !apellido_p) {
                return errorResponse(res, 'Nombre y apellido paterno son requeridos', 400);
            }

            // Validar que existan las relaciones si vienen
            if (id_universidad) {
                const universidad = await Universidad.findById(id_universidad);
                if (!universidad) {
                    return errorResponse(res, 'Universidad no encontrada', 404);
                }
            }

            if (id_modalidad) {
                const modalidad = await Modalidad.findById(id_modalidad);
                if (!modalidad) {
                    return errorResponse(res, 'Modalidad no encontrada', 404);
                }
            }

            // Preparar datos - la BD ya tiene defaults para los montos
            const becadoData = {
                nombre,
                apellido_p,
                apellido_m: apellido_m || null,
                estatus: estatus !== undefined ? estatus : 1,
                carrera: carrera || null,
                id_universidad: id_universidad || null,
                id_modalidad: id_modalidad || null,
                monto_autorizado: monto_autorizado || 0.00,
                monto_1: monto_1 || 0.00,
                monto_2: monto_2 || 0.00,
                monto_3: monto_3 || 0.00,
                monto_4: monto_4 || 0.00,
                monto_5: monto_5 || 0.00,
                monto_6: monto_6 || 0.00,
                erogado: erogado || 0.00,
                pendiente_erogar: pendiente_erogar || 0.00
            };

            logger.info('Creando nuevo becado', { 
                nombre: becadoData.nombre,
                apellido_p: becadoData.apellido_p,
                carrera: becadoData.carrera 
            });

            const nuevoId = await Becado.create(becadoData);
            const becado = await Becado.findById(nuevoId);
            
            successResponse(res, becado, 'Becado creado exitosamente', 201);

        } catch (error) {
            logger.error('Error creando becado:', error);
            errorResponse(res, 'Error al crear becado: ' + error.message);
        }
    },

    // Obtener todos los becados
    getAll: async (req, res) => {
        try {
            logger.info('Obteniendo todos los becados');
            const becados = await Becado.getAll();
            successResponse(res, becados, 'Becados obtenidos exitosamente');
        } catch (error) {
            logger.error('Error obteniendo becados:', error);
            errorResponse(res, 'Error al obtener becados');
        }
    },

    // Obtener becado por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            logger.debug('Buscando becado por ID', { id });

            const becado = await Becado.findById(id);

            if (!becado) {
                logger.warn('Becado no encontrado', { id });
                return errorResponse(res, 'Becado no encontrado', 404);
            }

            successResponse(res, becado, 'Becado obtenido exitosamente');
        } catch (error) {
            logger.error('Error obteniendo becado:', error);
            errorResponse(res, 'Error al obtener becado');
        }
    },

    // Actualizar becado
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            logger.info('Actualizando becado', { id });

            // Verificar si el becado existe
            const existingBecado = await Becado.findById(id);
            if (!existingBecado) {
                logger.warn('Becado no encontrado para actualizar', { id });
                return errorResponse(res, 'Becado no encontrado', 404);
            }

            // Verificar relaciones si vienen en la actualización
            if (updateData.id_universidad) {
                const universidad = await Universidad.findById(updateData.id_universidad);
                if (!universidad) {
                    return errorResponse(res, 'Universidad no encontrada', 404);
                }
            }

            if (updateData.id_modalidad) {
                const modalidad = await Modalidad.findById(updateData.id_modalidad);
                if (!modalidad) {
                    return errorResponse(res, 'Modalidad no encontrada', 404);
                }
            }

            const updated = await Becado.update(id, updateData);

            if (!updated) {
                logger.error('Error al actualizar becado', { id });
                return errorResponse(res, 'Error al actualizar becado', 400);
            }

            const becado = await Becado.findById(id);
            logger.info('Becado actualizado exitosamente', { id });
            successResponse(res, becado, 'Becado actualizado exitosamente');

        } catch (error) {
            logger.error('Error actualizando becado:', error);
            errorResponse(res, 'Error al actualizar becado: ' + error.message);
        }
    },

    // Eliminar becado
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            logger.info('Eliminando becado', { id });

            const existingBecado = await Becado.findById(id);
            if (!existingBecado) {
                logger.warn('Becado no encontrado para eliminar', { id });
                return errorResponse(res, 'Becado no encontrado', 404);
            }

            const deleted = await Becado.delete(id);

            if (!deleted) {
                logger.error('Error al eliminar becado', { id });
                return errorResponse(res, 'Error al eliminar becado', 400);
            }

            logger.info('Becado eliminado exitosamente', { id });
            successResponse(res, null, 'Becado eliminado exitosamente');

        } catch (error) {
            logger.error('Error eliminando becado:', error);
            
            // Verificar si es error de clave foránea
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return errorResponse(res, 'No se puede eliminar el becado porque tiene registros asociados', 400);
            }
            
            errorResponse(res, 'Error al eliminar becado: ' + error.message);
        }
    },

    // Método adicional: Obtener resumen estadístico
    getResumen: async (req, res) => {
        try {
            logger.info('Obteniendo resumen estadístico de becados');
            const resumen = await Becado.getResumenEstadistico();
            successResponse(res, resumen, 'Resumen obtenido exitosamente');
        } catch (error) {
            logger.error('Error obteniendo resumen:', error);
            errorResponse(res, 'Error al obtener resumen');
        }
    },

    // Método adicional: Buscar por universidad
    getByUniversidad: async (req, res) => {
        try {
            const { id_universidad } = req.params;
            logger.info('Buscando becados por universidad', { id_universidad });
            
            const becados = await Becado.findByUniversidad(id_universidad);
            successResponse(res, becados, 'Becados obtenidos exitosamente');
        } catch (error) {
            logger.error('Error buscando por universidad:', error);
            errorResponse(res, 'Error al buscar becados');
        }
    },

    // Método adicional: Buscar por modalidad
    getByModalidad: async (req, res) => {
        try {
            const { id_modalidad } = req.params;
            logger.info('Buscando becados por modalidad', { id_modalidad });
            
            const becados = await Becado.findByModalidad(id_modalidad);
            successResponse(res, becados, 'Becados obtenidos exitosamente');
        } catch (error) {
            logger.error('Error buscando por modalidad:', error);
            errorResponse(res, 'Error al buscar becados');
        }
    }
};

module.exports = becadoController;