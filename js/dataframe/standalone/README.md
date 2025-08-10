@hmbgradio/dataframe-standalone
================================

Standalone Svelte component that brings Gradio's Dataframe UI to any Svelte/SvelteKit project. 

Install
-------

```
npm i @hmbgradio/dataframe-standalone
# or
pnpm add @hmbgradio/dataframe-standalone
```

Usage (Svelte/SvelteKit)
------------------------

```svelte
<script lang="ts">
  import Dataframe from "@hmbgradio/dataframe-standalone";

  const data = [
    ["Alice", 25, true],
    ["Bob", 30, false]
  ];

  const headers = ["Name", "Age", "Active"];
  const datatype = ["str", "number", "bool"];

  function handle_change(e: any) {
    console.log("changed", e.detail);
  }

  function handle_select(e: any) {
    console.log("selected", e.detail);
  }

  function handle_search(e: any) {
    console.log("searched", e.detail);
  }
</script>

<Dataframe
  value={data}
  {headers}
  {datatype}
  show_search="search"
  show_row_numbers={true}
  show_copy_button={true}
  show_fullscreen_button={true}
  editable={true}
  on:change={handle_change}
  on:select={handle_select}
  on:search={handle_search}
/>
```

Common Props
------------

- value?: (string | number | boolean)[][]
- headers?: string[]
- datatype?: string[] | string (e.g. "str" | "number" | "bool" | "markdown" | "html" | "date")
- editable?: boolean
- show_row_numbers?: boolean
- max_height?: number
- show_search?: "none" | "search" | "filter"
- show_copy_button?: boolean
- show_fullscreen_button?: boolean
- wrap?: boolean
- line_breaks?: boolean
- column_widths?: string[]
- max_chars?: number
- pinned_columns?: number
- static_columns?: (string | number)[]
- fullscreen?: boolean
- label?: string | null
- show_label?: boolean

Events
------

- change — emitted when data changes
- select — selection changes
- search — search/filter actions
- fullscreen — fullscreen toggle

```svelte
<Dataframe on:change={(e) => console.log(e.detail)} />
```

TypeScript
----------

The package publishes `types.d.ts` with `DataframeProps` module declarations.

Notes
-----

- Fullscreen button emits `fullscreen`; host decides container behavior. 

!!! fix this

License
-------

MIT

