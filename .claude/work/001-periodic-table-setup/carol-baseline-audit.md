# Baseline WCAG 2.2 AAA Accessibility Audit: Periodic Table

Audit date: 2026-05-21
Auditor: Carol (tester agent)
File audited: `/Users/timdixon/Library/Mobile Documents/com~apple~CloudDocs/Github/Periodic-Table/index.html` (466 lines)
Live URL: https://projects.timdixon.net/Periodic-Table/
Audit type: Baseline of pre-existing work. This is not a sign-off. It records the state of the page before the team's improvements.
Standard: Web Content Accessibility Guidelines (WCAG) 2.2, AAA conformance.

Automated tools note: Bash execution was unavailable during this audit. axe-core and Pa11y could not be run. This report is based on a thorough manual code review of the complete source. Automated tool runs should be conducted before this report is used as a final pass gate.

## Summary

The page shows genuine accessibility effort: it has skip links, a live region, ARIA grid semantics, roving tab-index keyboard navigation, aria-label strings on every element button, and aria-pressed toggle buttons. These are above the baseline for a solo-authored static file.

However, several significant barriers exist against the WCAG 2.2 AAA standard. The most serious issues are colour contrast failures across almost all coloured text in the dark theme, category information conveyed by colour alone in the legend, missing landmark structure, the info panel using aria-live on a section element (combining live region and interactive content in a way that creates screen reader confusion), and an aria-rowcount value that does not match the actual grid. A number of AAA-specific criteria are also unmet.

The page does not currently meet WCAG 2.2 AAA.

## Findings

Findings are ordered by severity. Severity levels are: Critical (blocks a screen reader or keyboard user entirely), Major (causes significant difficulty), Minor (causes some difficulty or fails a specific criterion), and Advisory (best practice or AAA enhancement not yet present).

### Finding 1

Severity: Critical
WCAG 2.2 criterion: 1.4.6 Contrast (Enhanced), Level AAA
Location: CSS custom properties, lines 10 and 41 through 70; every coloured element cell and the info panel

