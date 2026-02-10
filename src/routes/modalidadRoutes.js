const express = require('express');
const router = express.Router();
const modalidadController = require('../controllers/modalidadController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateId } = require('../middleware/validationMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD
router.post('/', modalidadController.create);
router.get('/', modalidadController.getAll);
router.get('/:id', validateId, modalidadController.getById);
router.put('/:id', validateId, modalidadController.update);
router.delete('/:id', validateId, modalidadController.delete);

module.exports = router;