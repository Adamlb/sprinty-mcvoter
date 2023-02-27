interface Certificate {
  cert: string;
  key: string;
}

interface Config {
  websocketPort: number;
  httpServerPort: number;
  certificate?: Certificate;
}

const config: Config = {
  websocketPort: Number(process.env.WEBSOCKET_PORT),
  httpServerPort: Number(process.env.HTTP_SERVER_PORT),
};

if (process.env.CERTIFICATE_PATH && process.env.CERTIFICATE_KEY_PATH) {
  config.certificate = {
    cert: process.env.CERTIFICATE_PATH,
    key: process.env.CERTIFICATE_KEY_PATH,
  };
}

export { config };
