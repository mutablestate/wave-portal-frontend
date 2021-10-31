import wavePortalAbi from "./contract/WavePortal.json";
import "./assets/css/app.css";
import App from "./App.svelte";

const contractAddress = "0x287a73aDd09fAc71fdb32C05500819f8c4eD46a3";
const contractAbi = wavePortalAbi.abi;

const app = new App({
  target: document.getElementById("app"),
  props: {
    contractAddress,
    contractAbi,
  },
});

export default app;
