import { WebSocketServer } from 'ws';

import { config } from './config';
import { ClientService } from './client-service';

const wss = new WebSocketServer({ port: config.websocketPort });
const clientService = new ClientService();

wss.on('connection', function connection(ws) {
  clientService.registerClient(ws);
  ws.on('error', console.error);
});

console.log(`Websocket server listening on port ${config.websocketPort}`);
