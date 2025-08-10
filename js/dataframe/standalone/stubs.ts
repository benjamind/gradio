export const client = {
	upload: async (
		files: any[],
		root: string,
		path?: string,
		max_file_size?: number
	) => {
		console.warn("Upload functionality not available in standalone mode");
		return files;
	},
	stream: () => {
		console.warn("Stream functionality not available in standalone mode");
		return () => {};
	}
};

export const format_time = (time: number): string => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const skip_audio = (): void => {};
export const process_audio = (): void => {};

export { default as BaseCheckbox } from "./stubs/BaseCheckbox.svelte";
export { default as Upload } from "./stubs/Upload.svelte";

export const StatusTracker = null;

export const IconButton = null;

export const MarkdownCode = null;

export class ShareError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ShareError";
	}
}

export const reactive_formatter = (key: string, ...args: any[]): string => key;

export const is_browser = typeof window !== "undefined";

export const _ = (key: string, ...args: any[]): string => key;

export { default as FullscreenButton } from "./stubs/FullscreenButton.svelte";

export interface SelectData {
	index: number[];
	value: any;
	selected: boolean;
}

export type I18nFormatter = (key: string, ...args: any[]) => string;

export interface Client {
	upload: typeof client.upload;
	stream: typeof client.stream;
}
