import { WebSocketServer } from 'ws';

import { config } from './config';

const wss = new WebSocketServer({ port: config.websocketPort });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});
