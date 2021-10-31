<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let countdown = 30;
  let timer;

  $: {
    if (countdown === 0) {
      if (timer) {
        clearInterval(timer);
        timer = null;
        countdown = 30;
        dispatch("message");
      }
    }
  }
  onMount(() => {
    timer = setInterval(() => {
      countdown -= 1;
    }, 1000);
  });
</script>

<div class="card">
  <div class="grid container">
    <div class="title">Cooldown</div>
    <div class="countdown">{countdown}</div>
    <div class="wave">👋</div>
  </div>
</div>

<style>
  .grid {
    display: -ms-grid;
    display: grid;
    grid-row: auto;
    align-items: center;
  }
  .card {
    border-radius: 9999px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    background: aliceblue;
  }

  .card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  .container {
    align-items: center;
    width: 200px;
    height: 200px;
    padding: 16px;
  }

  .title {
    font-size: 20px;
    font-weight: 500;
    color: #004899;
    text-align: center;
  }

  .wave {
    font-size: 20px;
    text-align: center;
  }

  .countdown {
    text-align: center;
    font-size: 50px;
    color: #ff3e00;
  }
</style>
