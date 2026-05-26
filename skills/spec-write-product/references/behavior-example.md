# Example Behavior Section

A sample Behavior section for a hypothetical feature: rendering GitHub-flavored Markdown tables in a command output viewer that supports Markdown. It demonstrates the expected shape — stable `B1` / `B2` style, testable, user-perspective invariants that enumerate defaults, edge cases, malformed input, streaming, selection/copy, search, sharing, theming, and cross-surface consistency, with one inline open question.

````markdown
## Behavior

B1. When an output block contains a GitHub-flavored Markdown table (a header row, a separator row of one or more `---` segments, and one or more body rows, all delimited by `|`), that table renders as a visually formatted table in the block — not as raw pipe-delimited text.

B2. The table renders with:
   - A visually distinct header row.
   - Aligned columns based on the separator row: `|:---|` left-align, `|:---:|` center, `|---:|` right-align. `|---|` with no colons falls back to the default alignment (left for text, right for numeric-looking values).
   - Visible row separators (or equivalent spacing) consistent with the active theme.

B3. Inline markdown inside a cell renders inline: bold, italic, inline code, strikethrough, and links all render the same way they do in the surrounding block output. Line breaks inside a cell (`<br>` or escaped `\n`) render as in-cell line breaks.

B4. Column widths are chosen to fit the table's natural content when it fits inside the block. If a single cell's content is very long, that cell wraps its text within its column rather than forcing the column to an unreasonable width.
   - **Open question:** when a wrapped cell would produce an unreasonably tall row, do we clip with an "expand" affordance, or let the row grow unbounded?

B5. Horizontal scrolling: when the table's total width exceeds the block width — many columns, or wide columns that can't reasonably be narrowed — the table becomes horizontally scrollable within the block. Scrolling horizontally reveals off-screen columns without clipping or truncating them. Vertical scrolling of the block continues to work independently of table scroll.

B6. When the block is resized (window resize, pane split, sidebar open/close), the table reflows to the new width without losing row or column order.

B7. Empty cells render as visibly empty (same row height as surrounding cells, no placeholder text). A row with all empty cells still renders as a row.

B8. A table with only a header and separator (zero body rows) renders as a header-only table, not as raw text.

B9. A single-column table renders as a single-column table (not collapsed to a bullet list or similar).

B10. Malformed tables fall back gracefully:
    - Missing separator row → rendered as preformatted text, not as a table.
    - Ragged rows (some rows have fewer or more cells than the header) → missing cells render empty; extra cells are shown, with the header row extended visually if possible. The block should never silently drop data.
    - Unclosed table (last row truncated mid-stream) → rendered as a partial table; see B11.

B11. Streaming output: while a command is still producing rows, the table renders incrementally. New rows append as they arrive. The header row locks in as soon as the separator line is received; rows before the separator render as plain text until the table is recognized.

B12. Selection and copy:
    - Selecting across cells with the mouse or keyboard selects their visible text content.
    - Copying the selection produces tab-separated plain text by default (one row per line, cells separated by tabs). An affordance (context menu, shortcut) lets the user copy the original markdown source instead.
    - Copying the entire block preserves the original markdown source verbatim.

B13. Search within a block (find-in-block) matches against cell text content. Matches highlight in place in the rendered cell; navigating matches scrolls the table into view, including horizontally if the match is in an off-screen column.

B14. Sharing or exporting a block (share link, save as file, archive, or another product-specific export surface) preserves the original markdown source, not the rendered form.

B15. Theming: table borders, header backgrounds, alternating row shading (if any), and link/code styles all come from the active product theme or design system. No hard-coded colors.

B16. Markdown tables render consistently wherever block-list markdown already renders — command output, agent responses, and any other block type that supports inline markdown. The same input produces the same table in each surface.

B17. Non-table pipe content is not misrendered as a table. Text that contains `|` characters but no valid header-separator line remains plain text, even if it visually resembles a table.
````
