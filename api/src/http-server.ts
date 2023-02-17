import express from 'express';
import { createServer } from 'https';
import { readFileSync } from 'fs';

import { config } from './config';

const app = express();
const port = config.httpServerPort;

const privateKey = readFileSync('/home/ubuntu/key.pem');
const certificate = readFileSync('/home/ubuntu/cert.pem');

createServer(
  {
    key: privateKey,
    cert: certificate,
  },
  app
).listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export { app };
