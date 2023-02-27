import { WebSocketServer } from 'ws';
import { readFileSync } from 'fs';
import { createServer, ServerOptions } from 'https';

import { config } from './config';
import { ClientService } from './client-service';

const serverOptions: ServerOptions = {};

if (config.certificate) {
  serverOptions.cert = readFileSync(config.certificate.cert);
  serverOptions.key = readFileSync(config.certificate.key);
}

const server = createServer(serverOptions);

const wss = new WebSocketServer({ server });
const clientService = new ClientService();

wss.on('connection', function connection(ws) {
  clientService.registerClient(ws);
  ws.on('error', console.error);
});

server.listen(config.websocketPort);

console.log(`Websocket server listening on port ${config.websocketPort}`);
