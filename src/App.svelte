<script>
  import { onMount } from "svelte";
  import { ethers } from "ethers";

  import { notifications } from "./notifications";
  import Toast from "./lib/Toast.svelte";
  import Cooldown from "./lib/Cooldown.svelte";
  import WaveInfo from "./lib/WaveInfo.svelte";

  import { normalizeWave, sortByTimestampAsc } from "./utils";
  import { contractEvent } from "./actions/contractEvent";
  import { currentAccount, allWaves, allWavesCount } from "./stores";

  export let contractAbi;
  export let contractAddress;

  let ethereum = null;
  let wavePortalContract = null;

  let showCooldown = false;
  let waveMsg = "Be nice!";

  async function fetchContract() {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      const waves = await wavePortalContract.getAllWaves();
      const normalizedWaves = waves.map((wave) => normalizeWave(wave));
      const sortedWaves = sortByTimestampAsc(normalizedWaves);
      allWaves.set(sortedWaves);
    } catch (error) {
      notifications.danger("Ooof! Please try again.", 3000);
    }
  }

  // NOTE: connect first ethereum account in MetaMask
  async function handleConnectWallet() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length) {
      notifications.success("Wallet connected!", 3000);
      currentAccount.set(accounts[0]);
    }
  }

  async function handleWave() {
    try {
      const waveTxn = await wavePortalContract.wave(
        waveMsg || "Catch this wave!",
        {
          gasLimit: 300000,
        }
      );
      notifications.info("Miners at work...", 10000);

      await waveTxn.wait();
      notifications.success("Success! Your wave was mined.", 3000);
      waveMsg = "";
    } catch (error) {
      showCooldown = true;
      notifications.danger("Ooof! Please try again.", 3000);
    }
  }

  onMount(async () => {
    ethereum = window?.ethereum;
    if (ethereum) {
      fetchContract();
    } else {
      notifications.info("Please login to MetaMask!", 3000);
    }
  });
</script>

<svelte:head>
  <title>WavePortal</title>
</svelte:head>

<main>
  <Toast />
  <div class="dataContainer">
    <div class="header">Say hi 👋 for ETH prizes!</div>
    {#if $currentAccount}
      <div class="connected">
        Connected:
        <a
          target="_blank"
          style="text-decoration: underline"
          href={`https://rinkeby.etherscan.io/address/${$currentAccount}`}
        >
          {$currentAccount}
        </a>
      </div>
      {#if showCooldown}
        <Cooldown on:message={() => (showCooldown = false)} />
      {:else}
        <div
          class="grid gap"
          style="grid-template-columns: 300px minmax(0, 1fr);"
        >
          <input
            id="msg"
            type="text"
            class="textInput"
            bind:value={waveMsg}
            on:focus={() => (waveMsg = "")}
          />
          <button on:click={handleWave}>Say hi</button>
        </div>
      {/if}
    {:else}
      <div class="unconnected">Connect your Ethereum wallet!</div>
      <button on:click={handleConnectWallet}> Connect Wallet </button>
    {/if}

    {#if wavePortalContract}
      <div use:contractEvent={wavePortalContract}>
        <div class="hall-title">Hall of Waves</div>
        <div class="stats">
          <div>Total: {$allWavesCount}</div>
        </div>
        {#each $allWaves as wave, i (wave.timestamp)}
          <WaveInfo {wave} even={i % 2 === 0} />
        {/each}
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 64px;
  }

  .dataContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 600px;
  }

  .header {
    text-align: center;
    font-size: 32px;
    font-weight: 600;
  }

  .textInput {
    color: gray;
    font-size: 16px;
    font-weight: 500;
    padding: 8px;
    border-radius: 5px;
  }

  button {
    cursor: pointer;
    padding: 8px;
    border: 0;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    font-weight: 500;
    background-color: #ff3e00;
  }
  .unconnected {
    text-align: center;
    color: gray;
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .connected {
    text-align: center;
    color: gray;
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .grid {
    display: -ms-grid;
    display: grid;
  }

  .gap {
    grid-gap: 8px;
    gap: 8px;
  }

  .stats {
    text-align: right;
    color: gray;
    margin-top: 4px;
    margin-bottom: 8px;
  }
  .hall-title {
    padding-top: 48px;
    font-size: 20px;
    font-weight: 500;
    color: #004899;
    text-align: center;
  }
</style>
