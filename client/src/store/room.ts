import { defineStore } from 'pinia';

import { config } from '../config';

interface User {
  name: string;
  currentVote: number;
}

interface RoomState {
  roomCode: string;
  socket: null | WebSocket;
  isConnected: boolean;
  users: User[];
}

const websocketUrl = config.websocketUrl;

export const useRoomStore = defineStore('room', {
  state: (): RoomState => {
    return {
      roomCode: '',
      isConnected: false,
      users: [],
      socket: null,
    };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    async joinRoom({ name, roomCode }: { name: string; roomCode: string }) {
      this.socket = new WebSocket(websocketUrl);

      this.socket.onopen = (event) => {
        console.log('Connected to websocket');

        this.socket?.send(`joinRoom::${JSON.stringify({ name, roomCode })}`);
        this.isConnected = true;
      };

      this.socket.onmessage = (event) => {
        console.log('message received');
        console.log(event);
      };
    },
  },
});
