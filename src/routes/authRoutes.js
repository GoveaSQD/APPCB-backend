const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;