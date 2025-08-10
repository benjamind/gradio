import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				compatibility: {
					componentApi: 4
				}
			}
		})
	],
	optimizeDeps: {
		exclude: ["@gradio/dataframe-standalone"]
	},
	resolve: {
		alias: {
			"@gradio/dataframe-standalone": "./Index.svelte"
		}
	},
	server: {
		port: 5173,
		host: true
	},
	build: {
		lib: {
			entry: "./Index.svelte",
			name: "GradioDataframe",
			fileName: "gradio-dataframe-standalone"
		},
		rollupOptions: {
			external: ["svelte", "svelte/internal"],
			output: {
				globals: {
					svelte: "Svelte"
				}
			}
		}
	}
});
