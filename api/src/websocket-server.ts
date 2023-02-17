import { WebSocketServer } from 'ws';
import { readFileSync } from 'fs';
import { createServer } from 'https';

import { config } from './config';
import { ClientService } from './client-service';

const server = createServer({
  cert: readFileSync('/home/ubuntu/cert.pem'),
  key: readFileSync('/home/ubuntu/key.pem'),
});

const wss = new WebSocketServer({ server, port: config.websocketPort });
const clientService = new ClientService();

wss.on('connection', function connection(ws) {
  clientService.registerClient(ws);
  ws.on('error', console.error);
});

console.log(`Websocket server listening on port ${config.websocketPort}`);
