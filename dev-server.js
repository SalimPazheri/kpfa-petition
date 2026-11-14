// Local test server: serves /public and runs /api/send.js, no Vercel login needed.
// Usage: node dev-server.js   (reads .env in this folder)
const http = require('http');
const fs = require('fs');
const path = require('path');

// Minimal .env loader (no extra dependency)
try {
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8')
    .split(/\r?\n/)
    .forEach((line) => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m || line.trim().startsWith('#')) return;
      let v = m[2];
      if (/^(".*"|'.*')$/.test(v)) v = v.slice(1, -1);
      if (!(m[1] in process.env)) process.env[m[1]] = v;
    });
} catch (e) {
  console.warn('No .env found, using defaults');
}

const PUBLIC = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml' };
const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    const url = req.url.split('?')[0];

    const apiMatch = url.match(/^\/api\/([a-z0-9-]+)$/);
    if (apiMatch) {
      const file = path.join(__dirname, 'api', apiMatch[1] + '.js');
      if (!fs.existsSync(file)) { res.statusCode = 404; return res.end('Not found'); }
      let raw = '';
      req.on('data', (c) => (raw += c));
      req.on('end', () => {
        try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(obj));
          return res;
        };
        delete require.cache[require.resolve(file)]; // pick up edits without restarting
        require(file)(req, res);
      });
      return;
    }

    // Dry-run emails are written to /outbox; view them in the browser
    if (url.startsWith('/outbox/')) {
      const f = path.normalize(path.join(__dirname, url));
      if (!f.startsWith(path.join(__dirname, 'outbox'))) { res.statusCode = 403; return res.end('Forbidden'); }
      return fs.readFile(f, (err, data) => {
        if (err) { res.statusCode = 404; return res.end('No dry-run email yet'); }
        res.setHeader('Content-Type', TYPES[path.extname(f)] || 'text/plain; charset=utf-8');
        res.end(data);
      });
    }

    const rel = url === '/' ? '/index.html' : url;
    const file = path.normalize(path.join(PUBLIC, rel));
    if (!file.startsWith(PUBLIC)) { res.statusCode = 403; return res.end('Forbidden'); }
    fs.readFile(file, (err, data) => {
      if (err) { res.statusCode = 404; return res.end('Not found'); }
      res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
      res.end(data);
    });
  })
  .listen(PORT, '0.0.0.0', () => {
    console.log(`Local server running: http://localhost:${PORT}`);
    console.log(`DRY_RUN=${process.env.DRY_RUN || '0'}  (1 = emails are only printed here, not sent)`);
  });
