<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Maximise } from "@gradio/icons";

	export let fullscreen = false;

	const dispatch = createEventDispatcher<{ fullscreen: boolean }>();

	function toggleFullscreen(): void {
		const newFullscreen = !fullscreen;
		dispatch("fullscreen", newFullscreen);
	}
</script>

<button
	class="fullscreen-button"
	class:fullscreen
	on:click={toggleFullscreen}
	aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
	title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
>
	<Maximise />
</button>

<style>
	.fullscreen-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--size-6, 24px);
		height: var(--size-6, 24px);
		background: var(--background-fill-primary, #ffffff);
		border-radius: var(--radius-sm, 4px);
		cursor: pointer;
		transition: all 0.2s ease;
		padding: var(--size-1, 4px);
		color: var(--body-text-color-subdued, #6b7280);
	}

	.fullscreen-button:hover {
		background: var(--background-fill-secondary, #f9fafb);
		border-color: var(--border-color-secondary, #9ca3af);
		color: var(--body-text-color, #374151);
	}

	.fullscreen-button:active {
		background: var(--background-fill-tertiary, #f3f4f6);
	}

	.fullscreen-button :global(svg) {
		width: 16px;
		height: 16px;
		color: inherit;
		transition: transform 0.2s ease;
	}

	.fullscreen-button.fullscreen :global(svg) {
		transform: rotate(180deg);
	}
</style>
