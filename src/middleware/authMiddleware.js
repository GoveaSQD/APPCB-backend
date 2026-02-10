const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado. Token no proporcionado.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Token inválido o expirado.'
            });
        }
        
        req.user = user;
        next();
    });
};

// Middleware para verificar roles (si se ocupa más adelante)
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado.'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción.'
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
};