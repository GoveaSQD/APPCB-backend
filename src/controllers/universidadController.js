const Universidad = require('../models/Universidad');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const universidadController = {
    // Crear universidad
    create: async (req, res) => {
        try {
            const { nombre } = req.body;

            // Verificar datos requeridos
            if (!nombre) {
                return errorResponse(res, 'El nombre es requerido', 400);
            }

            const id = await Universidad.create({ nombre });
            const universidad = await Universidad.findById(id);

            successResponse(res, universidad, 'Universidad creada exitosamente', 201);

        } catch (error) {
            console.error('Error creando universidad:', error);
            
            // Manejar error de duplicado
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
            const { nombre } = req.body;

            if (!nombre) {
                return errorResponse(res, 'El nombre es requerido', 400);
            }

            // Verificar si la universidad existe
            const existingUniversidad = await Universidad.findById(id);
            if (!existingUniversidad) {
                return errorResponse(res, 'Universidad no encontrada', 404);
            }

            const updated = await Universidad.update(id, { nombre });

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

    // Eliminar universidad
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            // Verificar si la universidad existe
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
            
            // Manejar error de llave foránea
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return errorResponse(res, 'No se puede eliminar la universidad porque tiene becados asociados', 400);
            }
            
            errorResponse(res, 'Error al eliminar universidad');
        }
    }
};

module.exports = universidadController;