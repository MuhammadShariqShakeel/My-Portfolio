import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleContact } from './contact-api.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith('/api/contact')) {
    console.log('API route received:', req.method, '/api/contact');
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }

    try {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const result = await handleContact(JSON.parse(raw || '{}'));
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result.body));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Invalid request.' }));
    }
  }

  const pathname = new URL(req.url || '/', `http://${req.headers.host}`).pathname;
  let file = path.join(root, pathname === '/' ? 'index.html' : pathname);

  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(root, 'index.html');
  }

  try {
    const data = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

const port = Number(process.env.PORT || 4173);
server.listen(port, '0.0.0.0', () => console.log(`Portfolio running at http://localhost:${port}`));
