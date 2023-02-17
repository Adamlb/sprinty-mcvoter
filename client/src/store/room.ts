import { defineStore } from 'pinia';

import { config } from '../config';

interface User {
  name: string;
  currentVote: number;
}

interface RoomState {
  roomCode: string;
  currentVote: null | number;
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
      currentVote: null,
      users: [],
      socket: null,
    };
  },
  getters: {
    averageVote(state) {
      const voteSum = state.users.reduce(
        (total, user) => total + user.currentVote || 0,
        0
      );

      const totalVotes = state.users.filter(
        (user) => typeof user.currentVote === 'number'
      ).length;

      if (totalVotes === 0) {
        return 0;
      }

      return (voteSum / totalVotes).toFixed(1);
    },
  },
  actions: {
    async joinRoom({ name, roomCode }: { name: string; roomCode: string }) {
      if (this.socket) {
        this.leaveRoom();
      }
      this.socket = new WebSocket(websocketUrl);
      this.roomCode = roomCode;

      this.socket.onopen = (event) => {
        console.log('Connected to websocket');

        this.socket?.send(`joinRoom::${JSON.stringify({ name, roomCode })}`);
        this.isConnected = true;
      };

      this.socket.onmessage = (event) => {
        console.log('message received');
        const [action, data] = event.data.split('::');

        if (action === 'clientUpdate') {
          const parsedData = JSON.parse(data);

          this.users = parsedData;
        }
      };
    },
    async leaveRoom() {
      this.socket?.close();
      this.users = [];
      this.socket = null;
      this.roomCode = '';
    },
    async castVote(vote: number | null) {
      this.currentVote = vote;
      this.socket?.send(`vote::${JSON.stringify({ vote })}`);
    },
    async clearVotes() {
      this.currentVote = null;
      this.socket?.send(`clearVotes::{}`);
    },
  },
});
