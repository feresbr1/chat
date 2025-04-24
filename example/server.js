const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  if (req.url === '/npm-example.html') {
    fs.readFile(path.join(__dirname, 'npm-example.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading npm-example.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  if (req.url === '/dist/index.umd.js') {
    fs.readFile(path.join(__dirname, '..', 'dist', 'index.umd.js'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading widget script');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
    });
    return;
  }


  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Example server running at http://localhost:${PORT}`);
});
