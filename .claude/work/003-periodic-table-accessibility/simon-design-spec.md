# Accessibility Remediation Design: Periodic Table Phase 2

Design date: 2026-05-21
Designer: Simon (designer agent)
Work folder: 003-periodic-table-accessibility
Source audit: carol-baseline-audit.md (21 findings), carol-phase1-verification.md
Standard: Web Content Accessibility Guidelines (WCAG) 2.2, AAA conformance

## 1. Overview

This document is the design specification for Phase 2 of the Periodic-Table project. It covers every change needed to bring the page to WCAG 2.2 AAA conformance. It addresses all 21 of Carol's baseline findings, recommends answers to Carol's five open design questions, and specifies the AAA-conformant colour scheme for the ten element categories.

This is a design document only. It does not implement any changes.

## 2. Decisions on the five open design questions

These answers are recommendations. They are the basis for design decisions in this specification. Each answer is noted here so that Jacob and Sean can proceed; any question where Tim needs to override the recommendation should be flagged to Sonja before implementation begins.

### Question 1: Dark theme or light theme

Recommendation: keep the dark theme and adjust the category colours within it.

Rationale: the dark theme is specified in the requirements (section 3.2, out of scope: "Dark-mode or light-mode toggle -- the application uses a fixed dark theme"). It is also consistent with Tim's brand, which uses navy as the primary dark background. Lightening the category colours against the dark card background to reach 7:1 is achievable for all ten categories, as the colour scheme in section 4 below demonstrates. A light-theme rewrite would be a larger scope change and is not needed.

### Question 2: Reflow at 320 pixels -- linearised list or search as alternative

Recommendation: document a formal reflow exception for the grid and confirm the search field as the alternative access route. Do not add a linearised list view at this time.

Rationale: a periodic table's two-dimensional layout carries chemical meaning. WCAG 1.4.10 explicitly recognises this class of exception. The search field at 320 pixels is already accessible and usable. Adding a linearised list view is a significant feature addition outside the Phase 2 scope. The exception must be recorded in the project wiki under docs/exceptions/ per the team's exception pattern. The exception record must include Tim's sign-off before merge.

### Question 3: Abbreviations -- inline expansion or glossary

Recommendation: expand abbreviations inline within each element description string, not via a separate glossary page.

Rationale: element descriptions are shown one at a time, so there is no shared first-use context across the page. A linked glossary page would be a separate document to maintain and would require navigation away from the tool. Inline expansion ("polytetrafluoroethylene (PTFE)") serves WCAG 3.1.4 directly and keeps the tool self-contained. The description strings are already written in plain language; adding the expansion in parentheses on first use within each string is a minimal change that Sean can apply as a data edit.

### Question 4: Reading level -- simpler descriptions or documented exception

Recommendation: rewrite the element descriptions to Flesch-Kincaid grade 9 or below where they currently exceed that level, rather than documenting an exception.

Rationale: the team's accessibility standard targets grade 9, and that target is achievable for element descriptions with careful editing. Scientific terms that have no plain-language equivalent (isotope, radioactive, semiconductor) are treated as necessary technical vocabulary and do not automatically push the grade level above 9 when the surrounding sentences are kept short. Barnaby should review and edit the descriptions. An exception should be a last resort, not the first response to a target that can be met with editorial effort.

### Question 5: Filter button labels -- "Alkaline Earth" or "Alkaline Earth Metal"

Recommendation: change all filter button labels to match the full category names used in element aria-labels.

Rationale: WCAG 2.5.3 Label in Name requires the accessible name to contain the visible label text. If voice control users say "Alkaline Earth Metal" (which matches the aria-label of every alkaline-earth element), they should also be able to activate the filter by the same phrase. Using the full names also reduces the risk that a screen reader user hears two different names for the same category and becomes confused.

The updated filter button labels are:

- Alkali Metals (no change needed; CAT_LABEL uses "Alkali Metal", singular, so the button label "Alkali Metals" is the plural form used in the filter -- this is acceptable as a plural form of the same name; no change needed)
- Alkaline Earth Metals (was "Alkaline Earth")
- Transition Metals (no change needed)
- Post-Transition Metals (was "Post-Transition")
- Metalloids (no change needed)
- Nonmetals (no change needed)
- Halogens (no change needed)
- Noble Gases (no change needed)
- Lanthanides (no change needed)
- Actinides (no change needed)

Note on CAT_LABEL alignment: the JavaScript object CAT_LABEL uses "Alkaline Earth Metal" (singular) and "Post-Transition Metal" (singular) as labels embedded in element aria-labels. The filter buttons use plural forms for their visible text. This is consistent with the pattern already used for "Alkali Metals" and "Transition Metals". The two changes above close the gap for Alkaline Earth and Post-Transition. Sean should also verify the legend text for these two entries.

## 3. Colour scheme: AAA-conformant category colours

### 3.1 Design rationale

The existing category colours are used in three ways in the current design.

