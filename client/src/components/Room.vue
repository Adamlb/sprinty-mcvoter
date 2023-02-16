<script setup lang="ts">
import { ref } from 'vue';
import { useRoomStore } from '../store/room';

const roomStore = useRoomStore();

const users = ref(roomStore.users);
const roomCode = roomStore.roomCode;
const isConnected = ref(roomStore.isConnected);
</script>

<template>
  <div v-if="isConnected">
    <h1>Table</h1>

    <div>Room: {{ roomCode }}</div>

    <div>
      <h3>Your Vote</h3>
    </div>

    <div>
      <h3>Current Votes</h3>
      <div v-for="user of users">
        <span>{{ user.name }}</span>
        <span>{{ user.currentVote || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
