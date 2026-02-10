const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateId } = require('../middleware/validationMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD
router.get('/', usuarioController.getAll);
router.get('/:id', validateId, usuarioController.getById);
router.put('/:id', validateId, usuarioController.update);
router.delete('/:id', validateId, usuarioController.delete);

module.exports = router;