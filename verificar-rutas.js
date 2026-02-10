const app = require('./src/app');

console.log('🔍 RUTAS DISPONIBLES EN EL API');
console.log('===============================\n');

// Obtener todas las rutas registradas
function printRoutes(stack, prefix = '') {
    stack.forEach((layer) => {
        if (layer.route) {
            // Es una ruta
            const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(', ');
            console.log(`${methods.padEnd(10)} ${prefix}${layer.route.path}`);
        } else if (layer.name === 'router' && layer.handle.stack) {
            // Es un router
            const newPrefix = prefix + (layer.regexp.toString() !== '/^\\/?(?=\\/|$)/i' ? 
                layer.regexp.toString().replace('/^\\/', '').replace('(?=\\/|$)/i', '') : '');
            printRoutes(layer.handle.stack, newPrefix);
        }
    });
}

printRoutes(app._router.stack);