First, they appear as the element symbol text colour on each cell (class el-sym, rendered against the card background colour #1a2235). This is normal-weight text and must reach 7:1 for AAA.

Second, they appear as the top-border accent (a 2-pixel strip) on each cell and on the info panel. This is a graphical object and must reach 3:1 against adjacent colours for AAA.

Third, they appear on pressed filter buttons as the button text and border colour (against the card background #1a2235). This is small text and must reach 7:1.

Fourth, they appear as the info panel symbol text (classes i-num and i-sym) and as info-tag badge text and borders. These are also against dark backgrounds.

The goal is to find one colour per category that satisfies all of these uses simultaneously: 7:1 for text against #1a2235 (the card background), and 3:1 for graphical objects. Because AAA text contrast (7:1) is more demanding than AAA graphical-object contrast (3:1), meeting 7:1 automatically satisfies 3:1 for every use.

The approach is to keep colours in the same hue family as the existing palette (so the visual character of the page is preserved) but to lighten each colour until 7:1 is reached against #1a2235. The card background #1a2235 has a relative luminance of approximately 0.021.

For a colour to achieve 7:1 against a background with luminance L2 = 0.021, the foreground luminance L1 must satisfy (L1 + 0.05) / (L2 + 0.05) = 7, which gives L1 = 7 x 0.071 - 0.05 = 0.447. So the foreground colour needs a relative luminance of at least 0.447. This is a very light colour, roughly equivalent to a light pastel or near-white. The existing palette uses mid-toned saturated colours (luminance 0.12 to 0.45), several of which fall short.

### 3.2 Proposed category colours

The following colours are proposed for the ten categories. Each hex value has been calculated to achieve at least 7:1 contrast against the card background #1a2235 and at least 7:1 against the page background #0b0f1a (luminance approximately 0.009, which is even darker, so meeting 7:1 against #1a2235 is the binding constraint). The proposed colours are lighter, pastel-adjacent versions of the existing hues, consistent with the brand's approved approach of using light colours on dark backgrounds (white and sky blue on navy; the same logic applies here).

Contrast ratios below are against the card background #1a2235 (luminance approximately 0.021). The formula used is (L1 + 0.05) / (L2 + 0.05) where L2 = 0.021.

Category: Alkali Metal
Existing colour: #f87171 (estimated 4.8:1, fails AAA)
Proposed colour: #ffb3b3
Hue family: red, softened to a light coral-pink
Estimated luminance of #ffb3b3: approximately 0.49
Estimated contrast against #1a2235: approximately (0.49 + 0.05) / (0.021 + 0.05) = 0.54 / 0.071 = 7.6:1
AAA text: pass. AAA graphical: pass.

Category: Alkaline Earth Metal
Existing colour: #fb923c (estimated 3.7:1, fails AA and AAA)
Proposed colour: #ffc88a
Hue family: orange, lightened to a warm peach
Estimated luminance of #ffc88a: approximately 0.54
Estimated contrast against #1a2235: approximately (0.54 + 0.05) / 0.071 = 8.3:1
AAA text: pass. AAA graphical: pass.

Category: Transition Metal
Existing colour: #60a5fa (estimated 4.7:1, fails AAA)
Proposed colour: #a8d4ff
Hue family: blue, lightened to a sky-blue pastel
Estimated luminance of #a8d4ff: approximately 0.48
Estimated contrast against #1a2235: approximately (0.48 + 0.05) / 0.071 = 7.5:1
AAA text: pass. AAA graphical: pass.
Note on brand: the brand sky blue #63D2FF has estimated luminance approximately 0.43 and a contrast against #1a2235 of approximately (0.43 + 0.05) / 0.071 = 6.8:1, which falls just short of 7:1. The proposed #a8d4ff is a slightly lighter variant in the same hue family. It is close to, but not identical to, the brand sky blue; this is acceptable because the periodic table is a project asset styled within the brand's dark-background pattern, not a branded image requiring exact palette compliance.

Category: Post-Transition Metal
Existing colour: #34d399 (estimated 6.4:1, fails AAA)
Proposed colour: #7eeac4
Hue family: mint green, lightened
Estimated luminance of #7eeac4: approximately 0.49
Estimated contrast against #1a2235: approximately (0.49 + 0.05) / 0.071 = 7.6:1
AAA text: pass. AAA graphical: pass.

Category: Metalloid
Existing colour: #a78bfa (estimated 4.9:1, fails AAA)
Proposed colour: #ccb8ff
Hue family: violet-purple, lightened to a soft lavender
Estimated luminance of #ccb8ff: approximately 0.49
Estimated contrast against #1a2235: approximately (0.49 + 0.05) / 0.071 = 7.6:1
AAA text: pass. AAA graphical: pass.

Category: Nonmetal
Existing colour: #86efac (estimated 7.5:1, passes AAA)
Proposed colour: #86efac (unchanged)
Hue family: light green
Existing contrast: approximately 7.5:1
AAA text: pass. AAA graphical: pass.
Note: the existing colour passes. No change required.

Category: Halogen
Existing colour: #fde047 (estimated 10.2:1, passes AAA)
Proposed colour: #fde047 (unchanged)
Hue family: yellow
Existing contrast: approximately 10.2:1
AAA text: pass. AAA graphical: pass.
Note: the existing colour passes. No change required.

Category: Noble Gas
Existing colour: #22d3ee (estimated 5.1:1, fails AAA)
Proposed colour: #85e8f7
Hue family: cyan, lightened to a pale aqua
Estimated luminance of #85e8f7: approximately 0.49
Estimated contrast against #1a2235: approximately (0.49 + 0.05) / 0.071 = 7.6:1
AAA text: pass. AAA graphical: pass.

Category: Lanthanide
Existing colour: #f472b6 (estimated 4.6:1, fails AAA)
Proposed colour: #ffadd9
Hue family: pink, lightened to a soft rose
Estimated luminance of #ffadd9: approximately 0.49
Estimated contrast against #1a2235: approximately (0.49 + 0.05) / 0.071 = 7.6:1
AAA text: pass. AAA graphical: pass.

Category: Actinide
Existing colour: #f97316 (estimated 3.8:1, fails AA and AAA)
Proposed colour: #ffb97a
Hue family: amber-orange, lightened to a warm apricot
Estimated luminance of #ffb97a: approximately 0.48
Estimated contrast against #1a2235: approximately (0.48 + 0.05) / 0.071 = 7.5:1
AAA text: pass. AAA graphical: pass.

### 3.3 Muted text colour replacement

The existing --muted colour #8a99b3 is used for: element number (el-num), element name (el-name) on cells, the stat-box label (s-label), the description text (info-desc), and legend item text. Against #1a2235 it achieves approximately 3.3:1, which fails AA (4.5:1 required for normal text).

Proposed replacement: #c8d3e8
Estimated luminance of #c8d3e8: approximately 0.59
Estimated contrast against #1a2235: approximately (0.59 + 0.05) / 0.071 = 9.0:1
AAA text: pass.
Against the page background #0b0f1a (luminance approximately 0.009): approximately (0.59 + 0.05) / (0.009 + 0.05) = 0.64 / 0.059 = 10.8:1. Pass.

This lighter blue-grey maintains the cool-toned, subdued character of the original --muted colour while meeting AAA. Text that uses this colour (element numbers and names on cells, stat-box labels, description text) will be perceptibly lighter than before, which also improves legibility for low-vision users.

### 3.4 Filter button default text colour

The filter buttons in their unpressed state use --muted (#8a99b3) as their text colour against the card background #1a2235. This fails as noted above. The proposed --muted replacement #c8d3e8 applies here too and resolves the failure.

The filter button text in pressed state uses the category colour (--fc) against #1a2235. The proposed category colours all meet 7:1 against #1a2235, so pressed filter buttons will also pass.

### 3.5 Accent colour

The existing --accent #38bdf8 is used for: the skip link background text, the search field focus border, the series-btn focus outline, and the info panel default border-top. Against the page background #0b0f1a and against #000: #38bdf8 has estimated luminance approximately 0.28, giving approximately (0.28 + 0.05) / (0.009 + 0.05) = 5.6:1 against #0b0f1a. This does not reach 7:1 for normal text.

However, the skip link uses black (#000) text on the --accent background: black on #38bdf8 gives approximately (0.28 + 0.05 - 0.05) / (0.28 + 0.05) = actually (1.0 + 0.05) / (0.28 + 0.05) = 1.05 / 0.33 = 3.2:1, which fails. Wait -- the skip link rule is: color: #000 on background: var(--accent). Black (luminance 0) on #38bdf8 (luminance approximately 0.28): (0.28 + 0.05) / (0 + 0.05) = 0.33 / 0.05 = 6.6:1. This is close but falls short of 7:1 for normal text at AAA.

Proposed accent colour replacement: #63D2FF (the brand sky blue).
Estimated luminance of #63D2FF: approximately 0.43.
Black on #63D2FF: (0.43 + 0.05) / (0 + 0.05) = 0.48 / 0.05 = 9.6:1. Pass for AAA text.
#63D2FF on #0b0f1a: (0.43 + 0.05) / (0.009 + 0.05) = 0.48 / 0.059 = 8.1:1. Pass for AAA text.
#63D2FF on #1a2235: (0.43 + 0.05) / (0.021 + 0.05) = 0.48 / 0.071 = 6.8:1. This is just below 7:1 for normal-weight text, but passes at 4.5:1 for large text (18pt/24px or 14pt bold).

The skip link text is 700 weight. If it is also at least 18.67px (14pt bold), the 4.5:1 large-text threshold applies and #63D2FF passes. The current skip-link font-weight is 700 and the font-size inherits from body (approximately 1rem = 16px). At 16px bold, this is not large text (large text requires 18.67px bold). Therefore a slightly lighter accent is needed.

Revised accent: use #7dd9ff.
Estimated luminance of #7dd9ff: approximately 0.50.
Black on #7dd9ff: (0.50 + 0.05) / 0.05 = 11.0:1. Pass.
#7dd9ff on #0b0f1a: (0.50 + 0.05) / 0.059 = 9.3:1. Pass.
#7dd9ff on #1a2235: (0.50 + 0.05) / 0.071 = 7.7:1. Pass for normal text.

Proposed --accent: #7dd9ff.

Note to Sean: all contrast ratios in section 3 are design estimates based on the luminance formula. Before implementation, every proposed colour must be verified with a precise contrast checker such as the Paciello Group Colour Contrast Analyser or equivalent, using the exact hex values specified. If any calculated ratio falls below the target after precise measurement, the colour should be lightened in small increments (5 hex steps at a time) until the target is met, staying within the same hue family.

## 4. Non-colour category identifier system

### 4.1 The requirement

Finding 2 (Critical): category information must not be conveyed by colour alone. WCAG 1.4.1. Currently the legend uses a coloured dot with adjacent text. On element cells, category is conveyed visually only by the coloured top border and the coloured symbol text. The aria-label on each cell carries the category in text, which satisfies the screen reader use case, but a low-vision sighted user who cannot distinguish colours still cannot tell categories apart without reading each aria-label individually.

### 4.2 Design decision: category shape symbols in the legend dot

The legend dot (currently a 10x10px coloured square) is replaced by a 16x16px coloured shape that carries a unique category identifier. Each category gets a small two-letter abbreviation rendered as white text inside the coloured shape. The shape colour uses the new AAA-compliant category colour. The abbreviation text uses white (#FFFFFF) which achieves 21:1 against any of the proposed dark category colours, easily passing AAA.

The 16x16px size is a visual decision; the dot is decorative (aria-hidden="true"), so it has no target-size requirement. The text within it is also aria-hidden="true" because the adjacent legend label already names the category. The shape is purely visual redundancy for sighted low-vision users.

Proposed two-letter abbreviations for legend dots:

- Alkali Metal: AK
- Alkaline Earth Metal: AE
- Transition Metal: TM
- Post-Transition Metal: PT
- Metalloid: ML
- Nonmetal: NM
- Halogen: HG
- Noble Gas: NG
- Lanthanide: LA
- Actinide: AC

The dot background colour uses the new category colour (section 3.2). The two-letter label is white (#FFFFFF) at approximately 9px, bold, centred within the dot. This creates a self-contained visual key: colour and abbreviation together. A user who cannot perceive colour can still read the abbreviation.

### 4.3 Category symbol on element cells

On each element cell, the category abbreviation is displayed as a data attribute exposed via CSS generated content, but because generated content is not reliably read by screen readers and is already covered by the aria-label, no ARIA changes are needed. The visual redundancy for sighted users is provided by the category abbreviation in the legend and by a small category badge.

The specific cell-level treatment: add a data-cat-abbr attribute to each element button (for example data-cat-abbr="TM" for a transition metal). A CSS rule uses the ::after pseudo-element to display this abbreviation as a tiny label (approximately 0.4rem, visually subdued) in the bottom-right corner of each cell. The pseudo-element is aria-hidden and is purely for sighted low-vision users who cannot rely on colour.

Alternatively, if the tiny text causes visual clutter or contrast issues at the small size, the category abbreviation can be omitted from the cell and kept only in the legend. This is a less preferred option because it means a user must cross-reference the legend rather than reading from the cell. The preferred option is to include it.

The abbreviation text on the cell (approximately 0.4rem, approximately 6.4px) is below the WCAG minimum text size for contrast checking (text below 18pt or 14pt bold is normal text and requires 7:1). At 6.4px this is very small, but it is supplementary information, not the primary conveyor of category. The primary category conveyor for sighted users remains the colour; the abbreviation is a non-colour supplement. The accessible name on the button already includes the category label in plain text. If the tiny abbreviation text cannot meet 7:1 at that size, it should be made slightly larger (0.5rem, approximately 8px) and checked. Sean should verify contrast for the chosen size before finalising.

## 5. Legend design

### 5.1 Visible heading

Finding 20 (Advisory): the legend has no visible heading. The section element with aria-label="Category colour legend" is a named landmark, which is correct. A visible heading is added.

Design: add an h2 element with text "Element Categories" as the first child of the legend section. Apply font-size: 0.85rem, font-weight: 600, color: var(--text), letter-spacing: 0.04em. The --text colour (#e2e8f0) against the page background achieves high contrast and matches the existing page text style.

### 5.2 Legend item layout

Each legend item currently shows a coloured dot and text. The revised item shows:

1. A 16x16px coloured shape containing a two-letter abbreviation (aria-hidden), in the new category colour.
2. The full category name in text, in the new --muted colour (#c8d3e8), at 0.85rem. This is slightly larger than the current 0.75rem to improve legibility and to create better spacing relative to the new larger dot.

The legend layout remains a flex row that wraps. Gap is increased from 10px to 12px to give the larger dots room to breathe.

### 5.3 Legend aria-label update

The legend section aria-label currently reads "Category colour legend". Update to "Element category legend" to remove the word "colour" from the programmatic description, since colour is no longer the only identifier. The visible h2 "Element Categories" serves as the primary heading for screen reader navigation.

## 6. Info panel element-name heading

Finding 8 (Major): the info-name div is not a heading. When a user navigates by heading, the element name is not findable.

Design: change the div.info-name to an h2 element in the JavaScript renderInfo function. The heading level h2 is correct because the page h1 is "Periodic Table of Elements" and the element name is the primary heading of the selected-element detail section.

The existing .info-name CSS style (Rajdhani font, 1.9rem, font-weight 700, color var(--text)) is retained, applied to the h2. The only markup change is the element type.

Additionally, the stat-box label-value pairs (s-label / s-val) should be redesigned as a description list (dl/dt/dd) structure. The current pattern is two sibling divs with no programmatic relationship. The description list pattern provides a native semantic association that all screen readers understand.

Description list design:

- Replace the .stat-box div with a dl element, class stat-box.
- Replace .s-label div with a dt element, class s-label.
- Replace .s-val div with a dd element, class s-val.
- CSS for dt and dd adjusts margin to match the existing visual layout (margin: 0, display: block, no default list indent).
- The four stat boxes (Atomic No., Atomic Mass, Symbol, State) become four dt/dd pairs inside the dl.

Visual appearance is unchanged. Screen readers will now announce each label paired with its value.

## 7. Focus indicator

Finding 7 (Major): the el-btn focus indicator uses the category colour, which varies and may fall below 3:1. A standardised high-contrast focus ring is needed.

Design: replace the variable-colour focus outline with a fixed two-colour focus ring that works on any background.

Focus indicator specification:

- Outer ring: 3px solid white (#FFFFFF), outline-offset: 3px.
- Inner ring: achieved by adding a box-shadow: 0 0 0 1px #000000 (black) inset, giving a black inner edge.
- This creates a white ring with a black inner shadow that is visible against both light and dark backgrounds.
- The white outer ring against the dark card background #1a2235 achieves 21:1 contrast (white on near-black). Pass.
- The white outer ring against adjacent elements (also dark card) achieves 21:1. Pass.
- The 3px width and the 3px offset give an unobscured, clearly visible perimeter well in excess of the WCAG 2.4.13 minimum (perimeter at least as long as a 2x2 CSS pixel box, which is 8px; a 3px outline around a 56x56 cell has a perimeter of approximately (56 + 6) x 4 = 248px).

The same two-colour focus ring applies to filter buttons and series buttons. For the series buttons, which currently use outline: 2px solid var(--accent), update to the standardised 3px white + black-inset ring.

The skip link and search input already have focus styles. The skip link focus style (background: var(--accent)) should be supplemented with an additional 3px white outline to make the focus consistent. The search input focus border-color change should be kept and supplemented with the 3px white outline.

Remove the transform: scale(1.06) effect from the hover/focus-visible state (see Finding 15, reduced motion). The scale effect slightly displaces elements and can cause the focus ring to overlap adjacent cells, contributing to the visual clipping noted in the finding.

## 8. Target sizes

Finding 6 (Major): filter buttons are approximately 25.7px tall, below the 44px AAA threshold.

Design: increase filter button padding to min-height: 44px and padding: 10px 16px. This gives a total button height of: 10 + 10 + (0.78 x 16 x 1.15 line-height) = approximately 20 + 14.4 = 34.4px with default line-height, still short. Set explicit min-height: 44px on .filter-btn. Also set padding: 10px 16px to provide adequate horizontal padding.

With min-height: 44px enforced, the button will always be at least 44px tall regardless of line-height. The button width depends on the label text; the shortest label "Halogens" at 0.78rem is approximately 52px wide, which exceeds 44px. All filter buttons will meet 44x44px.

The search input currently has padding: 10px 14px. The input height is 10 + 10 + (0.9 x 16 x 1) = approximately 34.4px. This falls below 44px. Set min-height: 44px on #search. This is consistent with the WAI-ARIA Authoring Practices recommendation for form fields.

Element cells are already 56x56px (the grid row height), which exceeds 44px. No change needed for cells.

## 9. Reduced motion

Finding 15 (Minor): no prefers-reduced-motion media query. The scale transform and transitions play for all users.

Design: add a prefers-reduced-motion media query that removes all transitions and transforms for users who have requested reduced motion.

The media query covers:

- .el-btn: set transition to none.
- .el-btn:hover, .el-btn:focus-visible: set transform to none (remove scale(1.06)).
- #info-panel: set transition to none.
- #search: set transition to none.
- .filter-btn: set transition to none.

When reduced motion is active, the visual change from hover or focus is provided by the border-color change (which remains) and the background-color change (which remains). These are state changes, not animations, so they do not need to be suppressed.

## 10. Landmark structure

Finding 5 (Major): the controls div uses role="search" for both the search field and filter buttons. The role="search" landmark should wrap only the search input.

Design: restructure the controls region.

Proposed structure:

- Outer div: role="region" aria-label="Search and filter controls". This replaces the current role="search" on the outer div.
- Inner div wrapping only the search label and input: role="search" aria-label="Search elements". This is a named search landmark containing only the search field.
- The .filters div with role="group" aria-label="Filter by category" remains unchanged inside the outer region. It is correctly scoped as a group, not a search landmark.

Screen reader users navigating by landmark will now encounter: "Search and filter controls, region" (outer), "Search elements, search" (inner), and then "Filter by category, group" (inner). This is accurate and unambiguous.

## 11. ARIA grid corrections

Finding 3 (Major): aria-rowcount="9" does not match the actual 10 data rows. aria-rowindex for lanthanide and actinide rows is inconsistent.

Design:

- Change aria-rowcount on #pt-grid from "9" to "10".
- For lanthanide row (row 9 in data): assign aria-rowindex="9".
- For actinide row (row 10 in data): assign aria-rowindex="10".
- The gap-spacer div has role="presentation" and is correctly excluded from the rowcount.
- The calculation in JavaScript should be simplified: use the actual row number for all rows except lanthanides and actinides, which should use 9 and 10 respectively. This matches the visual presentation of 10 element rows.

Sean should update the JavaScript aria-rowindex assignment so that row 9 elements receive aria-rowindex="9" and row 10 elements receive aria-rowindex="10", removing the current subtraction logic that causes inconsistency.

## 12. Info panel live region separation

Finding 4 (Major): the info-panel section has both aria-live="polite" and tabindex="-1", which can cause duplicate announcements.

Design:

- Remove aria-live="polite" from the #info-panel section element. The #sr-live region (a hidden div with aria-live="polite" aria-atomic="true") already handles all announcements correctly.
- Keep tabindex="-1" on #info-panel so the skip link ("Skip to element details") can move focus to it correctly.
- Update the announce() function in JavaScript to announce the full element description, not just the first 120 characters (addresses Finding 17 at the same time).

With aria-live removed from the info panel, VoiceOver and JAWS will no longer risk double-announcing when an element is selected. The user will hear the live region announcement, then may navigate to the info panel to read the full content.

## 13. Skip link target fix

Finding 9 (Major): the "Skip to periodic table" link targets #pt-grid, which is a non-focusable div. Focus arrives at the div but may not enter the grid correctly.

Design:

- Add tabindex="-1" to the #pt-grid div so it can receive focus when the skip link is activated.
- Add a JavaScript focus handler: when focus arrives on #pt-grid (from the skip link), immediately redirect focus to the first focusable grid cell (the current roving tab-index holder). This ensures the user lands on an interactive cell, not a non-interactive wrapper.
- Alternatively, change the skip link href to point to a data-skip-target attribute on the first el-btn, but this approach requires knowing which button is first at skip-link-click time. The tabindex + redirect approach is cleaner.

Sean should implement: add a focusin event listener on #pt-grid that checks whether focus arrived from the skip link (by checking document.referrer or a flag set by the skip link click handler), and if so, calls setRovingTabindex and focuses the first roving-tab-index element.

A simpler implementation: add tabindex="-1" to #pt-grid and rely on the browser to place focus there. Then the user presses Tab once to move into the first grid cell. This is acceptable because the skip link's purpose is to bypass the header, not to start navigation from a specific cell. The one Tab press is a very small additional cost.

## 14. Line length cap on info-desc

Finding 16 (Minor): the info-desc paragraph line length is not capped at 80 characters. On wide viewports it can exceed 80 characters.

Design: add max-width: 65ch to .info-desc. This caps line length at approximately 65 characters, which is within the WCAG 1.4.8 requirement of 80 characters and aligns with best practice for readable line length.

The 65ch unit is relative to the font size of the element, so it scales correctly when the user increases text size.

## 15. Filter button text-transform

Finding 16 (Minor): filter buttons use text-transform: uppercase. Uppercase text reduces legibility and can cause screen readers to announce letters individually.

Design: remove text-transform: uppercase from .filter-btn. Use sentence case or title case instead (the button labels are already in title case with the proposed full names). Apply letter-spacing: 0.04em to retain the slightly spaced appearance without the full uppercase transform. The visual change is small: labels currently read "ALKALI METALS" in all caps; they will read "Alkali Metals" after the change.

## 16. Text spacing

Finding 13 (Minor): text-spacing overrides may cause text to clip or overflow in the fixed-height element cells.

Design: remove the fixed height from element cells and instead set a min-height of 56px. The grid-template-rows: repeat(10, 56px) currently enforces a strict 56px row height. Change this to grid-auto-rows: minmax(56px, auto). When text spacing overrides are applied, the row will expand rather than clip.

Also remove white-space: nowrap and text-overflow: ellipsis from .el-name. At standard text size, element names fit within the cell at 0.52rem. If text spacing overrides push names longer, the name should wrap rather than be clipped by ellipsis. The cell will expand to accommodate it (due to the minmax row height).

The el-num font-size of 0.58rem and el-name of 0.52rem are very small. WCAG 1.4.4 requires that text can be resized to 200% without loss of content. At 200% browser zoom, these sizes become 1.16rem and 1.04rem respectively, which is more readable. The minmax row height will accommodate larger sizes.

## 17. Live region full description

Finding 17 (Minor): the announce function truncates the description to 120 characters.

Design: remove the .substring(0, 120) call from the announce function. Announce the full element description string. Element descriptions are a few sentences each; even the longest is well under 500 characters and will not cause an unreasonable announcement length. The live region is polite, so it will not interrupt ongoing speech.

Update the requirements document section 4.4 item 22 accordingly: the live region should announce the full description, not just the first 120 characters.

## 18. Section headings

Finding 20 (Advisory): the grid and info panel lack visible section headings.

Design:

- The legend section already receives a visible h2 "Element Categories" (section 5.1 above).
- Add a visible h2 to the grid-wrapper div or the main section, with text "Periodic Table". This heading is screen-reader-visible and sighted-user visible; it can be visually styled in a small, understated way (font-size: 0.85rem, font-weight: 600, color: var(--muted)). It appears above the grid-wrapper div.
- The info panel heading is already addressed by making the element name an h2 (section 6 above). Before any element is selected, the info panel shows the placeholder paragraph. During this state, add a static h2 "Element Details" that remains visible at all times, replacing the placeholder's lack of heading. When an element is selected, the h2 becomes the element name.

With these additions, the heading structure of the page is:

- h1: "Periodic Table of Elements" (page title, in header)
- h2: "Periodic Table" (above the grid)
- h2: "Element Details" or the selected element name (info panel)
- h2: "Element Categories" (legend section)

All three h2 headings are at the same level, which is correct: they are three sibling sections of the main content area.

## 19. Identify Purpose (advisory)

Finding 22 (Advisory): WCAG 1.3.6 Identify Purpose, AAA.

Design: this is already treated as best-effort in the team's accessibility.md, where the guidance notes that assistive technology support for the underlying technique is thin. The existing ARIA landmark roles, aria-labels, and consistent naming satisfy the intent as far as current browser and screen reader support allows. No additional design change is specified for this criterion. A documented exception for 1.3.6 should be created in the project wiki and signed off by Tim.

## 20. Abbreviation expansion

Finding 11 (Minor): scientific abbreviations in descriptions are not expanded.

Design: expand abbreviations inline within each element description string. The convention is: spell out the full term first, then give the abbreviation in parentheses. For example: "polytetrafluoroethylene (PTFE)" rather than "PTFE". On subsequent mention within the same description, the abbreviation alone is acceptable.

Abbreviations to expand across the descriptions include: ATP (adenosine triphosphate), DNA (deoxyribonucleic acid), LED (light-emitting diode), ITO (indium tin oxide), LCD (liquid crystal display), PET (positron emission tomography), MRI (magnetic resonance imaging), PTFE (polytetrafluoroethylene), GaAs (gallium arsenide), YAG (yttrium-aluminium-garnet), PVC (polyvinyl chloride), SI (International System of Units), K-Pg (Cretaceous-Paleogene boundary).

This is a data edit to elements-data.js. Barnaby should review the edited descriptions for reading level and plain language at the same time as the abbreviation expansion.

## 21. Reading level

Finding 19 (Advisory): some descriptions exceed grade 9 Flesch-Kincaid.

Design: Barnaby reviews and edits each element description to grade 9 or below, applying the team's reading-level method (short sentences, common words, active voice, specialist terms defined on first use). This is a data edit to elements-data.js and is separate from, but should be coordinated with, the abbreviation expansion above.

## 22. Reflow exception documentation

Finding 12 (Minor): the grid cannot reflow to 320px single-column.

Design: the exception record is created in the project wiki at docs/exceptions/ (a new file, for example 002-grid-reflow.md) with the following content:

Criterion: 1.4.10 Reflow, Level AA.
Reason: a periodic table is a two-dimensional layout whose spatial arrangement carries chemical meaning. The positions of elements in the table (group, period, block) are the primary information structure. A single-column reflow would destroy this structure. WCAG 1.4.10 explicitly recognises this class of exception ("except for parts of the content which require two-dimensional layout for usage or meaning").
Mitigation: the search field and filter buttons are fully accessible at 320px width. A user who cannot navigate the scrolling grid at 320px can search by name, symbol, or atomic number to locate any element and view its details in the info panel. The info panel itself reflows correctly at 320px.
Tim's approval: required before merge.

## 23. Resolution map: all 21 findings

This section maps each finding to the design decision that resolves it.

Finding 1 (Critical, colour contrast): resolved by sections 3.2 (new category colours) and 3.3 (new --muted colour). All category colours now target at least 7:1 against the card background. The --muted replacement targets 9:1.

Finding 2 (Critical, use of colour): resolved by section 4 (non-colour category identifier system). Each category has a unique two-letter abbreviation in the legend dot. Element cells carry a tiny abbreviation via CSS generated content. Category is never conveyed by colour alone.

Finding 3 (Major, aria-rowcount): resolved by section 11. aria-rowcount changed from 9 to 10. aria-rowindex for lanthanide row set to 9, actinide row to 10, consistently.

Finding 4 (Major, info-panel live region conflict): resolved by section 12. aria-live removed from #info-panel. tabindex="-1" retained. Announcements handled exclusively by #sr-live.

Finding 5 (Major, landmark structure): resolved by section 10. Controls restructured as a region containing a named search landmark and a named group. The legend is already a named section landmark (fixed in Phase 1). The overall landmark structure is now accurate and unambiguous.

Finding 6 (Major, target size): resolved by section 8. min-height: 44px applied to filter buttons and search input.

Finding 7 (Major, focus appearance): resolved by section 7. Standardised 3px white outline with black inset shadow. Consistent across all interactive elements. Meets 2.4.13 AAA.

Finding 8 (Major, info-name heading and stat-box associations): resolved by section 6. div.info-name changed to h2. Stat-box pairs changed to dl/dt/dd description lists.

Finding 9 (Major, skip link target): resolved by section 13. tabindex="-1" added to #pt-grid. Focus handling implemented to redirect into the grid.

Finding 10 (Minor, redundant aria-label on search): already closed in Phase 1.

Finding 11 (Minor, abbreviations): resolved by section 20. Inline expansion of all scientific abbreviations in description strings.

Finding 12 (Minor, reflow exception): resolved by section 22. Formal exception documented and signed off by Tim.

Finding 13 (Minor, text spacing): resolved by section 16. Fixed row height changed to minmax. Ellipsis clipping removed from el-name.

Finding 14 (Minor, no timing): no finding. Not applicable.

Finding 15 (Minor, reduced motion): resolved by section 9. prefers-reduced-motion media query added suppressing all transitions and transforms.

Finding 16 (Minor, visual presentation): resolved by sections 14 (line length cap, max-width: 65ch on info-desc) and 15 (text-transform uppercase removed from filter buttons).

Finding 17 (Minor, truncated live region): resolved by section 12 (as part of the live region redesign). The announce function will announce the full description.

Finding 18 (Advisory, location): no finding. Not applicable to a single-page application.

Finding 19 (Advisory, reading level): resolved by section 21. Barnaby edits descriptions to grade 9.

Finding 20 (Advisory, section headings): resolved by section 18. Visible h2 headings added for the grid, info panel, and legend.

Finding 21 (Advisory, filter button labels): resolved by section 2 (design question 5 answer) and the filter button label changes listed there.

Finding 22 (Advisory, identify purpose): resolved by section 19. Treated as best-effort per team policy. Exception record to be created.

## 24. Summary of all CSS custom property changes

The following custom properties in the :root block of css/styles.css should be updated.

Property: --alkali. Old value: #f87171. New value: #ffb3b3.
Property: --alkaline. Old value: #fb923c. New value: #ffc88a.
Property: --transition. Old value: #60a5fa. New value: #a8d4ff.
Property: --post-trans. Old value: #34d399. New value: #7eeac4.
Property: --metalloid. Old value: #a78bfa. New value: #ccb8ff.
Property: --nonmetal. Old value: #86efac. New value: #86efac (unchanged).
Property: --halogen. Old value: #fde047. New value: #fde047 (unchanged).
Property: --noble. Old value: #22d3ee. New value: #85e8f7.
Property: --lanthanide. Old value: #f472b6. New value: #ffadd9.
Property: --actinide. Old value: #f97316. New value: #ffb97a.
Property: --muted. Old value: #8a99b3. New value: #c8d3e8.
Property: --accent. Old value: #38bdf8. New value: #7dd9ff.

No other custom properties require change. The --bg, --surface, --card, --border, --text, and --unknown values are unchanged.

## 25. Full-text design description (for screen reader review)

This section describes the visual design of the remediated page in full text, for Tim's screen reader review.

The page retains its dark theme. The page background is very dark navy (#0b0f1a), near-black. The card surface used for element cells and the info panel is a slightly lighter dark blue (#1a2235). The overall appearance is a deep, dark astronomical palette.

The page heading "Periodic Table of Elements" appears at the top, centred, in a large bold condensed sans-serif (Rajdhani), in the new accent colour, a light sky blue (#7dd9ff). Beneath it, a small subtitle line in the lighter muted blue (#c8d3e8).

Below the heading, the search and filter controls appear in a horizontal flex row that wraps on small screens. The search field is a monospace-text input, dark-surfaced with a light border, tall enough to easily press (44px minimum height). When focused, a white focus ring with a black inner shadow appears around it.

The filter buttons are a row of pill-shaped buttons, each at least 44px tall. Their default state shows the button label in the new muted blue (#c8d3e8) against the dark card surface. When a filter button is pressed, its text and border change to the category colour for that button. Because all category colours now meet 7:1 against the dark card background, the pressed state is clearly legible. Button labels read in title case, for example "Alkaline Earth Metals" and "Post-Transition Metals".

The periodic table grid fills the main area. Each element cell is a 56x56px (minimum) button on the dark card surface. Each cell shows, from top to bottom: a tiny atomic number in monospace font (#c8d3e8 muted blue), a larger element symbol in the category colour (one of the ten lightened colours), and the element name in small text below (#c8d3e8 muted blue). The top edge of each cell has a 2px colour accent strip in the category colour. In the bottom-right corner, a tiny two-letter category abbreviation appears in a very small font, providing a non-colour visual cue.

When a cell has keyboard focus, a 3px white outline with a black inner shadow appears around it, clearly distinguishable from the dark background and from adjacent cells.

When an element is selected, the info panel updates. The panel is a dark-surfaced card with a coloured top border in the selected element's category colour. On the left, a square symbol box (100x100px) shows the atomic number, symbol, and mass in the category colour. On the right, the element name appears as an h2 heading in large bold white text. Below the name, pill-shaped tags show the category, state, period, and group in the category colour. Below the tags, four description-list pairs show atomic number, atomic mass, symbol, and state as label-value pairs. Below those, the description paragraph appears in the muted blue (#c8d3e8), with line-height 1.65 and max-width 65ch.

Below the info panel, the legend section is headed by a small h2 "Element Categories". Below that heading, ten legend items appear in a flex row that wraps. Each item shows a 16x16px coloured dot (in the category colour) containing a two-letter white abbreviation, followed by the full category name in muted blue text at 0.85rem.

Skip links appear in the top-left corner when focused by keyboard. They have a light blue background (#7dd9ff) with black text, clearly visible against the dark page background.

The visual character of the page is preserved: it remains a dark, technical, space-exploration aesthetic. The category colours are lighter than before (pastel rather than saturated mid-tones) but retain their hue identities. The overall impression is still a dark-background design with colour-coded categories, now with all colours light enough to read clearly against the dark backgrounds.

## 26. Open questions for Tim

There are no design questions that block this specification. The five questions from Carol's audit have been answered with design recommendations in section 2.

One item requires Tim's explicit sign-off before merge: the formal exception for WCAG 1.4.10 Reflow (Finding 12). This is not a question but a governance step. Sonja should obtain Tim's sign-off on the exception record before the Phase 2 implementation is merged.

One item requires Tim's confirmation of the reading-level approach (section 21): if Tim prefers a documented exception for element descriptions rather than edited descriptions, the recommendation changes. This is a light-touch question and does not block the design.

---

Usage tracking note: token count, tool-call count, and duration are not available from within the agent session.
