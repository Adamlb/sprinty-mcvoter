<script setup lang="ts">
import JoinRoom from './components/JoinRoom.vue';
import Room from './components/Room.vue';
</script>

<template>
  <h1>Sprinty McVoter</h1>
  <JoinRoom />
  <Room />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
