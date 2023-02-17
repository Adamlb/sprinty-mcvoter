<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../store/room';

const roomStore = useRoomStore();

const { users, roomCode, isConnected, averageVote } = storeToRefs(roomStore);

const castVote = (vote: number | null) => {
  roomStore.castVote(vote);
};

const clearVotes = () => {
  roomStore.clearVotes();
};

const voteOptions = [null, 0, 1, 2, 3, 5, 8, 13];
</script>

<template>
  <div v-if="isConnected">
    <h1>Table</h1>

    <div>Room: {{ roomCode }}</div>

    <div>
      <h3>Your Vote</h3>
      <div class="vote-container">
        <div
          v-for="vote of voteOptions"
          class="vote-card"
          @click="castVote(vote)"
        >
          {{ vote === null ? '-' : vote }}
        </div>
      </div>
    </div>

    <div>
      <h3>Current Votes</h3>
      <div v-for="user of users">
        <span>{{ user.name }}</span>
        <span>{{ user.currentVote === null ? '-' : user.currentVote }}</span>
      </div>
      <div>Average: {{ averageVote }}</div>
      <button type="button" @click="clearVotes">Clear Votes</button>
    </div>
  </div>
</template>

<style scoped>
.vote-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.vote-card {
  border: 1px solid black;
  border-radius: 3px;
  flex-grow: 1;
  background-color: white;
  color: black;
  font-size: 25px;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
