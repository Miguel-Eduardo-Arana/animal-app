// Mi animal favorito - Servidor Node.js
// Elaborado por Miguel Eduardo Arana
// C.I. 6.914.378
// Sección: 7A
// Fecha: 8 de diciembre de 2025
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Usamos la API WHATWG URL en lugar de url.parse()
  const myURL = new URL(req.url, `http://${req.headers.host}`);

  if (myURL.pathname === '/') {
    // Página inicial
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error cargando index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });

  } else if (myURL.pathname === '/resultado') {
    // Página resultado "Animal Favorito"
    const animal = myURL.searchParams.get('animal') || 'No especificado';
    fs.readFile(path.join(__dirname, 'resultado.html'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error cargando resultado.html');
        return;
      }
      // Insertar el nombre del animal en el HTML
      const contenido = data.replace(
        '<p id="animal" class="animal-text"></p>',
        `<p id="animal" class="animal-text"><strong>${animal}</strong></p>`
      );
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(contenido);
    });

  } else {
    // Servir archivos estáticos (CSS, imágenes, JS, etc.)
    const filePath = path.join(__dirname, myURL.pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Archivo no encontrado');
        return;
      }

      // Detectar MIME según extensión
      let ext = path.extname(filePath).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.css') contentType = 'text/css; charset=utf-8';
      else if (ext === '.js') contentType = 'application/javascript; charset=utf-8';
      else if (ext === '.html') contentType = 'text/html; charset=utf-8';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor Node escuchando en http://localhost:${PORT}`);
});
