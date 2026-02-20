const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Niveles de log
const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

class Logger {
    constructor() {
        this.logFile = path.join(logsDir, `app-${this.getFormattedDate()}.log`);
        this.errorFile = path.join(logsDir, `error-${this.getFormattedDate()}.log`);
    }

    getFormattedDate() {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    getFormattedTime() {
        return new Date().toLocaleTimeString('es-MX', { hour12: false });
    }

    async writeToFile(filePath, message) {
        try {
            fs.appendFileSync(filePath, message + '\n');
        } catch (error) {
            console.error('Error escribiendo al archivo de log:', error.message);
        }
    }

    formatMessage(level, message, data = null) {
        const timestamp = this.getTimestamp();
        const logEntry = {
            timestamp,
            level,
            message,
            ...(data && { data })
        };
        return JSON.stringify(logEntry);
    }

    formatConsoleMessage(level, message, data = null) {
        const time = this.getFormattedTime();
        const colors = {
            ERROR: '\x1b[31m', // Rojo
            WARN: '\x1b[33m',  // Amarillo
            INFO: '\x1b[36m',  // Cian
            DEBUG: '\x1b[32m', // Verde
            RESET: '\x1b[0m'   // Reset
        };

        let consoleMsg = `${colors[level]}[${time}] [${level}]${colors.RESET} ${message}`;
        
        if (data) {
            if (data instanceof Error) {
                consoleMsg += `\n${colors.ERROR}Stack: ${data.stack}${colors.RESET}`;
            } else if (typeof data === 'object') {
                try {
                    consoleMsg += `\n${JSON.stringify(data, null, 2)}`;
                } catch (e) {
                    consoleMsg += ` [Object no serializable]`;
                }
            } else {
                consoleMsg += ` ${data}`;
            }
        }
        
        return consoleMsg;
    }

    log(level, message, data = null) {
        const logMessage = this.formatMessage(level, message, data);
        const consoleMessage = this.formatConsoleMessage(level, message, data);

        // Mostrar en consola
        console.log(consoleMessage);

        // Guardar en archivo según el nivel
        if (level === LOG_LEVELS.ERROR) {
            this.writeToFile(this.errorFile, logMessage);
        }
        this.writeToFile(this.logFile, logMessage);
    }

    error(message, error = null) {
        this.log(LOG_LEVELS.ERROR, message, error);
    }

    warn(message, data = null) {
        this.log(LOG_LEVELS.WARN, message, data);
    }

    info(message, data = null) {
        this.log(LOG_LEVELS.INFO, message, data);
    }

    debug(message, data = null) {
        if (process.env.NODE_ENV === 'development') {
            this.log(LOG_LEVELS.DEBUG, message, data);
        }
    }

    // Middleware para Express
    middleware() {
        return (req, res, next) => {
            const start = Date.now();
            
            // Log de la solicitud entrante
            this.info(`${req.method} ${req.url} - Solicitud recibida`, {
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.get('user-agent'),
                query: req.query,
                params: req.params,
                user: req.user?.id
            });

            // Guardar referencia al método json original
            const originalJson = res.json;
            
            // Sobrescribir el método json
            res.json = (data) => {
                const duration = Date.now() - start;
                
                // Log de la respuesta
                this.info(`${req.method} ${req.url} - Respuesta enviada`, {
                    statusCode: res.statusCode,
                    duration: `${duration}ms`,
                    success: data?.success
                });

                return originalJson.call(this, data);
            };

            next();
        };
    }
}

// Crear instancia única
const logger = new Logger();

module.exports = logger;