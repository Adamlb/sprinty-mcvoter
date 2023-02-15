import { config } from './config';

const websocketUrl = config.websocketUrl;

const connection = new WebSocket('wss://echo.websocket.org');

connection.onmessage = function (event) {
  useTableStore();
};

connection.onopen = function (event) {
  console.log(event);
  console.log('Successfully connected to the echo websocket server...');
};

import { defineStore } from 'pinia';

export const useSocketStore = defineStore('socket', {
  state: () => {
    return {
      isConnected: false,
      message: '',
      reconnectError: false,
      heartBeatInterval: 50000,
      heartBeatTimer: 0,
    };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    socketOnOpen(event) {
      this.isConnected = true;

      console.log('successful websocket connection');
      main.config.globalProperties.$socket = event.currentTarget;

      this.heartBeatTimer = window.setInterval(() => {
        const message = '心跳消息';
        this.isConnected &&
          main.config.globalProperties.$socket.sendObj({
            code: 200,
            msg: message,
          });
      }, this.heartBeatInterval);
    },
    // 连接关闭
    SOCKET_ONCLOSE(event: any) {
      this.isConnected = false;
      // 连接关闭时停掉心跳消息
      window.clearInterval(this.heartBeatTimer);
      this.heartBeatTimer = 0;
      console.log('连接已断开: ' + new Date());
      console.log(event);
    },
    // 发生错误
    SOCKET_ONERROR(event: any) {
      console.error(event);
    },
    // 收到服务端发送的消息
    SOCKET_ONMESSAGE(message: any) {
      this.message = message;
    },
    // 自动重连
    SOCKET_RECONNECT(count: any) {
      console.info('消息系统重连中...', count);
    },
    // 重连错误
    SOCKET_RECONNECT_ERROR() {
      this.reconnectError = true;
    },
  },
});
