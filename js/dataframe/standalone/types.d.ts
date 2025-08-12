declare module "@gradio/dataframe" {
	import { SvelteComponent } from "svelte";

	export interface DataframeProps {
		value?: (string | number | boolean)[][];
		headers?: string[];
		datatype?: string[] | string;
		editable?: boolean;
		show_row_numbers?: boolean;
		max_height?: number;
		show_search?: "none" | "search" | "filter";
		show_copy_button?: boolean;
		show_fullscreen_button?: boolean;
		wrap?: boolean;
		line_breaks?: boolean;
		column_widths?: string[];
		max_chars?: number;
		pinned_columns?: number;
		static_columns?: (string | number)[];
		fullscreen?: boolean;
		label?: string | null;
		show_label?: boolean;
		latex_delimiters?: any[];
		components?: Record<string, any>;
		col_count?: [number, "fixed" | "dynamic"];
		row_count?: [number, "fixed" | "dynamic"];
		root?: string;
		i18n?: (key: string, ...args: any[]) => string;
		upload?: any;
		stream_handler?: any;
		value_is_output?: boolean;
		display_value?: string[][] | null;
		styling?: string[][] | null;
		elem_id?: string;
		elem_classes?: string[];
		visible?: boolean;
	}

	export default class Dataframe extends SvelteComponent<DataframeProps> {}
}

declare module "@gradio/dataframe/shared/utils" {
	export type Datatype =
		| "str"
		| "markdown"
		| "html"
		| "number"
		| "bool"
		| "date";

	export type Headers = string[];
	export type Data = (string | number | boolean)[][];
	export type Metadata = Record<string, any>;

	export interface HeadersWithIDs {
		headers: string[];
		ids: string[];
	}

	export interface DataframeValue {
		data: Data;
		headers?: Headers;
		metadata?: Metadata;
	}

	export function cast_value_to_type(
		value: any,
		datatype: Datatype
	): string | number | boolean;
}

declare module "@gradio/dataframe/shared/context/dataframe_context" {
	export interface DataFrameContext {
		state: any;
		actions: any;
	}
}
