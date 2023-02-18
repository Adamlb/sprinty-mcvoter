import express from 'express';
import { config } from './config';

const app = express();
const port = config.httpServerPort;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`HTTP listening on port ${port}`);
});

export { app };
