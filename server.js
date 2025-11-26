// inicia el servidor de next y le enganchamos el backend (gateway y orchestrator)
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// 1. importamos la función del WebSocket
const { attachWebSocketServer } = require('./dist/websocket-server');

// 2. importamos el orquestador
const { startOrchestrator } = require('./dist/orchestrator');

// servidor de next
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port }); 
const handle = app.getRequestHandler(); 

app.prepare().then(() => {
  const server = createServer(async (req, res) => { 
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error'); 
    }
  });

  // 3. enganchamos el websocket al servidor
  attachWebSocketServer(server);

  // 4. arrancamos el orquestador
  startOrchestrator(); 

  // 5. lanzamos el servidor
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log('WebSocket server attached.');
  });
}).catch((err) => {
  console.error('Error preparing Next.js app:', err);
  process.exit(1);
});