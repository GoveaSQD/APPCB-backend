// Middleware de validación básica
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        next();
    };
};

// Validación de ID en parámetros
const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'ID inválido'
        });
    }
    
    req.params.id = id;
    next();
};

module.exports = {
    validateRequest,
    validateId
};