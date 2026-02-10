const Modalidad = require('../models/Modalidad');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const modalidadController = {
    // Crear modalidad
    create: async (req, res) => {
        try {
            const { tipo } = req.body;

            if (!tipo) {
                return errorResponse(res, 'El tipo es requerido', 400);
            }

            const id = await Modalidad.create({ tipo });
            const modalidad = await Modalidad.findById(id);

            successResponse(res, modalidad, 'Modalidad creada exitosamente', 201);

        } catch (error) {
            console.error('Error creando modalidad:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return errorResponse(res, 'La modalidad ya existe', 400);
            }
            
            errorResponse(res, 'Error al crear modalidad');
        }
    },

    // Obtener todas las modalidades
    getAll: async (req, res) => {
        try {
            const modalidades = await Modalidad.getAll();
            successResponse(res, modalidades, 'Modalidades obtenidas exitosamente');
        } catch (error) {
            console.error('Error obteniendo modalidades:', error);
            errorResponse(res, 'Error al obtener modalidades');
        }
    },

    // Obtener modalidad por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const modalidad = await Modalidad.findById(id);

            if (!modalidad) {
                return errorResponse(res, 'Modalidad no encontrada', 404);
            }

            successResponse(res, modalidad, 'Modalidad obtenida exitosamente');
        } catch (error) {
            console.error('Error obteniendo modalidad:', error);
            errorResponse(res, 'Error al obtener modalidad');
        }
    },

    // Actualizar modalidad
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { tipo } = req.body;

            if (!tipo) {
                return errorResponse(res, 'El tipo es requerido', 400);
            }

            const existingModalidad = await Modalidad.findById(id);
            if (!existingModalidad) {
                return errorResponse(res, 'Modalidad no encontrada', 404);
            }

            const updated = await Modalidad.update(id, { tipo });

            if (!updated) {
                return errorResponse(res, 'Error al actualizar modalidad', 400);
            }

            const modalidad = await Modalidad.findById(id);
            successResponse(res, modalidad, 'Modalidad actualizada exitosamente');

        } catch (error) {
            console.error('Error actualizando modalidad:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return errorResponse(res, 'El tipo de modalidad ya existe', 400);
            }
            
            errorResponse(res, 'Error al actualizar modalidad');
        }
    },

    // Eliminar modalidad
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const existingModalidad = await Modalidad.findById(id);
            if (!existingModalidad) {
                return errorResponse(res, 'Modalidad no encontrada', 404);
            }

            const deleted = await Modalidad.delete(id);

            if (!deleted) {
                return errorResponse(res, 'Error al eliminar modalidad', 400);
            }

            successResponse(res, null, 'Modalidad eliminada exitosamente');

        } catch (error) {
            console.error('Error eliminando modalidad:', error);
            
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return errorResponse(res, 'No se puede eliminar la modalidad porque tiene becados asociados', 400);
            }
            
            errorResponse(res, 'Error al eliminar modalidad');
        }
    }
};

module.exports = modalidadController;