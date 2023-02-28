<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../store/room';
import logo from '../assets/beard-sprint.png';

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
    <div>
      <img class="logo" v-bind:src="logo" />
    </div>

    <div class="justify-right center w50 text-large mt2 mb2">
      <label for="name">Name: </label>
      <input
        type="text"
        name="name"
        v-model="name"
        placeholder="Sprinty McSprintFace"
      />
    </div>
    <div class="justify-right center w50 text-large">
      <label for="tableCode">Room: </label>
      <input
        type="text"
        name="tableCode"
        v-model="roomCode"
        placeholder="room-code"
      />
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

.center {
  margin-left: auto;
  margin-right: auto;
}
.w50 {
  max-width: 50%;
}

.logo {
  border-radius: 40px;
  border: 2px solid white;
}

.text-large {
  font-size: large;
}

.mb2 {
  margin-bottom: 2px;
}

.mt2 {
  margin-top: 2px;
}
</style>
