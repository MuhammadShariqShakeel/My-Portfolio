import { createServer } from 'node:http';
import { createServer as createViteServer } from 'vite';
import { handleContact } from './contact-api.mjs';

const vite = await createViteServer({
  server: { middlewareMode: true },
});

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
  if (pathname === '/api/contact') {
    console.log('API route received:', req.method, pathname);
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }

    try {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const body = JSON.parse(raw || '{}');
      const result = await handleContact(body);
      res.statusCode = result.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(result.body));
    } catch (error) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Invalid request.' }));
    }
  }

  vite.middlewares(req, res, () => {
    res.statusCode = 404;
    res.end('Not found');
  });
});

const port = Number(process.env.PORT || 5173);
server.listen(port, '0.0.0.0');
console.log('Portfolio running at http://localhost:5173');
