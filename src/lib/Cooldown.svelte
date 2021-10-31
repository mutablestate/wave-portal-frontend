<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let countdown = 30;
	let timer;

	$: {
		if (countdown === 0) {
			if (timer) {
				clearInterval(timer);
				timer = null;
				countdown = 30;
				dispatch('message');
			}
		}
	}
	onMount(() => {
		timer = setInterval(() => {
			countdown -= 1;
		}, 1000);
	});
</script>

<div class="title">👋 cooldown</div>
<div class="countdown">{countdown}</div>

<style>
	.title {
		padding-bottom: 16px;
		font-size: 20px;
		font-weight: 500;
		color: #004899;
		text-align: center;
	}
	.countdown {
		text-align: center;
		font-size: 50px;
		color: #ff3e00;
	}
</style>
