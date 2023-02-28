import { WebSocketServer } from 'ws';
import { readFileSync } from 'fs';
import { createServer, ServerOptions } from 'https';

import { config } from './config';
import { ClientService } from './client-service';

let wss: WebSocketServer;

if (config.certificate) {
  const serverOptions: ServerOptions = {};

  serverOptions.cert = readFileSync(config.certificate.cert);
  serverOptions.key = readFileSync(config.certificate.key);

  const server = createServer(serverOptions);

  wss = new WebSocketServer({ server });

  server.listen(config.websocketPort);
} else {
  wss = new WebSocketServer({ port: config.websocketPort });
}

const clientService = new ClientService();

wss.on('connection', function connection(ws) {
  clientService.registerClient(ws);
  ws.on('error', console.error);
});

console.log(`Websocket server listening on port ${config.websocketPort}`);
