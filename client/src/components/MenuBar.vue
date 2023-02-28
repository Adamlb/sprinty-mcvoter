<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../store/room';

const roomStore = useRoomStore();

const { isConnected, roomCode, currentUser } =
  storeToRefs(roomStore);
</script>

<template>
  <div v-if="isConnected" class="w-full p-3 fixed shadow-md shadow-neutral-900 top-0 left-0 flex flex-row justify-between items-center">
    <div class="flex flex-row gap-8 items-center">
      <img src="../../src/assets/logo-smol.svg" alt="Sprinty McVoter Icon" class="h-12 ml-5 logo">
      <h1 class="text-2xl">{{ roomCode }}</h1>
    </div>
    <div class="mr-5">
      <h1 class="text-2xl">{{ currentUser }}</h1>
    </div>
  </div>
</template>

<style scoped>
.logo {
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 .5em #27a856);
}
</style>
