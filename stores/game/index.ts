import { defineStore } from "pinia"

export const useGameStore = defineStore("game", () => { })

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
