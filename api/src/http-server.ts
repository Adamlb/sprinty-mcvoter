import express from 'express';

import { config } from './config';

const app = express();
const port = config.httpServerPort;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.listen(80, () => {
  console.log(`App listening on 80`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export { app };
