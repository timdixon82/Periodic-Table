# Phase 1 Verification Report: Periodic-Table Project Setup

Verification date: 2026-05-21
Auditor: Carol (tester agent)
Branch: chore/project-setup
Work folder: 001-periodic-table-setup
Standard: Web Content Accessibility Guidelines (WCAG) 2.2, AAA conformance

## Automated Tool Results

The permission system blocked all process-execution commands during this session. The following commands were attempted and denied: python3 -m http.server, node, npx, npm run lint, and related server-launch and tool-execution commands. The denials applied to every execution attempt, including the project's own linters (html-validate, stylelint, eslint).

As a result, axe-core and Pa11y could not be run. This is a gap that must be resolved before this branch is merged. The baseline audit had the same gap, and it was carried forward with a note that automated runs were required. That note still stands.

The denial affects only live automated scanning. All source files were read in full and the code-level analysis below is based on direct inspection of index.html, css/styles.css, js/periodic-table.js, js/elements-data.js, and the project documentation in docs/.

Action required: Before merge, Sonja should ensure that axe-core and Pa11y are run against the page served locally (for example, with python3 -m http.server 8080 from the project root) or against the live URL https://projects.timdixon.net/Periodic-Table/ on the chore/project-setup branch. The automated run should be conducted in a session where process-execution permission is available.

## Scope of This Verification

Phase 1 is described as behaviour-neutral and appearance-neutral. The changes are:

1. Single index.html split into index.html, css/styles.css, js/elements-data.js, and js/periodic-table.js.
2. Google Fonts link removed; three font families self-hosted under assets/fonts/ with @font-face rules.
3. A Content-Security-Policy (CSP) meta tag and a Referrer-Policy meta tag added.
4. Three code-review fixes: innerHTML replaced with DOM methods; integer guard added in selectElement; code comment added in announce().
5. Linter-driven changes: type="button" added to ten filter buttons; div.legend changed to section.legend; redundant aria-label removed from search input; legend dot inline styles moved to CSS classes; a border-radius value shortened.

## Structural and Functional Verification

### File split

The split is clean. index.html links css/styles.css via a stylesheet link element and js/elements-data.js and js/periodic-table.js via two script tags at the end of body, in the correct order (data file first, logic file second). The logic file declares 'use strict' at the top. ELEMENTS is defined in elements-data.js as a var-like top-level const and consumed by periodic-table.js as a browser global, which the eslint config registers as a writable global named ELEMENTS. This is consistent with the module pattern the project uses (classic scripts, no ES module import/export).

All 118 elements are present in elements-data.js. The grid-building logic in periodic-table.js is unchanged in behaviour: it iterates the same row order [1, 2, 3, 4, 5, 6, 7, 'gap', 9, 10] and the same 18-column loop.

Verdict: PASS. The split introduces no functional change.

### Self-hosted fonts

The assets/fonts/ directory contains eleven woff2 files covering all three font families (Rajdhani at four weights, Share Tech Mono at one weight, Nunito Sans at three weights). License files are present for each family. The @font-face rules in css/styles.css declare each weight with the correct src path (../assets/fonts/filename.woff2), correct font-weight value, and font-display: swap.

The CSP style-src directive is 'self', which permits the stylesheet served from the same origin. The font-src directive is 'self', which permits the self-hosted woff2 files. The Google Fonts preconnect and stylesheet link are gone, removing the third-party dependency that Jed flagged in code-review Finding 2.

Verdict: PASS. Font self-hosting is complete and consistent with the CSP.

### CSP and Referrer-Policy meta tags

The CSP meta tag is present at line 29 of index.html with the policy: default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'.

This is appropriate for the page as built. No inline scripts or inline styles remain that would require 'unsafe-inline'. The two previously documented exceptions (X-Frame-Options and Permissions-Policy unavailable on GitHub Pages) are recorded in docs/exceptions/001-security-headers.md and were approved by Tim on 2026-05-21.

The Referrer-Policy meta tag is present at line 36 with content="strict-origin-when-cross-origin". Jed's code-review Finding 6 recommended 'no-referrer'; the team used 'strict-origin-when-cross-origin', which is slightly more permissive but is a recognised standard value. This is a minor deviation from the recommendation, not a regression.

