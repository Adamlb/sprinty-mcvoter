<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../store/room';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { ChevronDownIcon, ArrowLeftOnRectangleIcon } from '@heroicons/vue/20/solid';

const roomStore = useRoomStore();

const { isConnected, roomCode, currentUser } =
  storeToRefs(roomStore);

const leaveRoom = async () => {
  await roomStore.leaveRoom();
}
</script>

<template>
  <div v-if="isConnected" class="w-full p-3 fixed shadow-md shadow-neutral-900 top-0 left-0 flex flex-row justify-between items-center">
    <div class="flex flex-row gap-8 items-center">
      <img src="../../src/assets/logo-smol.svg" alt="Sprinty McVoter Icon" class="h-12 ml-5 logo">
      <h1 class="text-2xl">{{ roomCode }}</h1>
    </div>
    <div class="fixed top-4 right-0 w-56 text-right mr-5">
      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton
            class="inline-flex w-full items-center justify-center px-4 py-2 font-medium text-white focus:outline-none"
          >
            {{ currentUser }}
            <ChevronDownIcon
              class="ml-2 -mr-1 h-5 w-5"
              aria-hidden="true"
            />
          </MenuButton>
        </div>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems
            class="absolute right-0 mt-2 w-56 origin-top-right rounded-md focus:outline-none"
          >
            <div class="border border-white rounded-md">
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-green-700 text-white' : 'text-white',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                  ]"
                  @click="leaveRoom"
                >
                  <ArrowLeftOnRectangleIcon
                    :active="active"
                    class="mr-2 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  Leave room
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>

<style scoped>
.logo {
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 .5em #27a856);
}
</style>
