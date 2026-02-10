const express = require('express');
const router = express.Router();
const universidadController = require('../controllers/universidadController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateId } = require('../middleware/validationMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD
router.post('/', universidadController.create);
router.get('/', universidadController.getAll);
router.get('/:id', validateId, universidadController.getById);
router.put('/:id', validateId, universidadController.update);
router.delete('/:id', validateId, universidadController.delete);

module.exports = router;