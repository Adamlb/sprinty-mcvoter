<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../store/room';
import MenuBar from '../components/MenuBar.vue';

const roomStore = useRoomStore();

const { users, isConnected, averageVote, currentVote, hideVotes } =
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

const getGridPlacement = (index: number) => {
  if (index === 0) {
    return 'grid-bottom';
  } else if (index === 1) {
    return 'grid-top';
  } else if (index === 2) {
    return 'grid-left';
  } else if (index === 3) {
    return 'grid-right';
  }
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
    <MenuBar />

    <div class="grid-shit">
      <div v-for="(user, index) in users" class="flex flex-col items-center justify-center" :class="getGridPlacement(index)">
        <div class="flex flex-col items-center justify-center gap-3">
          <p>{{ user.name }}</p>
          <p class="px-2 py-5 w-10 bg-gray-300 text-gray-700 rounded">
            {{ voteDisplay(user.currentVote) }}
          </p>
        </div>
      </div>
      <div class="grid-table rounded-3xl bg-neutral-300 w-96 h-36 flex items-center justify-center">
        <p class="text-gray-700 text-xl">Cast your votes!</p>
      </div>
    </div>

    <div>
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

.grid-shit {
  grid-gap: 0.8rem;
  display: inline-grid;
  grid-template-areas:
      "topL top topR"
      "left table right"
      "bottomL bottom bottomR";
  grid-template-columns: 10.4rem 1fr 10.4rem;
  grid-template-rows: auto 1fr auto;
  margin: 0 auto;
  min-height: 200px;
  width: auto;
}

.grid-top {
  grid-area: top;
}
.grid-left {
  grid-area: left;
}

.grid-right {
  grid-area: right;
}
.grid-bottom {
  grid-area: bottom;
}

.grid-table {
  grid-area: table;
}
</style>
