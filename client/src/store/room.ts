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
  hideVotes: boolean;
  currentUser: null | string;
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
      hideVotes: true,
      currentUser: null,
    };
  },
  getters: {
    averageVote(state) {
      if (this.hideVotes) return '?';

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
    hasAnyoneVoted(state) {
      const totalVotes = state.users.filter(
        (user) => typeof user.currentVote !== 'undefined'
      ).length;

      return totalVotes > 0;
    },
  },
  actions: {
    async joinRoom({ name, roomCode }: { name: string; roomCode: string }) {
      if (this.socket) {
        this.leaveRoom();
      }
      this.socket = new WebSocket(websocketUrl);
      this.roomCode = roomCode;
      this.currentUser = name;

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
        } else if (action === 'setHideVotes') {
          const parsedData = JSON.parse(data);

          this.hideVotes = parsedData.hideVotes;
        } else if (action === 'clearVote') {
          this.currentVote = null;
        }
      };
    },
    async leaveRoom() {
      this.socket?.close();
      this.users = [];
      this.socket = null;
      this.roomCode = '';
      this.isConnected = false;
    },
    async castVote(vote: number | null) {
      this.currentVote = vote;
      this.socket?.send(`vote::${JSON.stringify({ vote })}`);
    },
    async clearVotes() {
      this.currentVote = null;
      this.socket?.send(`clearVotes::{}`);
    },
    async setHideVotes(hideVotes: boolean) {
      this.hideVotes = hideVotes;
      this.socket?.send(`setHideVotes::${JSON.stringify({ hideVotes })}`);
    },
  },
});
