import http from 'node:http';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import chatHandler from './api/chat.js';
import configHandler from './api/config.js';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.json': 'application/json'
};
// Derive the allowlist from the public tree so new assets need no server edits.
const publicFiles = new Set((await readdir(root, {recursive: true, withFileTypes: true}))
  .filter(entry => entry.isFile())
  .map(entry => path.relative(root, path.join(entry.parentPath, entry.name)).split(path.sep).join('/')));

function json(res, status, data) {
  res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'});
  res.end(JSON.stringify(data));
}

export function createServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    // Match Vercel's response helpers; both environments execute the same handlers.
    res.status = status => { res.statusCode = status; return res; };
    res.json = data => json(res, res.statusCode, data);
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/config') return configHandler(req, res);
      if (url.pathname === '/api/chat') {
        let body = '';
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 24000) return json(res, 413, {error: 'Request too large'});
          body += chunk;
        }
        req.body = body;
        return await chatHandler(req, res);
      }
      if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, {error: 'Method not allowed'});
      const filename = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      if (!publicFiles.has(filename)) return json(res, 404, {error: 'Not found'});
      const bytes = await readFile(path.join(root, filename));
      res.writeHead(200, {'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-cache'});
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch {
      if (!res.headersSent) json(res, 500, {error: 'Something went wrong'});
      else res.end();
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, () => console.log(`Portfolio running at http://localhost:${port}`));
}
