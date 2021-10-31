import { get } from "svelte/store";
import { allWaves } from "../stores";
import { normalizeWave } from "../utils";

function handleNewWave(waver, timestamp, message) {
  let $allWaves = get(allWaves);
  const newWave = normalizeWave({ waver, timestamp, message });
  allWaves.set([newWave, ...$allWaves]);
}

export function contractEvent(node, contract) {
  contract.on("NewWave", handleNewWave);

  return {
    destroy() {
      contract.off("NewWave", handleNewWave);
    },
  };
}
