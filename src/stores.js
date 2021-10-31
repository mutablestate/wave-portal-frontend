import { writable, derived } from "svelte/store";

export const allWaves = writable([]);
export const allWavesCount = derived(allWaves, ($allWaves) => $allWaves.length);
export const currentAccount = writable("");
