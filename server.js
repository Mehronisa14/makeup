const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const net = require('net');
const { exec } = require('child_process');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

const PUBLIC_DIR = __dirname;

function getAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      server.once('close', () => resolve(startPort));
      server.close();
    });
    server.on('error', () => {
      resolve(getAvailablePort(startPort + 1));
    });
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Safe path normalization to avoid directory traversal
  let safePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // Check if file exists, or if missing .html extension
  if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
    const htmlCandidate = safePath + '.html';
    const indexCandidate = path.join(safePath, 'index.html');
    if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
      safePath = htmlCandidate;
    } else if (fs.existsSync(indexCandidate) && fs.statSync(indexCandidate).isFile()) {
      safePath = indexCandidate;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family: sans-serif; text-align: center; padding: 50px;"><h1>404 Not Found</h1><p>The requested file <code>${pathname}</code> was not found.</p><p><a href="/">Return to Homepage</a></p></body></html>`);
      return;
    }
  }

  const ext = path.extname(safePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(safePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Server Error: ' + err.message);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Content-Length': data.length
    });
    res.end(data);
  });
});

async function start() {
  const PORT = await getAvailablePort(3000);
  server.listen(PORT, '0.0.0.0', () => {
    const localUrl = `http://localhost:${PORT}`;
    console.log('======================================================');
    console.log('✨ GLAMORA BEAUTY — LUXURY STOREFRONT LOCAL SERVER ✨');
    console.log('======================================================');
    console.log(`Local URL:     ${localUrl}`);
    console.log(`Pages available:`);
    console.log(` - 🏠 Homepage:        ${localUrl}/`);
    console.log(` - 🛍️ Collection:      ${localUrl}/shop.html`);
    console.log(` - 💄 Product Detail:  ${localUrl}/product.html`);
    console.log('======================================================');
    console.log('Server is running. Press Ctrl+C in console to stop.');

    // Automatically open in default browser
    exec(`start ${localUrl}`, (err) => {
      if (!err) {
        console.log(`[Browser] Opened ${localUrl} in your default browser.`);
      }
    });
  });
}

start();
