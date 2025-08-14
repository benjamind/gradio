<script lang="ts">
	export let aria_label = "";
	export let height = "100%";
	export let root = "";
	export let upload: any = null;
	export let stream_handler: any = null;
</script>

<div style={`height:${height};`}>
	<slot />
</div>

<style>
	div {
		width: 100%;
		border: 1px solid var(--border-color-primary);
		border-radius: var(--table-radius);
		overflow: hidden;
	}
</style>
