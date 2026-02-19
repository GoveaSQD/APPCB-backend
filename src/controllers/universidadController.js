const Universidad = require('../models/Universidad');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const universidadController = {
    // Crear universidad
    create: async (req, res) => {
        try {
            const { nombre, ciudad, pais, estado, estatus } = req.body;

            // Verificar datos requeridos
            if (!nombre || !ciudad || !pais) {
                return errorResponse(res, 'Nombre, ciudad y país son requeridos', 400);
            }

            // Validar que estatus sea 1, 0
            if (estatus !== undefined && ![1, 0].includes(estatus)) {
                return errorResponse(res, 'Estatus debe ser 1, 0', 400);
            }

            const id = await Universidad.create({ 
                nombre, 
                ciudad, 
                pais, 
                estado: estado || null,
                estatus: estatus || 1 // Por defecto 1 (activa)
            });
            
            const universidad = await Universidad.findById(id);
            successResponse(res, universidad, 'Universidad creada exitosamente', 201);

        } catch (error) {
            console.error('Error creando universidad:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return errorResponse(res, 'La universidad ya existe', 400);
            }
            
            errorResponse(res, 'Error al crear universidad');
        }
    },

    // Obtener todas las universidades
    getAll: async (req, res) => {
        try {
            const universidades = await Universidad.getAll();
            successResponse(res, universidades, 'Universidades obtenidas exitosamente');
        } catch (error) {
            console.error('Error obteniendo universidades:', error);
            errorResponse(res, 'Error al obtener universidades');
        }
    },

    // Obtener universidades por estatus (1, 0)
    getByEstatus: async (req, res) => {
        try {
            const { estatus } = req.params;
            const estatusNum = parseInt(estatus);
            
            // Validar que sea 1, 0
            if (![1, 2, 3].includes(estatusNum)) {
                return errorResponse(res, 'Estatus debe ser 1, 0', 400);
            }

            const universidades = await Universidad.getByEstatus(estatusNum);
            successResponse(res, universidades, `Universidades con estatus ${estatusNum} obtenidas`);
        } catch (error) {
            console.error('Error obteniendo universidades por estatus:', error);
            errorResponse(res, 'Error al obtener universidades');
        }
    },

    // Obtener universidad por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const universidad = await Universidad.findById(id);

            if (!universidad) {
                return errorResponse(res, 'Universidad no encontrada', 404);
            }

            successResponse(res, universidad, 'Universidad obtenida exitosamente');
        } catch (error) {
            console.error('Error obteniendo universidad:', error);
            errorResponse(res, 'Error al obtener universidad');
        }
    },

    // Actualizar universidad
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, ciudad, pais, estado, estatus } = req.body;

            if (!nombre || !ciudad || !pais) {
                return errorResponse(res, 'Nombre, ciudad y país son requeridos', 400);
            }

            // Validar que estatus sea 1, 0
            if (estatus !== undefined && ![1, 2, 3].includes(estatus)) {
                return errorResponse(res, 'Estatus debe ser 1, 0', 400);
            }

            // Verificar si la universidad existe
            const existingUniversidad = await Universidad.findById(id);
            if (!existingUniversidad) {
                return errorResponse(res, 'Universidad no encontrada', 404);
            }

            const updated = await Universidad.update(id, { 
                nombre, 
                ciudad, 
                pais, 
                estado: estado || null,
                estatus: estatus !== undefined ? estatus : existingUniversidad.estatus
            });

            if (!updated) {
                return errorResponse(res, 'Error al actualizar universidad', 400);
            }

            const universidad = await Universidad.findById(id);
            successResponse(res, universidad, 'Universidad actualizada exitosamente');

        } catch (error) {
            console.error('Error actualizando universidad:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return errorResponse(res, 'El nombre de universidad ya existe', 400);
            }
            
            errorResponse(res, 'Error al actualizar universidad');
        }
    },

    // Cambiar estatus (solo número)
    cambiarEstatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { estatus } = req.body;

            // Validar que estatus sea 1, 0
            if (!estatus || ![1, 0].includes(estatus)) {
                return errorResponse(res, 'Estatus debe ser 1, 0', 400);
            }

            // Verificar si la universidad existe
            const existingUniversidad = await Universidad.findById(id);
            if (!existingUniversidad) {
                return errorResponse(res, 'Universidad no encontrada', 404);
            }

            const cambiado = await Universidad.cambiarEstatus(id, estatus);

            if (!cambiado) {
                return errorResponse(res, 'Error al cambiar estatus', 400);
            }

            const universidad = await Universidad.findById(id);
            successResponse(res, universidad, 'Estatus actualizado exitosamente');

        } catch (error) {
            console.error('Error cambiando estatus:', error);
            errorResponse(res, 'Error al cambiar estatus');
        }
    },

    // Eliminar universidad
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const existingUniversidad = await Universidad.findById(id);
            if (!existingUniversidad) {
                return errorResponse(res, 'Universidad no encontrada', 404);
            }

            const deleted = await Universidad.delete(id);

            if (!deleted) {
                return errorResponse(res, 'Error al eliminar universidad', 400);
            }

            successResponse(res, null, 'Universidad eliminada exitosamente');

        } catch (error) {
            console.error('Error eliminando universidad:', error);
            
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return errorResponse(res, 'No se puede eliminar la universidad porque tiene becados asociados', 400);
            }
            
            errorResponse(res, 'Error al eliminar universidad');
        }
    }
};

module.exports = universidadController;