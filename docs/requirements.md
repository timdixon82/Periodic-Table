# Requirements: Periodic-Table

This document records the business analysis for the Periodic-Table project. It was reverse-engineered from `index.html` as part of work 001-periodic-table-setup. It covers purpose, target users, scope, functional requirements, non-functional requirements, and acceptance criteria.

## 1. Purpose

Periodic-Table is a static, interactive periodic table of the chemical elements. It runs entirely in the browser with no server and no build step. It is hosted on GitHub Pages.

The problem it solves: most periodic table tools available on the web are either inaccessible to users of assistive technology (AT), or they are heavy web applications that load slowly and depend on external services. This project delivers a lightweight, single-file reference tool that is fully keyboard-navigable and screen-reader-friendly from the outset.

## 2. Target users

### 2.1 General users

Anyone who needs to look up a chemical element: students, educators, hobbyists, researchers, and professionals in chemistry, physics, materials science, and related fields. The tool is a quick reference, not a deep database; it suits casual enquiry and everyday classroom use.

### 2.2 Users of assistive technology

This project is accessibility-focused from its foundation. The team's owner, Tim Dixon, is severely sight-impaired and uses VoiceOver on macOS and JAWS on Windows. The project must work correctly with both screen readers.

The table is, by tradition, a two-dimensional visual grid. Making that grid usable without sight requires deliberate decisions: a keyboard-navigable grid role, descriptive accessible names on every element cell, live region announcements when an element is selected or a filter applied, skip links to reach the main regions directly, and a colour legend that is supplemented by text, not only by colour.

Any user who navigates by keyboard alone, or who uses a switch device, must be able to reach and operate every feature.

## 3. Scope

### 3.1 In scope

- A periodic table of all 118 known chemical elements.
- Per-element data: atomic number, chemical symbol, name, atomic mass, element category, standard state at room temperature, group, period, and a short plain-language description.
- A searchable, filterable interface: free-text search by name, symbol, or atomic number; toggle filters by the ten element categories.
- An element detail panel that displays all stored data for the selected element.
- A colour-coded category legend.
- Keyboard navigation throughout, including arrow-key grid navigation.
- Screen-reader support: accessible names, live region announcements, skip links, and ARIA (Accessible Rich Internet Applications) roles.
- A single-file delivery: everything embedded in `index.html` with inline CSS and inline JavaScript, no build tooling, no external dependencies except the Google Fonts stylesheet.

### 3.2 Out of scope

- User accounts, sign-in, or personalisation.
- Storing or processing any personal data.
- Server-side rendering or any back-end component.
- Detailed chemistry data beyond what is listed in 3.1: electron configuration, oxidation states, electronegativity, ionisation energies, thermodynamic data, isotope tables, and so on.
- Images or photographs of elements.
- 3D models or interactive diagrams.
- Printing or export to PDF or other formats.
- Dark-mode or light-mode toggle (the application uses a fixed dark theme).
- Translations or localisation into languages other than English.
- Offline support or a Progressive Web App (PWA) manifest.

## 4. Functional requirements

The following requirements are derived from what `index.html` actually implements.

### 4.1 Page structure and navigation

1. The page shall present one level-one heading ("Periodic Table of Elements") as the page title.
2. The page shall provide skip links that allow users to jump directly to: the search field, the periodic table grid, and the element detail panel.
3. A screen-reader-only live region shall announce changes of state, including element selection and filter changes, without moving keyboard focus.
4. The page layout shall be responsive and shall not cause horizontal scrolling of the page body on viewports of 375 CSS (Cascading Style Sheets) pixels and above.

### 4.2 Periodic table grid

5. The grid shall display all 118 chemical elements in their standard periodic table layout: 18 columns and 7 main rows, plus a gap row, plus 2 lanthanide and actinide rows below the gap.
6. Each element cell shall show: the atomic number, the chemical symbol, and the element name.
7. Each element cell shall carry a full accessible label readable by screen readers, containing: element name, symbol, atomic number, element category, standard state at room temperature (where known), and atomic mass.
8. Elements whose standard state is unknown shall omit the state from the accessible label.
9. The two placeholder cells for the lanthanide and actinide series (at row 6, column 3 and row 7, column 3) shall announce their range (lanthanides 57 to 71; actinides 89 to 103) and shall, when activated, move focus to the first element in the corresponding row below.
10. Empty cells shall be hidden from the accessibility tree.
11. The element category shall be reflected visually by a colour-coded top border on each cell and by a CSS custom property, so that the colour is determined by the category and not hard-coded per element.

### 4.3 Keyboard navigation within the grid

12. The grid shall use a roving tab-index pattern so that only one cell is in the tab sequence at any time.
13. The arrow keys shall move focus between cells in the expected directions: right, left, down, and up.
14. When moving to a row that has a gap at the target column, focus shall move to the nearest occupied cell in that row.
15. The Home key shall move focus to column 1 of the current row.
16. The End key shall move focus to column 18 of the current row (or the nearest occupied cell).
17. When the search field has focus, pressing Arrow Down shall move focus to the first visible (non-dimmed) element cell.

