const express = require('express');
const router = express.Router();
const becadoController = require('../controllers/becadoController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateId } = require('../middleware/validationMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas adicionales
router.get('/resumen', becadoController.getResumen);
router.get('/universidad/:id_universidad', validateId, becadoController.getByUniversidad);
router.get('/modalidad/:id_modalidad', validateId, becadoController.getByModalidad);

// Rutas CRUD
router.post('/', becadoController.create);
router.get('/', becadoController.getAll);
router.get('/:id', validateId, becadoController.getById);
router.put('/:id', validateId, becadoController.update);
router.delete('/:id', validateId, becadoController.delete);

module.exports = router;