import { defineStore } from "pinia";

export const useTableStore = defineStore("table", {
  state: () => {
    return { players: [] };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++;
    },
  },
});
