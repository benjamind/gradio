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

Custom Styling
--------------

The package publishes `dataframe.css` with the default styles. You can override the styles by adding your own CSS.

Option 1: Override the internal design tokens

```svelte
  <div class="df-theme">
      <Dataframe ... />
    </div>

    <style>
      .df-theme {
        --border-color-primary: #7c3aed;
        --radius-md: 10px;
        --background-fill-primary: #0b1020;
        --table-even-background-fill: #121936;
        --table-odd-background-fill: #0e1530;
        --body-text-color: #e5e7eb;
        --input-text-size: 14px;
      }
    </style>
```

Option 2: Override the internal styles

```svelte
    <div class="df-override">
      <Dataframe ... />
    </div>

    <style>
      /* Border only wraps the actual table */
      .df-override :global(.table-wrap) {
        border: 1px solid #7c3aed;
        border-radius: 10px;
        overflow: hidden;
      }

      /* Header/row styling */
      .df-override :global(.thead th) {
        background: #1f2937;
        color: #fff;
      }
      .df-override :global(.tbody td) {
        padding: 8px 10px;
      }

      /* Pinned column divider */
      .df-override :global(td.last-pinned),
      .df-override :global(th.last-pinned) {
        border-right: 1px solid #7c3aed;
      }
    </style>
```


Notes
-----

- Fullscreen button emits `fullscreen`; host decides container behavior. 

!!! fix this

License
-------

MIT

