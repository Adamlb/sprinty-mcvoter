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

  if (vote === currentVote.value) {
    css.push('bg-green-700');
  }

  return css.join(' ');
};

const getGridPlacement = (index: number) => {
  switch (index) {
    case 0:
      return 'grid-b';
    case 1:
      return 'grid-t';
    case 2:
      return 'grid-l';
    case 3:
      return 'grid-r';
    case 4:
      return 'grid-t-l';
    case 5:
      return 'grid-t-r';
    case 6:
      return 'grid-b-l';
    case 7:
      return 'grid-b-r';
    default:
      return '';
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

    <div class="mt-24">
      <div class="grid grid-cols-3 grid-rows-3 gap-4">
        <div
          class="grid-item"
          :class="index === 5 ? 'grid-table' : ''"
          v-for="index in 9 - users.length"
          :key="index"
        ></div>
        <div
          v-for="(user, index) in users"
          class="flex flex-col items-center justify-center grid-item"
          :class="getGridPlacement(index)"
        >
          <div class="flex flex-col items-center justify-center">
            <p class="uppercase p-1">{{ user.name }}</p>
            <p
              class="flex items-center justify-center h-16 w-16 border rounded-full text-gray-300 border-4 border-gray-300"
              :class="hasUserVoted(user)"
            >
              {{ voteDisplay(user.currentVote) }}
            </p>
          </div>
        </div>
        <div
          class="grid-table grid-item rounded-3xl bg-neutral-700 w-96 flex items-center justify-center"
        >
          <button
            type="button"
            class="border border-gray-300 border-4 hover:bg-green-700 text-lg"
            @click="setHideVotes(false)"
            v-if="hasAnyoneVoted && hideVotes"
          >
            Show Votes
          </button>
          <button
            type="button"
            class="border border-gray-300 border-4 hover:bg-green-700 text-lg"
            @click="clearVotes"
            v-if="!hideVotes"
          >
            Reset Votes
          </button>
          <p
            class="text-white text-2xl uppercase"
            v-if="!hasAnyoneVoted && hideVotes"
          >
            Cast your votes!
          </p>
        </div>
      </div>
    </div>

    <div class="mt-10">
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
          class="px-2 py-5 w-12 border border-4 text-white border-gray-300 hover:bg-green-700 rounded-lg cursor-pointer"
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
  width: auto;
}

.grid-item {
  min-width: 9rem;
  min-height: 9rem;
}

.grid-t {
  grid-area: top;
}
.grid-l {
  grid-area: left;
}

.grid-r {
  grid-area: right;
}
.grid-b {
  grid-area: bottom;
}

.grid-t-l {
  grid-area: topL;
}

.grid-t-r {
  grid-area: topR;
}

.grid-b-l {
  grid-area: bottomL;
}

.grid-b-r {
  grid-area: bottomR;
}

.grid-table {
  grid-area: table;
}
</style>