### 4.4 Element selection and the detail panel

18. Activating an element cell (by pressing Enter, Space, or clicking) shall select it and display its full data in the element detail panel.
19. Selecting an element shall mark it as selected (aria-selected="true") and deselect any previously selected element.
20. The detail panel shall display: the element name, chemical symbol, atomic number, atomic mass, element category, standard state, period, group (for elements in groups 3 to 18), and a plain-language description of up to approximately 200 words.
21. The detail panel shall update its top border colour to match the selected element's category colour.
22. When an element is selected, the live region shall announce the element name, symbol, atomic number, and the first 120 characters of the description.
23. Before any element is selected, the detail panel shall display a placeholder instruction: "Select an element from the table above to view its details."

### 4.5 Search

24. The search field shall accept free-text input and filter element cells in real time as the user types.
25. Search shall match: element name (substring match), chemical symbol (prefix match), and atomic number (exact match).
26. Matching shall be case-insensitive.
27. Element cells that do not match the current search shall be visually dimmed and removed from keyboard navigation.
28. After each search, the live region shall announce the count of matching elements and the search term.

### 4.6 Category filters

29. Ten toggle buttons shall be provided, one for each element category: Alkali Metals, Alkaline Earth, Transition Metals, Post-Transition, Metalloids, Nonmetals, Halogens, Noble Gases, Lanthanides, and Actinides.
30. Each filter button shall carry an aria-pressed attribute that toggles between "true" and "false".
31. Activating a filter button that is not pressed shall set it to pressed and dim all element cells whose category does not match.
32. Activating a filter button that is already pressed shall clear the filter and restore all element cells to full visibility.
33. Only one category filter shall be active at a time; activating a second filter shall clear the first.
34. Filters and search shall compose: a cell must satisfy both the active filter and the active search term to remain visible.
35. When a filter is applied or cleared, the live region shall announce the change.

### 4.7 Colour legend

36. A colour legend shall be visible below the periodic table grid, listing all ten element categories with their corresponding colour swatch.
37. The legend shall not rely on colour alone to convey category names; each swatch shall be accompanied by a text label.

## 5. Non-functional requirements

### 5.1 Accessibility

38. The application shall conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AAA.
39. Colour contrast for all text shall meet the AAA ratio of 7:1 against its background, except for large text (18 pt or 14 pt bold and above), which shall meet 4.5:1.
40. Colour shall not be the only means of conveying information; every category that is communicated by colour shall also be communicated in text (via accessible labels and the legend).
41. The application shall be fully operable by keyboard alone.
42. Focus indicators shall be visible and shall meet the AAA enhanced focus visibility requirements of WCAG 2.2 Success Criterion 2.4.13.
43. All interactive elements shall have accessible names.
44. The grid shall use ARIA grid semantics (role="grid", role="gridcell", aria-rowindex, aria-colindex, aria-selected, aria-rowcount, aria-colcount) so that screen readers can communicate position and state.
45. Live region announcements (aria-live="polite", aria-atomic="true") shall inform screen-reader users of state changes without moving focus.
46. The page shall include three skip links (to search, to the grid, and to the detail panel) and the skip links shall be visible on keyboard focus.
47. No time limits are imposed on any interaction.
48. No content flashes or flickers at a rate that could trigger photosensitive seizures.

### 5.2 Performance

49. The application shall load and become interactive in under two seconds on a standard broadband connection (10 Mbit/s or faster), measured from a cold cache.
50. The only external resource the page loads at runtime shall be the Google Fonts stylesheet and its associated font files. All application logic and styling shall be inline.
51. No JavaScript framework or third-party library shall be introduced; the application shall use plain HTML, CSS, and JavaScript only.

### 5.3 Browser support

52. The application shall function correctly in the current stable release and the immediately preceding stable release of: Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge.
53. The application shall function correctly with VoiceOver on macOS (current and one prior release) and JAWS on Windows (current release), paired with the browsers listed above.

### 5.4 Data and privacy

54. The application shall not collect, store, transmit, or process any personal data.
55. No cookies shall be set and no local storage shall be written to.
56. No analytics, tracking scripts, or third-party JavaScript shall be loaded.
57. No network request shall be made at runtime other than the Google Fonts stylesheet fetch. Confirmation: a review of `index.html` shows no fetch calls, XMLHttpRequest calls, WebSocket connections, or cookie or storage writes. The Google Fonts link in the `<head>` is the only external request.

### 5.5 Hosting and deployment

58. The application shall be served as a static site from GitHub Pages with no server-side processing.
59. The entry point shall be `index.html` at the repository root.

## 6. Acceptance criteria

Each criterion is testable as true or false.

### 6.1 Page structure

