const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Tipos MIME con charset UTF-8
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml; charset=utf-8'
};

const server = http.createServer((req, res) => {
    // Ruta del archivo solicitado
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // Extensión del archivo
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Leer y servir el archivo
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Archivo no encontrado - servir index.html para SPA
                fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Error del servidor: ' + err);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor SG FOREVER corriendo en puerto ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
});
