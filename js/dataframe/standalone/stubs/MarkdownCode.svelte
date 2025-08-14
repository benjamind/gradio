<script lang="ts">
	export let message: string = "";
	export let latex_delimiters: {
		left: string;
		right: string;
		display: boolean;
	}[] = [];
	export let line_breaks: boolean = true;
	export let chatbot: boolean = false;

	function escape_html(text: string): string {
		return text
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;");
	}

	$: html = line_breaks
		? escape_html(String(message)).replaceAll("\n", "<br />")
		: escape_html(String(message));
</script>

<div class="markdown-code" aria-label="markdown">
	{@html html}
</div>

<style>
	.markdown-code {
		white-space: normal;
	}
</style>
