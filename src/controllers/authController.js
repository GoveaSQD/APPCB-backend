const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { successResponse, errorResponse } = require('../utils/responseHandler');
require('dotenv').config();

const authController = {
    // Registrar nuevo usuario
    register: async (req, res) => {
        try {
            const { nombre, ap_paterno, ap_materno, email, password, tipo_usuario } = req.body;

            console.log('Registrando usuario:', { nombre, ap_paterno, ap_materno, email, tipo_usuario });

            // Verificar si el usuario ya existe
            const existingUser = await Usuario.findByEmail(email);
            if (existingUser) {
                return errorResponse(res, 'El email ya está registrado', 400);
            }

            // Encriptar contraseña usando passwordUtils
            const hashedPassword = await hashPassword(password);

            // Crear usuario con todos los campos
            const userId = await Usuario.create({
                nombre,
                ap_paterno: ap_paterno || null,
                ap_materno: ap_materno || null,
                email,
                password: hashedPassword,
                tipo_usuario: tipo_usuario || 2
            });

            // Crear token JWT
            const token = jwt.sign(
                { id: userId, email, tipo_usuario: tipo_usuario || 2 },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Obtener datos del usuario sin contraseña
            const user = await Usuario.findById(userId);

            successResponse(res, {
                user,
                token
            }, 'Usuario registrado exitosamente', 201);

        } catch (error) {
            console.error('Error en registro:', error);
            errorResponse(res, 'Error al registrar usuario');
        }
    },

    // Login de usuario
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const user = await Usuario.findByEmail(email);
            if (!user) {
                return errorResponse(res, 'Credenciales inválidas', 401);
            }

            const validPassword = await comparePassword(password, user.password);
            if (!validPassword) {
                return errorResponse(res, 'Credenciales inválidas', 401);
            }

            // Crear token JWT
            const token = jwt.sign(
                { 
                    id: user.id_usuario, 
                    email: user.email,
                    nombre: user.nombre,
                    tipo_usuario: user.tipo_usuario
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Remover contraseña de la respuesta
            const { password: _, ...userWithoutPassword } = user;

            successResponse(res, {
                user: userWithoutPassword,
                token
            }, 'Login exitoso');

        } catch (error) {
            console.error('Error en login:', error);
            errorResponse(res, 'Error al iniciar sesión');
        }
    },

    // Obtener perfil de usuario actual
    getProfile: async (req, res) => {
        try {
            const user = await Usuario.findById(req.user.id);
            
            if (!user) {
                return errorResponse(res, 'Usuario no encontrado', 404);
            }

            successResponse(res, user, 'Perfil obtenido exitosamente');

        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            errorResponse(res, 'Error al obtener perfil');
        }
    }
};

module.exports = authController;