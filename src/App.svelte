<script>
  import { onMount } from "svelte";
  import { ethers } from "ethers";

  import { notifications } from "./notifications";
  import Toast from "./lib/Toast.svelte";

  import { normalizeWave, sortByTimestampAsc } from "./utils";
  import { contractEvent } from "./actions/contractEvent";
  import { currentAccount, allWaves, allWavesCount } from "./stores";

  export let contractAbi;
  export let contractAddress;

  let ethereum = null;
  let wavePortalContract = null;

  let waveMsg = "";

  async function fetchContract() {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      wavePortalContract = await new ethers.Contract(
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
      notifications.success("Account connected!", 3000);
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
      notifications.info("Mining your wave...", 9000);

      await waveTxn.wait();
      notifications.success("Success! Your wave was mined.", 3000);
      waveMsg = "";
    } catch (error) {
      // showCooldown = true;
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
        <div>
          <input id="msg" type="text" class="text-input" bind:value={waveMsg} />
          <button class="waveButton" on:click={handleWave}>Say hi</button>
        </div>
      </div>
    {:else}
      <div class="unconnected">Connect your Ethereum wallet!</div>
      <button class="waveButton" on:click={handleConnectWallet}>
        Connect Wallet
      </button>
    {/if}

    {#if wavePortalContract}
      <div class="hall-title">Hall of {$allWavesCount} Waves</div>
      <div use:contractEvent={wavePortalContract}>
        <ul>
          {#each $allWaves as wave}
            <li>
              <div>{wave.message}</div>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

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

  .hall-title {
    padding-top: 48px;
    padding-bottom: 16px;
    font-size: 20px;
    font-weight: 500;
    color: #004899;
    text-align: center;
  }
</style>
