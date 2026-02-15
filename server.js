const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT;

// Colores para la terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
    
    // Foreground colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    
    // Background colors
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
};

const asciiArt2 = `
${colors.magenta}┌──────────────────────────────────────────────────────────────────┐
│${colors.white}   ██████╗     ███╗   ███╗    ███████╗    ██╗   ██╗    ███████╗   ${colors.white}│
│${colors.white}  ██╔════╝     ████╗ ████║    ██╔════╝    ╚██╗ ██╔╝    ██╔════╝   ${colors.white}│
│${colors.white}  ██║  ███╗    ██╔████╔██║    ███████╗     ╚████╔╝     ███████╗   ${colors.white}│
│${colors.white}  ██║   ██║    ██║╚██╔╝██║    ╚════██║      ╚██╔╝      ╚════██║   ${colors.white}│
│${colors.white}  ╚██████╔╝    ██║ ╚═╝ ██║    ███████║       ██║       ███████║   ${colors.white}│
│${colors.white}   ╚═════╝     ╚═╝     ╚═╝    ╚══════╝       ╚═╝       ╚══════╝   ${colors.white}│
└──────────────────░▒▓█ G O M A R T  S Y S █▓▒░────────────────────┘${colors.reset}`;

const asciiArt = `
${colors.blue}┌────────────────────────────────────────────────────────┐
${colors.blue}│                                                        │
${colors.blue}│    ______    _______    _______    __   __    _______  │
${colors.cyan}│   |  ____    |  |  |    |______      \\_/      |______  │
${colors.green}│   |_____|    |  |  |    ______|       |       ______|  │
${colors.green}│                                                        │
└─────────────░▒▓█ G O M A R T  S Y S █▓▒░───────────────┘${colors.reset}`;


// Función para crear una barra de progreso visual
const createProgressBar = (percentage = 100, length = 30) => {
    const filled = Math.round((percentage / 100) * length);
    const empty = length - filled;
    return `${colors.green}█${colors.reset}`.repeat(filled) + `${colors.red}░${colors.reset}`.repeat(empty);
};

// Función para centrar texto
const centerText = (text, width = 60) => {
    const padding = Math.max(0, width - text.length);
    const leftPadding = Math.floor(padding / 2);
    const rightPadding = padding - leftPadding;
    return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
};

// Función para crear una línea decorativa
const decorativeLine = (char = '═', color = colors.cyan, length = 60) => {
    return color + char.repeat(length) + colors.reset;
};

// Función para formatear el tiempo de inicio
const formatUptime = () => {
    const now = new Date();
    return `${colors.yellow}${now.toLocaleDateString()} ${colors.green}${now.toLocaleTimeString()}${colors.reset}`;
};