Verdict: PASS. Both security meta tags are correctly placed and scoped.

### Code-review fixes

#### innerHTML replaced with DOM methods

The buildGrid function (js/periodic-table.js lines 59 to 156) builds each element button using document.createElement, textContent, and setAttribute. No innerHTML or template-literal HTML string appears in buildGrid.

The renderInfo function (lines 262 to 350) builds the detail panel content using the same DOM construction pattern. The makeStatBox helper (lines 353 to 368) also uses DOM methods. No innerHTML appears anywhere in periodic-table.js or elements-data.js.

This resolves Jed's code-review Finding 1. The fix is complete and correct.

#### Integer guard in selectElement

The selectElement function (line 238) now opens with: n = parseInt(n, 10); if (!Number.isFinite(n)) { return; }. This prevents a malformed data-n attribute from reaching the querySelector template string. Jed's Finding 4 is resolved.

#### Code comment in announce()

The announce function (line 374) has a block comment explaining that srLive.textContent must always be used and never srLive.innerHTML. Jed's Finding 5 is resolved. The comment is accurate and will persist as a maintenance guard.

Verdict: PASS. All three code-review fixes are correctly implemented.

### Linter-driven changes

#### type="button" on filter buttons

All ten filter buttons in index.html (lines 52 to 61) now carry type="button". In a form element, buttons without a type default to type="submit". Outside a form, the default type is also "submit" in some browser interpretations. Adding type="button" makes intent explicit and prevents any accidental form submission if the page is ever wrapped in a form element. This is a correct improvement.

Accessibility impact: None. The buttons already had role inferred from the button element. aria-pressed is unchanged. This is neutral.

#### div.legend changed to section.legend

The legend container at index.html line 71 is now a section element with class="legend" and aria-label="Category colour legend".

This is relevant to baseline Finding 5, which noted that the legend div had aria-label on a plain div with no landmark role. The baseline recommendation was to add role="region" to the legend div to make it appear as a landmark. Changing the element to a section achieves the same result: a section element with an accessible name is exposed as a region landmark by browsers and screen readers.

Assessment: This change partially remediates baseline Finding 5. It is a behaviour-neutral change in that the visual appearance is unchanged and the content is unchanged. However, it does improve the accessibility tree by promoting the legend to a named landmark, which is strictly an improvement over the baseline, not a regression. Because Phase 1 is described as behaviour-neutral and appearance-neutral but is permitted to include linter-driven fixes, this is acceptable. The improvement is minor and does not affect any other finding.

Note: The finding that the div had no landmark role is now resolved for the legend specifically. The broader Finding 5 issue (the controls div using role="search" for both the search field and filter buttons) remains open and is out of scope for Phase 1.

#### Redundant aria-label removed from search input

Baseline Finding 10 identified that the search input had both a label element (id="search", class="sr-only") and an aria-label attribute on the input itself. The aria-label overrode the label element for screen readers. The two strings were slightly different, which could cause a mismatch for voice-control users under WCAG 2.5.3 Label in Name.

Phase 1 removed the aria-label from the input. The input at index.html line 50 now relies solely on the label element (line 49): label for="search" class="sr-only" with text "Search elements by name, symbol or atomic number". The input has no aria-label.

Assessment: This directly resolves baseline Finding 10 in part (the redundant attribute and the text mismatch are gone). The label element association via for/id is correct. The screen reader will now read the label element text, which is the intended accessible name. This is a correct fix and an improvement over the baseline.

WCAG 2.5.3 check: The input has no visible text label (the label is hidden with .sr-only). The placeholder "Search elements..." is not the accessible name. Voice control users would say the label text ("search elements by name, symbol or atomic number") or the placeholder text. The placeholder is not the accessible name, so a voice control user saying "search elements" may or may not activate the field depending on the tool. This nuance is unchanged from the baseline and is not a new regression.

#### Legend dot inline styles moved to CSS classes

The baseline noted that the legend dots previously had inline style attributes (e.g. style="background: var(--alkali)"). These have been replaced with CSS classes: legend-dot--alkali, legend-dot--alkaline, and so on. The CSS classes are defined in css/styles.css at lines 507 to 516.

