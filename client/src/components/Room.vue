<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../store/room';

const roomStore = useRoomStore();

const { users, roomCode, isConnected, averageVote, currentVote, hideVotes } =
  storeToRefs(roomStore);

const castVote = (vote: number | null) => {
  roomStore.castVote(vote);
};

const clearVotes = () => {
  roomStore.clearVotes();
  roomStore.setHideVotes(true);
};

const cardClass = (vote: number | null) => {
  const css: string[] = ['vote-card'];

  if (vote == currentVote.value) {
    css.push('current-vote');
  }

  return css.join(' ');
};

const voteDisplay = (vote: number | null | undefined) => {
  if (typeof vote === 'undefined') {
    // hasn't voted
    return '-';
  } else if (hideVotes.value) {
    return '?';
  } else {
    return typeof vote === 'number' ? vote : '-';
  }
};

const setHideVotes = (hideVotes: boolean) => {
  roomStore.setHideVotes(hideVotes);
};

const voteOptions = [null, 0, 1, 2, 3, 5, 8, 13];
</script>

<template>
  <div v-if="isConnected">
    <h1>{{ roomCode }}</h1>

    <div>
      <h3>Current Votes</h3>
      <div class="user-votes-container">
        <div v-for="user of users" class="user-vote-card">
          <div>{{ user.name }}</div>
          <div>
            {{ voteDisplay(user.currentVote) }}
          </div>
        </div>
      </div>
      <div class="average">Average: {{ averageVote }}</div>
      <button type="button" class="button" @click="setHideVotes(false)">
        Show Votes
      </button>
      <button type="button" class="button" @click="clearVotes">
        Clear Votes
      </button>
    </div>

    <div>
      <h3>Your Vote</h3>
      <div class="vote-container">
        <div
          v-for="vote of voteOptions"
          :class="cardClass(vote)"
          @click="castVote(vote)"
        >
          {{ vote === null ? '-' : vote }}
        </div>
      </div>
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
  min-width: 100px;
  border: 1px solid black;
  border-radius: 3px;
  flex-grow: 1;
  background-color: white;
  color: black;
  font-size: 25px;
  padding-top: 15px;
  padding-bottom: 15px;
  cursor: pointer;
}
.current-vote {
  background-color: cadetblue;
}

.user-votes-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.user-vote-card {
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  color: black;
  border: 1px solid black;
  border-radius: 3px;
  flex-grow: 1;
  font-size: 15px;
}

.average {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 25px;
  margin-bottom: 10px;
}
</style>