// Función para iniciar el servidor
const startServer = () => {
    console.clear();
    
    // Header con animación de carga
    console.log(`
${colors.magenta}${'╔' + '═'.repeat(58) + '╗'}${colors.reset}`);
    console.log(`${colors.magenta}║${colors.reset}${centerText(`${colors.bright}${colors.cyan}API SERVER INICIALIZADO${colors.reset}`, 58)}${colors.magenta}║${colors.reset}`);
    console.log(`${colors.magenta}║${colors.reset}${centerText(`${colors.yellow}${new Date().toLocaleString()}${colors.reset}`, 58)}${colors.magenta}║${colors.reset}`);
    console.log(`${colors.magenta}${'╚' + '═'.repeat(58) + '╝'}${colors.reset}`);
    
    // Mostrar arte ASCII
    console.log(asciiArt);
    
    // Información del servidor
    console.log(`
${colors.bright}${colors.cyan}INFORMACIÓN DEL SERVIDOR${colors.reset}
${decorativeLine('━', colors.cyan)}
${colors.white}➤ ${colors.yellow}ESTADO:${colors.reset}   ${colors.green}ACTIVO${colors.reset}
${colors.white}➤ ${colors.yellow}PUERTO:${colors.reset}   ${colors.magenta}${PORT}${colors.reset}
${colors.white}➤ ${colors.yellow}ENTORNO:${colors.reset}  ${colors.blue}${process.env.NODE_ENV || 'development'}${colors.reset}
${colors.white}➤ ${colors.yellow}INICIO:${colors.reset}   ${formatUptime()}
${colors.white}➤ ${colors.yellow}MEMORIA:${colors.reset}  ${colors.cyan}${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB${colors.reset}
${decorativeLine('─', colors.dim)}`);

    // Barra de carga visual
    console.log(`
${colors.bright}${colors.cyan}INICIALIZANDO MÓDULOS${colors.reset}`);
    console.log(`${colors.white}${createProgressBar(100)}${colors.reset} ${colors.green}100%${colors.reset}`);
    
    // Endpoints organizados por categorías
    const endpoints = [
        { category: 'DOCUMENTACIÓN', color: colors.cyan, items: [
            'GET  /              - Documentación del API',
            'GET  /health        - Estado del sistema'
        ]},
        { category: 'AUTENTICACIÓN', color: colors.yellow, items: [
            'POST /api/auth/register  - Registrar usuario',
            'POST /api/auth/login     - Iniciar sesión',
            'GET  /api/auth/profile   - Perfil de usuario'
        ]},
        { category: 'USUARIOS', color: colors.green, items: [
            'GET    /api/usuarios     - Listar usuarios',
            'GET    /api/usuarios/:id - Obtener usuario',
            'PUT    /api/usuarios/:id - Actualizar usuario',
            'DELETE /api/usuarios/:id - Eliminar usuario'
        ]},
        { category: 'UNIVERSIDADES', color: colors.magenta, items: [
            'POST   /api/universidades     - Crear universidad',
            'GET    /api/universidades     - Listar universidades',
            'GET    /api/universidades/:id - Obtener universidad',
            'PUT    /api/universidades/:id - Actualizar universidad',
            'DELETE /api/universidades/:id - Eliminar universidad'
        ]},
        { category: 'MODALIDADES', color: colors.blue, items: [
            'POST   /api/modalidades     - Crear modalidad',
            'GET    /api/modalidades     - Listar modalidades',
            'GET    /api/modalidades/:id - Obtener modalidad',
            'PUT    /api/modalidades/:id - Actualizar modalidad',
            'DELETE /api/modalidades/:id - Eliminar modalidad'
        ]},
        { category: 'BECADOS', color: colors.red, items: [
            'POST   /api/becados     - Crear becado',
            'GET    /api/becados     - Listar becados',
            'GET    /api/becados/:id - Obtener becado',
            'PUT    /api/becados/:id - Actualizar becado',
            'DELETE /api/becados/:id - Eliminar becado'
        ]}
    ];
    
    // Mostrar endpoints
    console.log(`
${colors.bright}${colors.cyan}ENDPOINTS DISPONIBLES${colors.reset}
${decorativeLine('━', colors.cyan)}`);
    
    endpoints.forEach(group => {
        console.log(`
${group.color}${group.category}${colors.reset}`);
        group.items.forEach(endpoint => {
            const [method, ...rest] = endpoint.split(' ');
            const path = rest.join(' ');
            let methodColor;
            
            switch(method) {
                case 'GET': methodColor = colors.green; break;
                case 'POST': methodColor = colors.yellow; break;
                case 'PUT': methodColor = colors.blue; break;
                case 'DELETE': methodColor = colors.red; break;
                default: methodColor = colors.white;
            }
            
            console.log(`  ${methodColor}${method}${colors.reset} ${colors.white}${path}${colors.reset}`);
        });
    });
    
    // Nota importante
    console.log(`
${colors.bright}${colors.yellow}IMPORTANTE${colors.reset}
${decorativeLine('─', colors.yellow)}
${colors.white}Todas las rutas excepto ${colors.green}/auth${colors.white} requieren token JWT${colors.reset}
${decorativeLine('═', colors.cyan, 60)}

${colors.green}Servidor listo para recibir peticiones${colors.reset}
${colors.cyan}${'⬇'.repeat(30)}${colors.reset}
    `);
    
    // Iniciar el servidor
    app.listen(PORT, () => {
        //Mostrar un mensaje adicional
    });
};

// Manejar cierre del servidor
process.on('SIGINT', () => {
    console.log(`
${colors.yellow}${'═'.repeat(60)}${colors.reset}`);
    console.log(`${colors.red}Servidor deteniéndose...${colors.reset}`);
    console.log(`${colors.cyan}Tiempo de actividad: ${colors.green}${Math.round(process.uptime())}s${colors.reset}`);
    console.log(`${colors.yellow}${'═'.repeat(60)}${colors.reset}`);
    console.log(`${colors.magenta}¡Hasta luego!${colors.reset}`);
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log(`
${colors.red}Servidor terminado abruptamente${colors.reset}`);
    process.exit(0);
});

// Iniciar servidor
startServer();