<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../store/room';

const roomStore = useRoomStore();
const roomCode = ref('');
const name = ref('');
const { isConnected } = storeToRefs(roomStore);

const joinTable = async () => {
  if (name.value && roomCode.value) {
    await roomStore.joinRoom({ name: name.value, roomCode: roomCode.value });
  }
};
</script>

<template>
  <div v-if="!isConnected">
    <h1>Join Room</h1>

    <div class="justify-right">
      <label for="name">Name: </label>
      <input type="text" name="name" v-model="name" />
    </div>
    <div class="justify-right">
      <label for="tableCode">Room code: </label>
      <input type="text" name="tableCode" v-model="roomCode" />
    </div>
    <div>
      <button @click="joinTable">Join</button>
    </div>
  </div>
</template>

<style scoped>
.justify-right {
  text-align: right;
}
.read-the-docs {
  color: #888;
}
</style>
