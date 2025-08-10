<script lang="ts">
	// Simple stub component for Upload functionality in standalone dataframe
	// Upload functionality is not supported in the standalone version
	// This component renders its slot content but without upload functionality
	export let flex = true;
	export let center = true;
	export let boundedheight = true;
	export let disable_click = false;
	export let aria_label = "";
	export let height = "100%";
</script>

<!-- Upload functionality is disabled in standalone mode -->
<!-- Render slot content in div structure to avoid nested button issues -->
<div
	class:center
	class:boundedheight
	class:flex
	class:disable_click
	style="height: {height}"
	aria-label={aria_label ||
		"Drop CSV or TSV files here to import data into dataframe"}
	aria-dropeffect="copy"
>
	<slot></slot>
</div>

<style>
	div {
		cursor: pointer;
		width: var(--size-full);
		background: transparent;
		padding: 0;
		border: 1px solid var(--border-color-primary);
		border-radius: var(--table-radius);
		overflow: hidden;
	}

	.center {
		display: flex;
		justify-content: center;
	}
	.flex {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.disable_click {
		cursor: default;
	}
</style>