- [ ] The page has exactly one H1 element, reading "Periodic Table of Elements".
- [ ] Three skip links are present in the DOM (Document Object Model) before the header: one to `#search`, one to `#pt-grid`, and one to `#info-panel`.
- [ ] Each skip link becomes visible when it receives keyboard focus.
- [ ] A `div` with `id="sr-live"`, `aria-live="polite"`, and `aria-atomic="true"` is present and off-screen by default.

### 6.2 Grid rendering

- [ ] All 118 elements are rendered as buttons within the grid.
- [ ] Each element button has an `aria-label` that includes the element name, symbol, atomic number, category, and atomic mass.
- [ ] Elements with a known state include the state in the `aria-label`.
- [ ] Elements with an unknown state do not include a state phrase in the `aria-label`.
- [ ] The lanthanide placeholder button has the label "Lanthanides 57 to 71. Activate to jump to the lanthanide series below." (or equivalent text conveying the same information).
- [ ] The actinide placeholder button has the label "Actinides 89 to 103. Activate to jump to the actinide series below." (or equivalent text conveying the same information).
- [ ] Activating the lanthanide placeholder moves keyboard focus to the first element in row 9.
- [ ] Activating the actinide placeholder moves keyboard focus to the first element in row 10.

### 6.3 Keyboard navigation

- [ ] Arrow Right moves focus one column to the right, or to the nearest occupied cell if the target column is empty.
- [ ] Arrow Left moves focus one column to the left, or to the nearest occupied cell.
- [ ] Arrow Down moves focus to the same column in the next row, or the nearest occupied cell in that row.
- [ ] Arrow Up moves focus to the same column in the previous row, or the nearest occupied cell.
- [ ] Home moves focus to the first occupied cell in the current row.
- [ ] End moves focus to the last occupied cell in the current row.
- [ ] Pressing Arrow Down while the search field has focus moves focus to the first visible element cell.
- [ ] Only one grid cell has `tabindex="0"` at any time; all others have `tabindex="-1"`.
- [ ] Tab moves focus out of the grid and to the next focusable element in the page.

### 6.4 Element selection and detail panel

- [ ] Pressing Enter or Space on an element cell, or clicking it, displays that element's data in the detail panel.
- [ ] The previously selected element's `aria-selected` is set to "false" and the newly selected element's `aria-selected` is set to "true".
- [ ] The detail panel shows the name, symbol, atomic number, atomic mass, category, state, period, and description.
- [ ] Elements in groups 3 to 18 show a group number tag; elements in groups 1 and 2 do not show a group tag.
- [ ] The detail panel's top border changes colour to match the selected element's category.
- [ ] The live region text is updated with the element name, symbol, atomic number, and the opening of the description.
- [ ] Before any element is selected, the detail panel shows the placeholder text.

### 6.5 Search

- [ ] Typing a full element name (any case) in the search field shows only that element; all others are dimmed.
- [ ] Typing a partial name shows all elements whose name contains that substring.
- [ ] Typing a symbol prefix shows all elements whose symbol starts with that text.
- [ ] Typing an atomic number shows only the element with that exact atomic number.
- [ ] The live region announces the count of matching elements after each keystroke.
- [ ] Dimmed elements cannot be reached by arrow-key navigation within the grid.

### 6.6 Category filters

- [ ] Each of the ten filter buttons is present with the correct `data-cat` value.
- [ ] Clicking an unpressed filter button sets `aria-pressed="true"` on that button and dims all elements in other categories.
- [ ] Clicking the same button again sets `aria-pressed="false"` and restores all elements.
- [ ] Clicking a second filter button while a first is active clears the first and applies the second.
- [ ] The live region announces when a filter is applied and when it is cleared.

### 6.7 Colour legend

- [ ] All ten categories appear in the legend, each with a colour swatch and a text label.
- [ ] The legend is present in the accessibility tree with the label "Category colour legend".

### 6.8 Accessibility: WCAG 2.2 AAA

- [ ] An automated accessibility scan (such as Axe or Wave) returns zero critical or serious violations.
- [ ] All text elements pass a 7:1 contrast ratio against their background when checked with a contrast analyser.
- [ ] The category colour legend swatches each have a text label; no information is conveyed by colour alone.
- [ ] All interactive elements have an accessible name that a screen-reader user can hear.
- [ ] VoiceOver on macOS can navigate the grid with arrow keys, hear each element's name and details, use search and filters, and hear the detail panel update.
- [ ] JAWS on Windows can perform the same tasks listed in the criterion above.
- [ ] No keyboard trap exists anywhere on the page.
- [ ] Focus indicators are visible on all interactive elements at all times when navigating by keyboard.

### 6.9 Performance

- [ ] The page achieves a Lighthouse Performance score of 90 or above on a simulated mid-range device.
- [ ] The only network requests at runtime are for the Google Fonts stylesheet and its font files; no other external requests appear in the browser's network panel.

### 6.10 Privacy

- [ ] Inspection of `index.html` and the browser's network panel confirms no analytics scripts, tracking pixels, cookies, or local storage writes are present.
