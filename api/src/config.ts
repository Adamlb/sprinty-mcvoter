interface Config {
  websocketPort: number;
  httpServerPort: number;
}

export const config: Config = {
  websocketPort: Number(process.env.WEBSOCKET_PORT),
  httpServerPort: Number(process.env.HTTP_SERVER_PORT),
};
