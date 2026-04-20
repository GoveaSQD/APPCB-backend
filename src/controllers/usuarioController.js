const Usuario = require('../models/Usuario');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { hashPassword } = require('../utils/passwordUtils'); // Usar tu utilitario

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
            const { nombre, ap_paterno, ap_materno, email, tipo_usuario, password } = req.body;

            console.log('=== ACTUALIZANDO USUARIO ===');
            console.log('ID:', id);
            console.log('Datos recibidos:', { 
                nombre, 
                ap_paterno, 
                ap_materno, 
                email, 
                tipo_usuario, 
                password: password ? '***' : 'no' 
            });

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

            const updateData = {
                nombre,
                ap_paterno: ap_paterno || null,
                ap_materno: ap_materno || null,
                email,
                tipo_usuario: parseInt(tipo_usuario)
            };

            if (password && password.trim() !== '') {
                updateData.password = await hashPassword(password);
                console.log('Actualizando contraseña');
            }

            console.log('Datos a actualizar en BD:', updateData);

            const updated = await Usuario.update(id, updateData);

            if (!updated) {
                return errorResponse(res, 'Error al actualizar usuario', 400);
            }

            // Obtener usuario actualizado
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