<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../store/room';
import MenuBar from '../components/MenuBar.vue';

const roomStore = useRoomStore();

const {
  users,
  isConnected,
  averageVote,
  currentVote,
  hideVotes,
  hasAnyoneVoted,
} = storeToRefs(roomStore);

const hasUserVoted = (user: any) => {
  if (typeof user.currentVote !== 'undefined') {
    return 'bg-green-700';
  }
};

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
    css.push('bg-green-700');
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

    <div class="mt-16">
      <div class="grid">
        <div
          v-for="(user, index) in users"
          class="flex flex-col items-center justify-center"
          :class="getGridPlacement(index)"
        >
          <div class="flex flex-col items-center justify-center">
            <p>{{ user.name }}</p>
            <p
              class="px-2 py-5 w-10 border text-white border-gray-300 rounded"
              :class="hasUserVoted(user)"
            >
              {{ voteDisplay(user.currentVote) }}
            </p>
          </div>
        </div>
        <div
          class="grid-table rounded-3xl bg-neutral-700 w-96 h-36 flex items-center justify-center"
        >
          <button
            type="button"
            class="border border-gray-300 hover:bg-green-700"
            @click="setHideVotes(false)"
            v-if="hasAnyoneVoted && hideVotes"
          >
            Show Votes
          </button>
          <button
            type="button"
            class="border border-gray-300 hover:bg-green-700"
            @click="clearVotes"
            v-if="!hideVotes"
          >
            Reset Votes
          </button>
          <p class="text-white text-xl" v-if="!hasAnyoneVoted && hideVotes">
            Cast your votes!
          </p>
        </div>
      </div>
    </div>

    <div class="mt-20">
      <div class="average">
        <p>Average</p>
        <p class="font-bold">{{ averageVote }}</p>
      </div>
    </div>

    <div class="w-full fixed bottom-0 left-0 py-20">
      <p class="mb-8 text-2xl">Choose your card</p>
      <div class="flex flex-row items-center justify-center gap-8">
        <div
          v-for="vote of voteOptions"
          :class="cardClass(vote)"
          class="px-2 py-5 w-12 border text-white border-gray-300 hover:bg-green-700 rounded pointer"
          @click="castVote(vote)"
        >
          {{ vote === null ? '-' : vote }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.average {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 25px;
  margin-bottom: 10px;
}

.grid {
  grid-gap: 0.8rem;
  display: inline-grid;
  grid-template-areas:
    'topL top topR'
    'left table right'
    'bottomL bottom bottomR';
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
