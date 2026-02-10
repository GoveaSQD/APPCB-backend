const Usuario = require('../models/Usuario');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const usuarioController = {
    // Obtener todos los usuarios
    getAll: async (req, res) => {
        try {
            const usuarios = await Usuario.getAll();
            successResponse(res, usuarios, 'Usuarios obtenidos exitosamente');
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            errorResponse(res, 'Error al obtener usuarios');
        }
    },

    // Obtener usuario por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findById(id);

            if (!usuario) {
                return errorResponse(res, 'Usuario no encontrado', 404);
            }

            successResponse(res, usuario, 'Usuario obtenido exitosamente');
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            errorResponse(res, 'Error al obtener usuario');
        }
    },

    // Actualizar usuario
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, email } = req.body;

            // Verificar si el usuario existe
            const existingUser = await Usuario.findById(id);
            if (!existingUser) {
                return errorResponse(res, 'Usuario no encontrado', 404);
            }

            // Verificar si el email ya está en uso por otro usuario
            const userByEmail = await Usuario.findByEmail(email);
            if (userByEmail && userByEmail.id_usuario !== parseInt(id)) {
                return errorResponse(res, 'El email ya está en uso', 400);
            }

            const updated = await Usuario.update(id, { nombre, email });

            if (!updated) {
                return errorResponse(res, 'Error al actualizar usuario', 400);
            }

            const usuario = await Usuario.findById(id);
            successResponse(res, usuario, 'Usuario actualizado exitosamente');

        } catch (error) {
            console.error('Error actualizando usuario:', error);
            errorResponse(res, 'Error al actualizar usuario');
        }
    },

    // Eliminar usuario
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            // Verificar si el usuario existe
            const existingUser = await Usuario.findById(id);
            if (!existingUser) {
                return errorResponse(res, 'Usuario no encontrado', 404);
            }

            const deleted = await Usuario.delete(id);

            if (!deleted) {
                return errorResponse(res, 'Error al eliminar usuario', 400);
            }

            successResponse(res, null, 'Usuario eliminado exitosamente');

        } catch (error) {
            console.error('Error eliminando usuario:', error);
            errorResponse(res, 'Error al eliminar usuario');
        }
    }
};

module.exports = usuarioController;