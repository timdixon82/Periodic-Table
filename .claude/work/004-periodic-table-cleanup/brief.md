# Brief: 004-periodic-table-cleanup

## Summary

Post-phase-2 housekeeping: remove three unused Rajdhani font files and their `@font-face` declarations, merge duplicate visually-hidden CSS rules, simplify redundant dual CSS selectors, and commit the outstanding `001` work-folder log timestamps.

- Status: archived
- Branch: feat/004-periodic-table-cleanup
- Priority: low
- Blockers: None

## Out of scope

- Any new features or accessibility changes.
- Modifying the content of inline comments (comment wording is not in scope; only structural code cleanup).
- Changing font choices or colours.
- Touching the Nunito Sans or Share Tech Mono font files (only Rajdhani 400/500/600 are unused).

## Risk and rollback

Low risk. All three changes are removals of unused CSS or binary assets, or DRY CSS consolidation with identical declarations. No functional behaviour changes. Rollback: revert the PR.

## Definition of done

- `assets/fonts/rajdhani-latin-400-normal.woff2`, `rajdhani-latin-500-normal.woff2`, and `rajdhani-latin-600-normal.woff2` deleted.
- Corresponding three `@font-face` blocks removed from `css/styles.css`.
- `.sr-only` and `#sr-live` CSS rules merged into one block.
- Dual CSS selectors for `.s-label` and `.s-val` simplified to `dt.s-label` and `dd.s-val` only.
- `.claude/work/001-periodic-table-setup/log.md` committed (outstanding hook timestamps).
- CI, lint, accessibility, and Playwright checks all pass.
- PR opened against main.

## Requirements

### 1. Remove unused Rajdhani font weights

Only `font-weight: 700` Rajdhani is referenced anywhere in `css/styles.css`. The 400, 500, and 600 weight files are loaded via `@font-face` but never requested by any CSS rule.

Delete these three files:
- `assets/fonts/rajdhani-latin-400-normal.woff2`
- `assets/fonts/rajdhani-latin-500-normal.woff2`
- `assets/fonts/rajdhani-latin-600-normal.woff2`

Remove their three corresponding `@font-face` blocks from `css/styles.css` (lines 5–35 of the current file cover all four Rajdhani weights; remove the three for 400, 500, and 600 only).

`rajdhani-LICENSE.txt` stays — Rajdhani 700 is still used.

### 2. Merge `.sr-only` and `#sr-live` CSS rules

In `css/styles.css`, `.sr-only` (lines 145–152) and `#sr-live` (lines 154–161) have identical declarations. Merge them into one rule block:

```css
.sr-only,
#sr-live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

### 3. Simplify dual CSS selectors

In `css/styles.css`, the stat-box selectors use a dual fallback introduced when the HTML moved from `div` to `dl`/`dt`/`dd`. The HTML now uses `dt.s-label` and `dd.s-val` consistently. Simplify:

Before:
```css
.stat-box dt.s-label,
.stat-box .s-label { … }

.stat-box dd.s-val,
.stat-box .s-val { … }
```

After:
```css
.stat-box dt.s-label { … }

.stat-box dd.s-val { … }
```

Preserve all property declarations inside each block exactly as they are.

### 4. Commit outstanding log timestamps

`.claude/work/001-periodic-table-setup/log.md` has six uncommitted subagent-completion timestamp lines appended by the hook. Include this file in the same commit.

## Routing plan

1. Sean: implement all four items on branch `feat/004-periodic-table-cleanup`.
2. Carol: run the full CI suite (Pa11y, axe, Playwright, lint). Verify no regressions.
3. Sonja: merge gate, present to Tim, merge only on his express approval.

## Approved GitHub actions

The Periodic-Table repository. The actions ticked below may run without pausing for Tim.

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [ ] Comment on a pull request or an issue
- [ ] Create an issue

## Not pre-approved

- Merging to the main branch.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
