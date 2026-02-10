// Formato estándar para respuestas exitosas
const successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Formato estándar para respuestas de error
const errorResponse = (res, message = 'Error en la operación', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

module.exports = {
    successResponse,
    errorResponse
};