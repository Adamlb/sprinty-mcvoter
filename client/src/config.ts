interface Config {
  websocketUrl: string;
}

export const config: Config = {
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL,
};
