# Accessibility exception: WCAG 1.4.10 Reflow

- **Criterion:** 1.4.10 Reflow, Level AA.
- **Scope:** The periodic table grid on `https://projects.timdixon.net/Periodic-Table/`.
- **Work item:** 003-periodic-table-accessibility, Phase 2.
- **Exception raised by:** Simon (designer), 2026-05-21.

## Reason

A periodic table is a two-dimensional layout whose spatial arrangement carries chemical meaning. The position of each element in the table (its group column and period row) is the primary information structure of the tool. Elements in the same column share chemical properties; elements in the same row share the same valence electron shell. A single-column reflow would destroy this structure and make the tool meaningless.

WCAG 1.4.10 explicitly recognises this class of content: "Content that requires two-dimensional layout for usage or meaning" is listed as an explicit exception to the reflow requirement.

## Mitigation

At 320 CSS pixels width, the grid is horizontally scrollable within its wrapper. The following controls remain fully accessible at 320 pixels.

- The search input and filter buttons reflow into a wrapping flex row and remain operable at any width.
- A user who cannot navigate the scrolling grid at 320 pixels can search by element name, chemical symbol, or atomic number to locate any element and view its full details in the info panel.
- The info panel itself reflows correctly at 320 pixels.
- The legend section reflows correctly at 320 pixels.

The search-and-detail path means that all element information is accessible without navigating the grid.

## Tim's approval

Pending. Required before this branch is merged to main.