This change was required to keep the CSP style-src at 'self' (inline styles would require 'unsafe-inline'). The visual result is identical. The accessibility tree is unchanged: the dots carry aria-hidden="true" and the text labels remain adjacent.

Verdict: PASS. No accessibility regression. The fix is correct and necessary for CSP compliance.

#### Border-radius value shortened

The baseline CSS had border-radius: 0 0 6px 0 on the skip link (or similar). The Phase 1 CSS shows border-radius: 0 0 6px on the skip link at css/styles.css line 116. This shortens the four-value shorthand to three values: the missing fourth value defaults to the same as the second value (0). The visual result is identical. No accessibility impact.

Verdict: PASS.

## Behaviour-Neutral and Appearance-Neutral Confirmation

The following functional behaviours were verified by code inspection:

- Grid construction: buildGrid iterates the same row and column sequence as the original single-file implementation. All 118 element buttons are created with the same attributes (role, aria-rowindex, aria-colindex, aria-selected, tabindex, aria-label, data-n, data-row, data-col, data-cat). The roving tab-index pattern is preserved.
- Keyboard navigation: handleGridKeydown, setRovingTabindex, findNearest, and jumpToRow are functionally identical to the original.
- Element selection and detail panel: selectElement and renderInfo produce identical DOM output to the original innerHTML approach, but using safe DOM construction. The visible content (name, tags, stats, description) is the same. The accessible content is unchanged.
- Search: applyFilters is functionally identical.
- Filters: Filter button click handlers are functionally identical. The aria-pressed toggle, the activeFilter variable, and the announce call are unchanged.
- Live region: announce() is functionally identical. The requestAnimationFrame double-assignment pattern that resets the live region before writing new content is preserved.
- Skip links: Three skip links are present with the same href values (#search, #pt-grid, #info-panel).
- Colour: All CSS custom properties (--alkali, --alkaline, etc.) are unchanged. The grid cell colours, info panel border colour, and legend dot colours are visually identical.

Verdict: PASS. Phase 1 is behaviour-neutral and appearance-neutral.

## Accessibility Regression Analysis

This section compares Phase 1 against the 21 baseline findings to confirm no regression and no unexpected change.

### Findings confirmed unchanged (expected to remain open, out of scope for Phase 1)

Finding 1 (Critical): Colour contrast failures across category colours and muted text. Unchanged. The colour palette CSS custom properties are identical. No regression, no fix. Open.

Finding 2 (Critical): Colour used alone in legend. Unchanged in substance: each legend dot is still colour-coded with adjacent text. The change from div to section does not affect this finding. Open.

Finding 3 (Major): aria-rowcount="9" on a grid with 10 data rows; inconsistent aria-rowindex for lanthanide and actinide rows. aria-rowcount is still "9" on line 66 of index.html. aria-rowindex is still calculated as rowNum <= 7 ? rowNum : rowNum - 1 in periodic-table.js line 84. Unchanged. Open.

Finding 4 (Major): info-panel section combining aria-live and tabindex="-1". The info-panel section at index.html line 68 still has both aria-live="polite" and tabindex="-1". Unchanged. Open.

Finding 5 (Major): Missing landmark structure, role="search" wrapping both search and filters. The controls div at line 48 still has role="search" and aria-label="Filter elements". The section.legend improvement partially addresses one aspect (legend now has landmark role), but the controls landmark issue is unchanged. Partially open (legend part improved, controls part open).

Finding 6 (Major): Filter button target size below 44px AAA threshold. The filter-btn CSS is unchanged: padding 6px 12px, font-size 0.78rem. Unchanged. Open.

Finding 7 (Major): Focus indicator for el-btn uses category colour (variable contrast). The el-btn:focus-visible rule at css/styles.css line 294 still uses outline: 2px solid var(--el-color). Unchanged. Open.

Finding 8 (Major): info-name div not marked as a heading; stat-box labels not associated with values. The renderInfo function still creates a div with class="info-name" (line 299 of periodic-table.js). No heading role. makeStatBox still creates s-label and s-val as sibling divs with no association. Unchanged. Open.

Finding 9 (Major): Skip link target for #pt-grid is a non-focusable div. The grid wrapper div with id="pt-grid" is still a div with role="grid". It has no tabindex. The skip link behaviour is unchanged. Open.

Finding 10 (Minor): Redundant aria-label on search input, text mismatch. Resolved by Phase 1 (aria-label removed). This finding is now closed. The resolution is correct.

Finding 11 (Minor): Scientific abbreviations without expansion in element descriptions. The elements-data.js content is unchanged (data file only). Open.

Finding 12 (Minor): Reflow exception needed for the two-dimensional grid. Unchanged. Open.

Finding 13 (Minor): Text spacing and text resize at 200% need testing. Unchanged. Open.

Finding 14 (Minor): No finding (timing). Not applicable.

Finding 15 (Minor): No prefers-reduced-motion media query. The CSS has no @media (prefers-reduced-motion) rule. Unchanged. Open.

Finding 16 (Minor): Line length not capped for info-desc; text-transform uppercase on filter buttons. Unchanged. Open.

Finding 17 (Minor): Live region announces only first 120 characters of description. announce() at line 349 still uses el.desc.substring(0, 120). Unchanged. Open.

Finding 18 (Advisory): Location (single-page, no breadcrumb needed). Not applicable.

Finding 19 (Advisory): Reading level of element descriptions. elements-data.js content is unchanged. Open.

Finding 20 (Advisory): No visible section headings for grid, info panel, and legend. Grid has no visible heading. Info panel heading issue is unchanged (tied to Finding 8). Legend heading: now the section element with aria-label="Category colour legend" is a named landmark, which improves screen reader navigation by landmark, but there is still no visible heading text. Partially improved; open.

Finding 21 (Advisory): Filter button labels ("Alkaline Earth") do not match full category names ("Alkaline Earth Metal") used in element aria-labels. Unchanged. Open.

Finding 22 (Advisory): 1.3.6 Identify Purpose. Unchanged. Open.

### Summary of baseline finding status after Phase 1

- Closed by Phase 1: Finding 10 (redundant aria-label on search input).
- Partially improved by Phase 1: Finding 5 (legend now a section landmark) and Finding 20 (legend section has accessible landmark role).
- All other findings (1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 15, 16, 17, 19, 21, 22): unchanged, neither fixed nor made worse.

No new accessibility problems were introduced by Phase 1.

## New Issues Introduced by Phase 1

None found by code inspection.

The self-hosted font change removes a third-party network dependency. The CSP addition strengthens security. The DOM-method refactor removes an XSS-latent pattern. The type="button" addition is defensive. The section.legend change improves landmark structure. The aria-label removal from the search input resolves a real conflict. None of these changes introduces a new accessibility barrier.

## Open Questions Inherited from Baseline

The five questions raised in the baseline audit remain unanswered (they were routed to Sonja for Tim). They are listed here for completeness and are not blocking Phase 1:

1. Colour palette: Should the dark theme be maintained and category colours adjusted to 7:1, or is a light theme also acceptable?
2. Reflow exception: Is the existing search interface sufficient as the alternative access route at 320px, or should a linearised list view be added?
3. Abbreviation handling: Should scientific abbreviations be expanded inline or via a linked glossary page?
4. Reading level: Should simpler supplementary descriptions be written, or does the scientific audience justify a documented exception?
5. Filter button labels: Should "Alkaline Earth" be updated to "Alkaline Earth Metal" for consistency with element aria-labels?

## Verdict

Phase 1 introduces no accessibility regression relative to the baseline audit.

The one automated-tool gap (axe-core and Pa11y blocked by the permission system) must be resolved before merge. All other verification is based on direct code inspection of all four source files and matches the expected Phase 1 scope.

Phase 1 is fit to merge, subject to automated tool confirmation, with the 20 remaining baseline findings recorded as known and carried into Phase 2.

---

Usage tracking:
- Token count: not available from within the agent session.
- Tool calls: approximately 26 Read and Bash calls (9 Bash denials, 17 successful reads or ls commands).
- Duration: single session, estimated 8 to 10 minutes elapsed.
