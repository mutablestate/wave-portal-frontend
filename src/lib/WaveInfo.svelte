<script>
  import dayjs from "dayjs";

  export let wave = null;

  function keyToEmoji(key) {
    return {
      address: "🏠",
      timestamp: "🕒",
      message: "💬",
    }[key];
  }

  function toIterable(obj) {
    if (!obj) return [];
    let attrs = Object.entries(obj).map(([key, value]) => {
      return { [keyToEmoji(key)]: value };
    });
    return attrs;
  }
  let waveIterable = toIterable(wave);

  function formatDate(timestamp) {
    const date = dayjs(timestamp).format("DD-MM-YYYY HH:MM:ss");
    return date;
  }

  export let even = true;
  let odd = !even;
</script>

<section class:odd class:even>
  {#each waveIterable as attr}
    <div class="grid gap" style="grid-template-columns: 16px minmax(0, 1fr);">
      <div class="label">
        {Object.keys(attr)}
      </div>
      <div class="info">
        {#if Object.keys(attr).toString() === "🕒"}
          {formatDate(Object.values(attr)[0])}
        {:else}
          {Object.values(attr).toString()}
        {/if}
      </div>
    </div>
  {/each}
</section>

<style>
  .odd {
    background-color: rgba(224, 240, 227, 1);
    margin-bottom: 4px;
    padding: 8px;
    box-shadow: rgba(255, 255, 255, 0.5) 0px 3px 3px;
  }
  .even {
    background-color: rgba(184, 216, 190, 1);
    margin-bottom: 4px;
    padding: 8px;
    box-shadow: rgba(255, 255, 255, 0.5) 0px 3px 3px;
  }

  .grid {
    display: -ms-grid;
    display: grid;
  }

  .gap {
    grid-gap: 8px;
    gap: 8px;
  }

  .label {
    font-size: 13px;
    font-weight: 500;
    padding-top: 2px;
    padding-bottom: 2px;
  }

  .info {
    font-size: 13px;
    font-weight: 300;
    font-style: italic;
    padding-top: 2px;
    padding-bottom: 2px;
  }
</style>