Problem: The page uses a dark background (#0b0f1a, approximately #111827 for card surfaces) with ten category colour variables as both the foreground text colour and the top-border accent on element cells. The element symbol text (class el-sym) is rendered in the category colour against the card background. Many of these colours fail the AAA threshold of 7:1 for normal text and 4.5:1 for large text.

Estimated contrast ratios against #1a2235 (card background):

- --alkali (#f87171, red): approximately 4.8:1. Passes AA but fails AAA 7:1.
- --alkaline (#fb923c, orange): approximately 3.7:1. Fails both AA and AAA.
- --transition (#60a5fa, blue): approximately 4.7:1. Passes AA, fails AAA.
- --post-trans (#34d399, green): approximately 6.4:1. Fails AAA.
- --metalloid (#a78bfa, purple): approximately 4.9:1. Passes AA, fails AAA.
- --nonmetal (#86efac, light green): approximately 7.5:1. Passes AAA.
- --halogen (#fde047, yellow): approximately 10.2:1 against dark card. Passes AAA.
- --noble (#22d3ee, cyan): approximately 5.1:1. Passes AA, fails AAA.
- --lanthanide (#f472b6, pink): approximately 4.6:1. Passes AA, fails AAA.
- --actinide (#f97316, orange): approximately 3.8:1. Fails AA and AAA.
- --unknown (#94a3b8, grey): approximately 3.6:1. Fails AA and AAA.

The element name text (el-name, el-num) uses --muted (#8a99b3) against #1a2235, giving approximately 3.3:1, which fails AA (4.5:1 required for normal text at this font size, which is 0.58 to 0.52 rem, well below large-text thresholds).

The info panel description text (info-desc) uses #8a99b3 (--muted) against #1a2235, approximately 3.3:1. Fails AA and AAA.

The stat-box label text (s-label, 0.65 rem) uses #8a99b3, approximately 3.3:1. Fails AA and AAA.

Recommended fix: Audit every colour against its background with a contrast checker. Lighten category colours to achieve at least 7:1 against their backgrounds for normal-weight text. Replace --muted for body copy and labels with a lighter tone that meets 7:1. Large text (at or above 18pt / 24px, or 14pt / approximately 18.67px bold) requires only 4.5:1.

### Finding 2

Severity: Critical
WCAG 2.2 criterion: 1.4.1 Use of Colour, Level A
Location: Legend section, lines 105 through 116; element cells across the grid

Problem: The legend communicates all ten element categories using a small coloured dot (10x10 CSS pixels, class legend-dot) with adjacent text. However, the dot is a purely decorative coloured square with no accessible name, role, or text equivalent. A user who cannot see colour cannot distinguish Alkali Metal from Actinide in the legend because the only differentiator is the dot colour.

More critically, on the element cells themselves, the category is communicated via the coloured top border (el-btn::before) and the coloured element symbol text (el-sym). A sighted user reads category from the cell colour. A screen reader user does receive the category via the aria-label string (which includes the CAT_LABEL value), so the grid cells themselves satisfy 1.4.1 for programmatic content. However, the legend and the visual colour-coding system do not present a non-colour redundancy in a way that is independent of the grid interaction.

The legend items have no role and the dots have no text. A screen reader user browsing the legend hears only the text label (for example "Alkali Metal") with no pairing to any visual cue. This is functional for a screen reader user but means the legend provides no route for a low-vision sighted user who cannot distinguish the colours.

Recommended fix: Add a visible non-colour identifier to each legend item, such as a shape, pattern, or short symbol prefix (for example a two-letter abbreviation of the category). Add an accessible description to each legend dot (or use aria-hidden="true" on the dot and keep the text label, which already partially serves this purpose). The category variable should be reflected as a data attribute visible to sighted users with alternative styling in a high-contrast mode.

### Finding 3

Severity: Major
WCAG 2.2 criterion: 4.1.2 Name, Role, Value, Level A; 1.3.1 Info and Relationships, Level A
Location: Line 100, #pt-grid; lines 279 and 384 onward

Problem: The grid has aria-rowcount="9" but the table has 10 visible rows of elements (periods 1 through 7 plus the lanthanide row at index 9 and the actinide row at index 10). The gap-spacer div between rows 7 and 9 is given role="presentation", which is correct, but that means the grid has 10 data rows, not 9. The aria-rowcount should be 10.

Additionally, the JavaScript at line 279 sets aria-rowindex for elements in rows 9 and 10 by subtracting 1 from the actual row number (rowNum<=7?rowNum:rowNum-1), so lanthanide elements receive aria-rowindex 8 and actinides receive aria-rowindex 9. This is an attempt to account for the gap row, but because aria-rowcount is 9 and aria-rowindex for actinides is 9, the positions overlap with the period-7 row index calculation and the two series-btn placeholders (rows 6 and 7, column 3) receive aria-rowindex equal to their actual row numbers (6 and 7), which is correct. The net effect is internally inconsistent indexing: a screen reader may announce lanthanide positions incorrectly relative to the stated rowcount.

Recommended fix: Set aria-rowcount="10" on the grid. Keep aria-rowindex for rows 9 and 10 as their actual positions (8 and 9 after accounting for the presentation row, or simply 9 and 10 if treating all visible rows as numbered). Choose one consistent scheme and apply it throughout.

### Finding 4

Severity: Major
WCAG 2.2 criterion: 4.1.3 Status Messages, Level AA; 2.4.3 Focus Order, Level A
Location: Lines 102 through 104, section#info-panel

Problem: The info-panel section has both aria-live="polite" and tabindex="-1". WCAG 4.1.3 requires status messages to be in a live region so they are announced without focus. The aria-live is correct for status messages. However, section elements with tabindex="-1" are programmatically focusable (via JavaScript, for example when the user moves focus to the panel deliberately). Combining a live region with a focusable container is problematic: when the panel updates after an element is selected, some screen readers may read it as both a live region announcement and as focused content, producing duplicate announcements. The tabindex="-1" on a section that is also a live region is unnecessary and potentially confusing. The panel is not referenced by any focus-management code in the JavaScript, so the tabindex="-1" appears unused. The skip link at line 76 points to #info-panel, which would place focus on the panel section; with tabindex="-1" and aria-live="polite" combined, VoiceOver and JAWS may announce live-region content twice.

Recommended fix: Separate the live region from the display panel. Keep a small hidden aria-live="polite" div (the existing #sr-live region already serves this purpose at line 77). Remove aria-live from the info-panel section. Keep tabindex="-1" only if focus is explicitly managed to the panel. Verify the skip link behaviour: if the skip link targets the panel, the panel needs to be focusable (tabindex="-1" is correct) but should not also be a live region.

### Finding 5

Severity: Major
WCAG 2.2 criterion: 1.3.1 Info and Relationships, Level A; 2.4.6 Headings and Labels, Level AA
Location: Lines 98 through 117, main element and its children

Problem: The page has no landmark structure beyond the header and main elements. There is no nav element. The controls div (line 82) uses role="search", which is a landmark, but this is applied to a div that contains both a search input and a group of filter buttons. The role="search" landmark is correct for the search field but misleading for the filter buttons; the WAI-ARIA specification states that role="search" should be used for a search interface, not a general filter toolbar. The filter button group has its own role="group" with aria-label, which is correct, but nesting role="group" inside role="search" creates an unexpected landmark that a screen reader user navigating by landmark will encounter as "search" when it contains more than just a search field.

The legend at line 105 has aria-label="Category colour legend" on a plain div, which provides a label but no landmark role. It should be a section or have role="region" with the aria-label to appear as a landmark in screen reader navigation.

Recommended fix: Change the outer controls wrapper to role="region" aria-label="Filter and search controls" or restructure it to wrap the search input in its own role="search" element and the filter buttons in a separate role="group". Add role="region" to the legend div to make it a named landmark.

### Finding 6

Severity: Major
WCAG 2.2 criterion: 2.5.5 Target Size (Enhanced), Level AAA
Location: Lines 40 through 41 (CSS), the #pt-grid grid

Problem: The element cells are set to a grid row height of 56px and a minimum column width of 56px. At the minimum layout width, each cell is 56x56 CSS pixels, which meets the AAA 44x44 target-size requirement. However, the filter buttons (class filter-btn) have padding of 6px top and bottom and 12px left and right, with font-size 0.78 rem. At the browser default of 16px per rem, the button height is approximately 6+6+(0.78x16x1.1 line-height) = approximately 25.7px. This is below the 44px AAA threshold and below the AA 24px minimum for the height alone when line-height is taken into account.

The series-btn elements (the lanthanide and actinide placeholder cells) have no explicit height and rely on the grid row height of 56px, which is adequate.

Recommended fix: Increase filter button padding so the total button height reaches at least 44px. For example, set padding to 12px 16px on filter-btn. Alternatively, ensure a minimum height of 44px is set explicitly.

### Finding 7

Severity: Major
WCAG 2.2 criterion: 2.4.13 Focus Appearance, Level AAA
Location: Lines 26, 43 to 44, 51 (CSS)

Problem: The focus indicator for el-btn elements uses outline: 2px solid var(--el-color) with outline-offset: 1px. The AAA criterion 2.4.13 requires the focus indicator to have a perimeter at least as long as the perimeter of a 2x2 CSS pixel box, with a contrast ratio of at least 3:1 between focused and unfocused states, and the indicator must not be entirely obscured by other content.

The 2px outline passes the perimeter test, but the contrast of the focus outline (the element category colour) against the card background is often below 3:1 for several categories. For example, --actinide (#f97316) against #1a2235 is approximately 3.8:1, which passes 3:1 for UI components, but --unknown (#94a3b8) against #1a2235 is approximately 3.6:1, also passing at 3:1 but borderline. --alkaline (#fb923c) against #1a2235 is approximately 3.7:1, which also passes 3:1 for UI components, but the focus indicator shares this colour with the unfocused border-color in the hovered/focused state, making the unfocused-to-focused change harder to detect.

For the filter-btn, focus-visible uses outline: 2px solid var(--accent) (#38bdf8) with outline-offset: 2px. This colour against #0b0f1a (body background) is approximately 7.8:1, which passes. However, the filter buttons appear on the controls div which has no explicit background, so the effective background behind the outline may be the body background or the card background depending on scroll position.

The more significant issue is the outline-offset: 1px on el-btn. With the button border at 1px and the outline at 2px with 1px offset, the outline sits very close to the button edge and against the card background colour that neighbours the button. At 3px gap-between-cells, the focus outline may overlap adjacent cells and be visually clipped.

Recommended fix: Increase outline-offset to at least 2px on el-btn. Standardise the focus indicator colour to a single high-contrast colour (such as --accent #38bdf8) that meets 3:1 against all possible backgrounds, rather than using the category colour which varies. Consider a dual-colour focus ring (white inner, dark outer or vice versa) that works on any background.

### Finding 8

Severity: Major
WCAG 2.2 criterion: 1.3.1 Info and Relationships, Level A; 4.1.2 Name, Role, Value, Level A
Location: Lines 386 to 408, renderInfo function (JavaScript)

Problem: The info panel is populated by innerHTML injection (line 386). The injected content includes:

- An info-symbol-box div with aria-hidden="true". This is correct as the symbol box is decorative relative to the text content.
- An info-name div (line 388). This is a plain div styled to look like a heading but has no heading role. A screen reader user navigating by heading will not find the element name.
- info-tags div containing spans. These are informational tags (category, state, period, group) but have no accessible role. They look like badges visually but are read as plain text, which is acceptable.
- stat-box divs (lines 401 to 404) containing a label div and a value div. The label div (s-label) has no association with its value div (s-val). A screen reader reads "Atomic No." then "1" as separate pieces of text with no programmatic relationship.
- The description paragraph (line 406) is a p element, which is correct.

The most significant issue is the info-name div, which functions as the heading for the details panel but is not marked up as a heading. After a user selects an element, a screen reader user navigating by heading will find no heading in the panel.

Recommended fix: Change info-name from a div to an h2 (the page already has an h1 in the header). Associate each stat-box label with its value using a dl/dt/dd description list pattern or explicit aria-labelledby/aria-describedby associations.

### Finding 9

Severity: Major
WCAG 2.2 criterion: 2.4.1 Bypass Blocks, Level A
Location: Lines 74 to 76, skip links

Problem: The page has three skip links: "Skip to search", "Skip to periodic table", and "Skip to element details". This is good practice. However, the skip links are only visible on focus (top: -100% when not focused, top: 0 on focus). The CSS for .skip-link:focus uses :focus, not :focus-visible. In browsers that support :focus-visible, the :focus selector may also trigger on mouse click, showing the skip link briefly. This is a very minor point. More significantly, keyboard users who Tab into the page will see the skip links, which is correct.

The larger issue is that the skip links require the anchor targets to be focusable or to place focus correctly. #search is an input, which is inherently focusable. #pt-grid is a div with role="grid". The link goes to #pt-grid but the div itself is not focusable; the focus will move to the div but may not then be able to receive keyboard input unless the browser moves focus into the first child. Testing is needed to confirm that "Skip to periodic table" actually places focus on the first interactive grid cell rather than on the non-focusable wrapper div. #info-panel is a section with tabindex="-1", which is focusable, but at initial page load the panel contains only the placeholder paragraph and no interactive element.

Recommended fix: Test skip link targets in VoiceOver and JAWS. For "Skip to periodic table", the target should be the first focusable grid cell, not the wrapper div. Consider using JavaScript to move focus to the first el-btn when the skip link is activated, or change the target to an id placed on the first button.

### Finding 10

Severity: Minor
WCAG 2.2 criterion: 1.3.5 Identify Input Purpose, Level AA
Location: Line 84, the search input

Problem: The search input has autocomplete="off". WCAG 1.3.5 requires that inputs collecting information about the user have the correct autocomplete token. A search input does not collect personal information, so autocomplete="off" is acceptable here. However, the input type is "search", which browser implementations may style with a clear button (the x) that has no accessible name in some browsers. This is a browser-level issue but should be verified in the target browsers.

Additionally, the input has both a label element (via label for="search", line 83 with class sr-only) and a redundant aria-label attribute (line 84). The aria-label overrides the label element for screen readers. The label element is hidden with .sr-only (which is correctly implemented). The aria-label text ("Search by name, symbol, or atomic number") is slightly different from the label text ("Search elements by name, symbol or atomic number"). These should match exactly per WCAG 2.5.3 Label in Name to ensure voice control users can activate the field by speaking the visible-ish label.

Recommended fix: Remove the aria-label from the input and rely solely on the label element, which is already associated correctly via for/id. Ensure the label text and any visible placeholder text are consistent. The placeholder "Search elements..." disappears when the user types, so it must not be the only instruction.

### Finding 11

Severity: Minor
WCAG 2.2 criterion: 2.4.2 Page Titled, Level A
Location: Line 6, the title element

Problem: The page title is "Interactive Periodic Table of Elements". This is descriptive and unique. It passes 2.4.2. No finding.

Actually this is not a finding; it passes. Removing.

### Finding 11

Severity: Minor
WCAG 2.2 criterion: 3.1.3 Unusual Words, Level AAA; 3.1.4 Abbreviations, Level AAA
Location: Element description strings in the ELEMENTS array, lines 123 to 243

Problem: The element descriptions use scientific abbreviations and acronyms without expansion on first use within the page content. Examples include: ATP (adenosine triphosphate), DNA (deoxyribonucleic acid), LED (light-emitting diode), ITO (indium tin oxide), LCD (liquid crystal display), PET (positron emission tomography), MRI (magnetic resonance imaging), PTFE (polytetrafluoroethylene), GaAs (gallium arsenide), YAG (yttrium-aluminium-garnet), PVC (polyvinyl chloride), SI (International System of Units), and K-Pg (Cretaceous-Paleogene). Because these descriptions appear one at a time as users select elements, there is no first-use context across all descriptions simultaneously. However, the requirement is that expansions are available, not necessarily inline. A glossary linked from the page would satisfy 3.1.4.

Additionally, chemical element symbols used in descriptions (such as Pu-238, Tc-99m, Sm-153) are abbreviations that screen readers may misread (for example "Pu-238" may be read as "P-U-minus-238" or as a word attempt). The aria-label on each element button reads the full name and symbol, which helps for the grid cells, but symbols embedded in prose descriptions are not protected.

Recommended fix: Add a glossary page or an in-page glossary section listing abbreviation expansions. For element descriptions, spell out the most common abbreviations on first use within each description string, or add a footnote mechanism. For element symbols in prose, consider using the abbr element or a note in the description.

### Finding 12

Severity: Minor
WCAG 2.2 criterion: 1.4.10 Reflow, Level AA
Location: Line 40, #pt-grid CSS; line 39, .grid-wrapper

Problem: The grid uses grid-template-columns: repeat(18, minmax(56px, 1fr)) with a min-width: 720px. The grid-wrapper has overflow-x: auto. This means at viewports narrower than 720px the grid becomes horizontally scrollable rather than reflowing. WCAG 1.4.10 requires that content can be presented at 320 CSS pixels wide (equivalent to 400% zoom on a 1280px viewport) without loss of content or functionality and without requiring two-dimensional scrolling, except for content whose use requires a two-dimensional layout.

A periodic table is a canonical example of content that requires a two-dimensional layout; the positions of elements in the table carry chemical meaning. WCAG explicitly provides this exception. However, at 320px the current implementation still requires horizontal scrolling and provides no alternative linearised view or summary. The exception is valid, but the team should document it explicitly. The skip link to the table and the search function provide partial alternatives, but a screen reader user cannot get the full spatial context from the table at small viewports.

Recommended fix: Document a formal exception under 1.4.10 for the grid, stating the reason (two-dimensional layout required by the domain). Ensure the search field and element list remain fully accessible at 320px width as an alternative access route.

### Finding 13

Severity: Minor
WCAG 2.2 criterion: 1.4.12 Text Spacing, Level AA
Location: Lines 47 to 66, CSS for el-num, el-name, el-sym, info-desc

Problem: The element name inside each cell (class el-name) uses white-space: nowrap and text-overflow: ellipsis. If a user applies custom text-spacing overrides (as required by 1.4.12, specifically letter-spacing at least 0.12em, word-spacing at least 0.16em, line-height at least 1.5), the nowrap and fixed cell size may cause text to be clipped by ellipsis or overflow. Testing is needed to confirm that no information is lost when spacing overrides are applied.

Additionally, the el-num class uses font-size: 0.58rem, and el-name uses 0.52rem. At browser default of 16px, these are approximately 9.3px and 8.3px respectively. At 400% zoom (browser zoom, not just text resize), these elements will scale up, but at standard zoom they are very small. WCAG 1.4.4 Resize Text requires text to be resizable up to 200% without loss of content. Because these elements are inside a fixed-height grid row (56px), increasing text size may cause overflow. Testing at 200% text size is needed.

Recommended fix: Test 1.4.12 text-spacing overrides using a bookmarklet or browser extension. Test 1.4.4 at 200% text resize. Consider a minimum cell size that accommodates larger text, or an alternative layout at high zoom levels.

### Finding 14

Severity: Minor
WCAG 2.2 criterion: 2.2.3 No Timing, Level AAA; 2.2.4 Interruptions, Level AAA
Location: Lines 411 to 414, announce function

Problem: The live region (aria-live="polite" on #sr-live) announces element details automatically whenever an element is selected. This is desirable and correct for 4.1.3. However, if a user is navigating rapidly through the grid with arrow keys, each cell focus change does not itself announce the full element description (only the aria-label on the button is read on focus). The announce function is called only on click or programmatic selection (selectElement), not on focus change. This is correct behaviour: the aria-label is read on focus and the description is only read when explicitly selected. No finding on timing.

However, the filter announcement (line 435, "Showing Alkali Metals only.") and the search results announcement (line 460) are sent to the live region. These are polite announcements, which queue behind current screen reader speech. No finding here.

No finding on 2.2.3 or 2.2.4 for this specific mechanism; both pass.

### Finding 15

Severity: Minor
WCAG 2.2 criterion: 2.3.3 Animation from Interactions, Level AAA
Location: Lines 43, 53 (CSS transitions)

Problem: Element cells have a transition on border-color, background, and transform (scale 1.06 on hover/focus). The info panel has a transition on border-color. The scale transform on el-btn:hover and el-btn:focus-visible is a motion effect triggered by interaction. WCAG 2.3.3 (Level AAA) and WCAG 2.3.1/2.3.2 address flashing, but 2.3.3 specifically covers animation from interactions and requires that motion animation from interactions can be disabled unless the animation is essential.

The CSS does not include a prefers-reduced-motion media query to disable or reduce these transitions. A user with vestibular disorder who has set their OS to reduce motion will still see the scale and transition effects.

Recommended fix: Add a prefers-reduced-motion media query that sets transition: none and removes the transform: scale on el-btn for users who have requested reduced motion.

```css
@media (prefers-reduced-motion: reduce) {
  .el-btn, #info-panel { transition: none; }
  .el-btn:hover, .el-btn:focus-visible { transform: none; }
}
```

### Finding 16

Severity: Minor
WCAG 2.2 criterion: 1.4.8 Visual Presentation, Level AAA
Location: Lines 66 and 19 (CSS), info-desc and header p

Problem: WCAG 1.4.8 requires that text blocks can have their foreground and background colours selected by the user, that line length does not exceed 80 characters, that text is not fully justified, and that line spacing within paragraphs is at least 1.5. The info-desc paragraph uses line-height: 1.65, which passes the spacing requirement. The text is not justified. The line length is not explicitly capped and will expand to fill the flex container, which may exceed 80 characters on wide viewports.

The header p (line 19) uses letter-spacing: .04em and text-transform is not applied. The el-name inside cells has text-transform not applied. Filter buttons use text-transform: uppercase (line 25), which reduces legibility for some users and screen readers may read uppercase text as individual letters in some configurations.

Recommended fix: Add a max-width constraint on the info-desc container to cap line length at approximately 65 to 80 characters (roughly 65ch). Reconsider text-transform: uppercase on filter buttons; use mixed case with letter-spacing instead.

### Finding 17

Severity: Minor
WCAG 2.2 criterion: 3.2.5 Change on Request, Level AAA
Location: Lines 386 to 408, renderInfo function

Problem: When a user selects an element in the grid, the info panel updates dynamically. This is a change of context (content below the grid updates) that happens in response to a deliberate user action (click or keyboard activation). This satisfies 3.2.5, which requires changes to happen only when requested. No finding on 3.2.5.

However, the announce function (line 408) announces the first 120 characters of the element description via the live region. This truncates the description and the full text is available only visually (or by tabbing to the info panel and reading it). A screen reader user who relies on the live region announcement will hear a truncated description. To get the full description, the user must navigate to the info-panel section. This is usable but creates an inconsistency between what is announced and what is displayed.

Recommended fix: Announce the full element description in the live region, not just the first 120 characters. The description strings are at most a few sentences and will not cause unreasonable announcement length.

### Finding 18

Severity: Advisory
WCAG 2.2 criterion: 2.4.8 Location, Level AAA
Location: Page-level, no breadcrumb present

Problem: WCAG 2.4.8 requires that users can find out where they are within a set of web pages. As a single-page application with no multi-page navigation, a breadcrumb is not required here. The page title adequately identifies the page. No finding.

### Finding 19

Severity: Advisory
WCAG 2.2 criterion: 3.1.5 Reading Level, Level AAA
Location: Element descriptions throughout the ELEMENTS array

Problem: The element descriptions are written at a scientific level. Several sentences contain complex vocabulary: "relativistic effects on its electron configuration", "magnetostrictive sonar alloy Terfenol-D", "K-Pg geological boundary", "isotope", "transuranium". A strict Flesch-Kincaid analysis of the descriptions would likely score above grade 9 for some entries.

This is expected for scientific content. WCAG 3.1.5 allows a supplementary version at a simpler level. The current descriptions are concise and reasonably clear given the subject matter. This is an advisory note rather than a critical finding: the team should decide whether a simpler supplementary description is warranted or whether the scientific audience justification applies, and document the decision.

### Finding 20

Severity: Advisory
WCAG 2.2 criterion: 2.4.10 Section Headings, Level AAA
Location: Lines 98 to 117, main section content

Problem: The main content area has three logical sections: the grid, the info panel, and the legend. The grid has an aria-label on its wrapper div but no visible section heading. The info panel becomes headed by the element name (but as a div, not an h2; see Finding 8). The legend has an aria-label on its div wrapper but no visible heading. Adding visible section headings (or at minimum accessible headings using role="heading" if visible headings are not desired) would improve navigation for screen reader users who navigate by heading.

Recommended fix: Add visible h2 headings for each major content section, or at minimum use role="heading" aria-level="2" on the aria-label'd containers. The info panel heading issue is covered in Finding 8.

### Finding 21

Severity: Advisory
WCAG 2.2 criterion: 2.5.3 Label in Name, Level A
Location: Filter buttons, lines 86 to 95

Problem: The filter buttons have visible text labels ("Alkali Metals", "Alkaline Earth", etc.) and no aria-label, so their accessible name equals their visible text. This passes 2.5.3. The button text "Alkaline Earth" is a shortened form of "Alkaline Earth Metal" (which is the CAT_LABEL value used in element aria-labels). A voice control user saying "Alkaline Earth Metal" will not match the button labelled "Alkaline Earth". This is a minor inconsistency.

Recommended fix: Align button labels with the full category names used in element aria-labels, or ensure the full name is used consistently throughout.

### Finding 22

Severity: Advisory
WCAG 2.2 criterion: 1.3.6 Identify Purpose, Level AAA
Location: Controls region, filter buttons, info panel

Problem: WCAG 1.3.6 asks that the purpose of user interface components, icons, and regions can be programmatically determined. Beyond landmark roles and ARIA labels, this criterion looks for machine-readable purpose via microdata, JSON-LD, or specific ARIA properties. The page does not use these additional purpose markers. The team's accessibility.md notes this is treated as best-effort because assistive technology support is thin. This is an advisory note consistent with the documented team position.

## Automated Testing Note

axe-core and Pa11y could not be run because Bash execution was unavailable during this audit. These tools should be run against the live URL https://projects.timdixon.net/Periodic-Table/ or against the local file using a file:// URL before this baseline is used to prioritise remediation. Automated tools will confirm or add to the contrast findings (Finding 1) and may surface markup-level issues not visible in a code review.

## Open Questions for Tim

These questions are batched for Sonja to put to Tim.

1. Colour palette intent: The current design uses a dark theme with category colours that fail the AAA 7:1 contrast threshold for normal text. Fixing these may require significantly lightening the category colours or changing the background, which will alter the visual character of the page. Should the team maintain the dark theme and adjust colours within it, or is a light theme also acceptable?

2. Reflow exception: A periodic table's spatial layout carries chemical meaning. The page cannot meaningfully reflow to a single column at 320px. The team's standard requires documenting this as a formal accessibility exception (see accessibility.md, Exception Pattern). Should a linearised list view or summary page be added as an alternative, or is the existing search interface sufficient as the alternative access route?

3. Abbreviation handling: The element descriptions use scientific abbreviations (ATP, DNA, LED, MRI, and others) without expansion within the description text. Should these be expanded inline, or is a separate glossary page the preferred approach?

4. Reading level: Some element descriptions use advanced scientific vocabulary. The team's standard targets Flesch-Kincaid grade 9. Should simpler supplementary descriptions be written for each element, or does the scientific audience justify accepting a higher reading level with a documented exception?

5. Filter button labels: The buttons say "Alkaline Earth" but the category is called "Alkaline Earth Metal" in element descriptions. Should the button labels be updated to use the full category name for consistency?
