import http from 'node:http';
import { config } from './config.js';
import { logger } from './logger.js';

export function createServer(watchers) {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/healthz') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    if (req.url === '/metrics') {
      const metrics = {
        watchers: Object.fromEntries(
          Object.entries(watchers).map(([name, w]) => [
            name,
            { running: w.interval !== null },
          ]),
        ),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss,
      };
      res.writeHead(200);
      res.end(JSON.stringify(metrics));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'not found' }));
  });

  server.listen(config.port, () => {
    logger.info({ port: config.port }, 'HTTP server listening');
  });

  return server;
}
