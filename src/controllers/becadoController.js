const Becado = require('../models/Becado');
const Universidad = require('../models/Universidad');
const Modalidad = require('../models/Modalidad');
const { successResponse, errorResponse } = require('../utils/responseHandler');

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
                id_modalidad 
            } = req.body;

            // Validar campos requeridos
            if (!nombre || !apellido_p || !carrera || !id_universidad || !id_modalidad) {
                return errorResponse(res, 'Faltan campos requeridos', 400);
            }

            // Verificar que la universidad existe
            const universidad = await Universidad.findById(id_universidad);
            if (!universidad) {
                return errorResponse(res, 'Universidad no encontrada', 404);
            }

            // Verificar que la modalidad existe
            const modalidad = await Modalidad.findById(id_modalidad);
            if (!modalidad) {
                return errorResponse(res, 'Modalidad no encontrada', 404);
            }

            const id = await Becado.create({
                nombre,
                apellido_p,
                apellido_m,
                estatus: estatus || 1,
                carrera,
                id_universidad,
                id_modalidad
            });

            const becado = await Becado.findById(id);
            successResponse(res, becado, 'Becado creado exitosamente', 201);

        } catch (error) {
            console.error('Error creando becado:', error);
            errorResponse(res, 'Error al crear becado');
        }
    },

    // Obtener todos los becados
    getAll: async (req, res) => {
        try {
            const becados = await Becado.getAll();
            successResponse(res, becados, 'Becados obtenidos exitosamente');
        } catch (error) {
            console.error('Error obteniendo becados:', error);
            errorResponse(res, 'Error al obtener becados');
        }
    },

    // Obtener becado por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const becado = await Becado.findById(id);

            if (!becado) {
                return errorResponse(res, 'Becado no encontrado', 404);
            }

            successResponse(res, becado, 'Becado obtenido exitosamente');
        } catch (error) {
            console.error('Error obteniendo becado:', error);
            errorResponse(res, 'Error al obtener becado');
        }
    },

    // Actualizar becado
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                nombre, 
                apellido_p, 
                apellido_m, 
                estatus, 
                carrera, 
                id_universidad, 
                id_modalidad 
            } = req.body;

            // Verificar si el becado existe
            const existingBecado = await Becado.findById(id);
            if (!existingBecado) {
                return errorResponse(res, 'Becado no encontrado', 404);
            }

            // Verificar que la universidad existe (si se está actualizando)
            if (id_universidad) {
                const universidad = await Universidad.findById(id_universidad);
                if (!universidad) {
                    return errorResponse(res, 'Universidad no encontrada', 404);
                }
            }

            // Verificar que la modalidad existe (si se está actualizando)
            if (id_modalidad) {
                const modalidad = await Modalidad.findById(id_modalidad);
                if (!modalidad) {
                    return errorResponse(res, 'Modalidad no encontrada', 404);
                }
            }

            const updated = await Becado.update(id, {
                nombre: nombre || existingBecado.nombre,
                apellido_p: apellido_p || existingBecado.apellido_p,
                apellido_m: apellido_m || existingBecado.apellido_m,
                estatus: estatus !== undefined ? estatus : existingBecado.estatus,
                carrera: carrera || existingBecado.carrera,
                id_universidad: id_universidad || existingBecado.id_universidad,
                id_modalidad: id_modalidad || existingBecado.id_modalidad
            });

            if (!updated) {
                return errorResponse(res, 'Error al actualizar becado', 400);
            }

            const becado = await Becado.findById(id);
            successResponse(res, becado, 'Becado actualizado exitosamente');

        } catch (error) {
            console.error('Error actualizando becado:', error);
            errorResponse(res, 'Error al actualizar becado');
        }
    },

    // Eliminar becado
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const existingBecado = await Becado.findById(id);
            if (!existingBecado) {
                return errorResponse(res, 'Becado no encontrado', 404);
            }

            const deleted = await Becado.delete(id);

            if (!deleted) {
                return errorResponse(res, 'Error al eliminar becado', 400);
            }

            successResponse(res, null, 'Becado eliminado exitosamente');

        } catch (error) {
            console.error('Error eliminando becado:', error);
            errorResponse(res, 'Error al eliminar becado');
        }
    }
};

module.exports = becadoController;