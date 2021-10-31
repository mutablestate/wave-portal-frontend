import App from "./App.svelte";
import wavePortalAbi from "./contract/WavePortal.json";

const contractAddress = "0x77f5589d8d4f658D68d760b143418A6EF716ec97";
const contractAbi = wavePortalAbi.abi;

const app = new App({
  target: document.getElementById("app"),
  props: {
    contractAddress,
    contractAbi,
  },
});

export default app;
