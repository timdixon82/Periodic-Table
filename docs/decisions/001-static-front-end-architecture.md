# Decision Record 001: Static front-end architecture

## Status

Accepted. Decided by Jacob (architect) on 2026-05-21, during work 001-periodic-table-setup. Reviewed by Sonja.

## Context

Periodic-Table was adopted as a team project. It existed as a single file, `index.html`, of 466 lines. That file held the page structure (HyperText Markup Language, HTML), the presentation (Cascading Style Sheets, CSS, inline in a `<style>` block at lines 9 to 71), and the behaviour (JavaScript, inline in a `<script>` block at lines 118 to 464) all together.

The team's static front-end stack standard, in the global wiki at `stacks/static-front-end.md`, sets two structure rules:

- There is a clear entry point, `index.html`, with source organised by feature.
- Structure (HTML), presentation (CSS), and behaviour (JavaScript) are kept separate.

The single-file layout meets the first rule but not the second. This record decides whether to split the project into separate files, and how.

## Decision

The project will be split from one file into three, plus a small data file. The target layout is:

- `index.html`: the page structure only. It links the stylesheet and the script.
- `css/styles.css`: all presentation, moved out of the `<style>` block.
- `js/periodic-table.js`: all behaviour, moved out of the `<script>` block.
- `js/elements-data.js`: the element data set, the constant `ELEMENTS` array currently at lines 122 to 243.

The element data is separated from the behaviour because it is a different kind of content. The data is a list of 118 chemical elements that changes only when a fact is corrected. The behaviour is the code that builds the grid, handles the keyboard, and renders the detail panel. Keeping them apart means a data correction does not touch the logic, and the logic can be read without scrolling past 120 lines of data.

File names follow the team's kebab-case naming standard. The folders `css/` and `js/` group files by their kind, which suits a project this small. If the JavaScript later grows past a few hundred lines, it may be split further by feature (for example a grid module, a filter module, and a detail-panel module); that is a later decision, not part of this one.

This split is a refactor only. It must not change the page's behaviour, its appearance, or its accessibility. The HTML, CSS, and JavaScript move to new files unchanged in content.

## Alternatives considered

### Keep the single-file layout

Rejected. A single file is acceptable for a demo or a throwaway page, but Periodic-Table is now a maintained team project. The stack standard requires the three concerns to be separate, and there is a real cost to ignoring it: a 466-line file is hard to navigate with a screen reader, a change to the style risks disturbing the script, and the browser cannot cache the CSS or JavaScript separately from the HTML. The one advantage of a single file, that there is one thing to serve, does not outweigh these costs.

### Split into many feature folders now

Rejected as premature. The team's general standard is to prefer the simple solution and not to build for a future that has not been asked for. Four files with a flat `css/` and `js/` layout is enough for the project as it stands. A deeper structure can be added when the code grows enough to need it.

## Consequences

- Sean carries out the split as a refactor, with no change to behaviour, appearance, or accessibility. Carol's regression check confirms the page is unchanged.
- The browser can cache `css/styles.css` and the two JavaScript files separately from `index.html`, so a repeat visit downloads less.
- A future change to presentation, behaviour, or data touches one file, not one shared file, which lowers the risk of an accidental side effect.
- The Content-Security-Policy can move scripts and styles off the `'unsafe-inline'` allowance once they are in their own files. This is covered in Decision Record 003.
- The data set in `js/elements-data.js` becomes the single place to correct a chemical fact. Tad's requirements document and Jed's code review can reference it directly.
