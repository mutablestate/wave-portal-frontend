import wavePortalAbi from "./contract/WavePortal.json";
import "./assets/css/app.css";
import App from "./App.svelte";

const contractAddress = "0x2A8EDBCc8E7b9ea1DceEFe9AACC199df612Aef3D";
const contractAbi = wavePortalAbi.abi;

const app = new App({
  target: document.getElementById("app"),
  props: {
    contractAddress,
    contractAbi,
  },
});

export default app;
