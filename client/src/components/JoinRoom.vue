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
  <div class="flex flex-col items-center" v-if="!isConnected">
    <div class="mt-16 max-w-7xl">
      <img
        src="../../src/assets/logo.svg"
        alt="Sprinty McVoter Logo"
        class="logo mb-14"
      />

      <div
        class="p-7 border-4 white shadow rounded-lg flex flex-col items-center gap-4"
      >
        <h1 class="mb-4">Join Room</h1>

        <div class="flex flex-col w-2/3">
          <label for="name" class="text-left mb-1">Name </label>
          <input
            type="text"
            name="name"
            v-model="name"
            placeholder="Sprinty McSprintFace"
            class="w-full bg-neutral-600 px-2 py-2 rounded"
          />
        </div>
        <div class="flex flex-col w-2/3">
          <label for="tableCode" class="text-left mb-1">Room code </label>
          <input
            type="text"
            name="tableCode"
            v-model="roomCode"
            v-on:keyup.enter="joinTable"
            placeholder="room-code"
            class="w-full bg-neutral-600 px-2 py-2 rounded"
          />
        </div>
        <div>
          <button
            @click="joinTable"
            class="mt-6 bg-neutral-600 hover:bg-transparent pulse"
          >
            Join Us
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 15em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #27a856aa);
}

.pulse {
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(39, 168, 86, 0.4);
  }
  70% {
    box-shadow: 0 0 0 1rem rgba(39, 168, 86, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(39, 168, 86, 0);
  }
}
</style>
