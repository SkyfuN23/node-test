const express = require('express');
const os = require('os');
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Ruta para obtener información del servidor
app.get('/info', (req, res) => {
  res.json({
    hostname: os.hostname(),
    type: os.type(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus(),
    memory: os.totalmem(),
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
