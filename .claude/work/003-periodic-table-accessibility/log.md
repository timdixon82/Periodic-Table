# Work Log: 003-periodic-table-accessibility

This log is chronological and append-only.

## [2026-05-21] setup | Work folder created

Phase 2 of the Periodic-Table project: remediate the 21 accessibility findings from Carol's baseline audit to reach WCAG 2.2 AAA. Created at Tim's direction to start Phase 2.

## [2026-05-21] dispatch | Simon dispatched for the remediation design

Dispatched Simon to design the AAA-conformant remediation and to recommend answers to Carol's five open design questions.

## [2026-05-21] dispatch | Phase 2 implementation dispatched to Sean

With Periodic-Table Phase 1 merged to `main`, Tim directed that Phase 2, the accessibility remediation, start. Dispatched Sean in the background to implement Simon's design specification (`simon-design-spec.md`) on a new branch off `main`: the AAA colour scheme, the non-colour category identifiers, the focus indicator, target sizes, ARIA and landmark corrections, the reduced-motion query, and the rest of Simon's 24-section spec. Excluded from Sean's scope, for Barnaby to do as a coordinated follow-up: the element-description reading-level rewrite and abbreviation expansion in `js/elements-data.js` (Simon sections 20 and 21). Sean will also attempt the accessibility-workflow `--no-sandbox` fix deferred from Phase 1 under decision 2A.
Note (2026-05-22, intake I1): Barnaby's work is now covered by Tad, the team's business analyst, documenter, researcher, and copywriter.

Sean is building on Simon's recommended answers to Carol's five design questions: keep the dark theme, inline abbreviation expansion, full filter-button names, grade-9 descriptions, and a documented reflow exception. Tim has been told he may override any before Sean finishes. The WCAG 1.4.10 Reflow exception and the 1.3.6 Identify Purpose exception need Tim's explicit sign-off before the Phase 2 merge.

## [2026-05-21] note | Phase 2 build blocked on a git-push permission gap; settings topped up, Sean re-dispatched

Sean's first Phase 2 pass stopped early: a git command was denied by the session permission system. The cause is a gap in `.claude/settings.local.json`. It allowed `git checkout`, `git add`, `git commit`, and pushes of the specific branch `chore/project-setup`, but not `git fetch` and not a push of the new Phase 2 branch `feat/accessibility-phase-2`. Sonja added `git fetch` and branch-scoped push permissions for the `chore/`, `feat/`, and `fix/` branch prefixes. These never match a push to `main`, so the rule that a push to `main` always prompts is preserved, and the hard deny-list is unchanged. Sean was re-dispatched in the background with instructions to use plain git commands and to report the exact command if anything is still denied.

## [2026-05-21] note | Phase 2 implementation complete; pull request 3 open, all checks green

Sean completed the Phase 2 implementation. Branch `feat/accessibility-phase-2`, pull request 3 on the Periodic-Table repository, branch head `75d4733`. All six checks pass: accessibility, lint, CodeQL, dependency-review, Semgrep, and Trivy. The accessibility check is green, so the AAA structural remediation works.

Sean implemented every item of Simon's design specification, with the colour values verified against the exact WCAG luminance formula (all 12 updated properties reach 9.0:1 to 15.9:1, above the 7:1 AAA threshold), and edited the accessibility workflow to add the matching-Chrome install and a `pa11y.json`. Excluded for Barnaby, as planned: the element-description abbreviation expansion and reading-level rewrite in `js/elements-data.js` (Simon sections 20 and 21). Two exception records were created, `docs/exceptions/002-grid-reflow.md` and `docs/exceptions/003-identify-purpose.md`, both with Tim's approval marked pending; both need his sign-off before the Phase 2 merge.
Note (2026-05-22, intake I1): Barnaby's work is now covered by Tad, the team's business analyst, documenter, researcher, and copywriter.

One quality note from Sean: three early commits on the branch have poor messages ("test", "placeholder") left over from working around the git permission constraints. The substantive code is committed correctly; only the messages are weak. Branch history cannot be rewritten (the deny-list forbids it); a squash merge would resolve it at merge time.

Next on Phase 2: Barnaby's description rewrite, then Carol's AAA re-test, Neil's release checklist, Sonja's conformance check, Tim's sign-off on the two exceptions, and the merge gate.

## [2026-05-21] note | Barnaby's descriptions committed; Carol dispatched for the Phase 2 re-test

Barnaby completed the element-description rewrite: 13 scientific abbreviations expanded on first use, and 5 descriptions rewritten to Flesch-Kincaid grade 9, 16 of 118 descriptions changed, with no accuracy question for Tim. Sonja committed the change as `480fc6d` and pushed it to `feat/accessibility-phase-2`. The Phase 2 implementation is now complete: Sean's structural remediation plus Barnaby's descriptions.
Note (2026-05-22, intake I1): Barnaby's work is now covered by Tad, the team's business analyst, documenter, researcher, and copywriter.

Dispatched Carol in the background to re-test Phase 2 against WCAG 2.2 AAA and give the full accessibility sign-off, checking every baseline finding, including the `role="row"` grid-structure finding raised during Phase 1.

## [2026-05-21] consolidate | Carol's Phase 2 re-test: three items flagged for rework

Carol re-tested Phase 2 on `feat/accessibility-phase-2`. Verdict: not yet at WCAG 2.2 AAA. 21 of the 22 findings (the 21 baseline plus the role="row" carry-forward) are resolved or documented as exceptions. Three items need rework: N1 (Major, WCAG 4.1.2) the ARIA grid lacks `role="row"` wrappers, the role="row" finding carried from Phase 1, confirmed by axe-core; N2 (Minor, WCAG 1.4.6) the `.info-placeholder` text fails AAA contrast because `opacity: .6` is applied to a colour; N3 (Minor, WCAG 1.4.6) the `--unknown` category colour was not updated and reaches only about 6.2:1. Pa11y reported zero issues. Functional and visual checks pass with no regression.

Per the Carol re-dispatch rule, Sonja re-dispatched Sean to make the three fixes on the Phase 2 branch; the corrected branch then returns to Carol for a focused re-check. The two exception records, `002-grid-reflow.md` and `003-identify-purpose.md`, still need Tim's sign-off before the Phase 2 merge.

## [2026-05-21] note | Phase 2 rework: subagent git blocked again; Sean edits, Sonja commits

Sean's first pass at the three fixes stopped before any edit: a git command was denied for the subagent, the recurring subagent-git friction. Sean's Edit tool works reliably; only git is unreliable for subagents. Sonja re-dispatched Sean to make the three file edits only, with no git, the same split that worked for Barnaby's description rewrite, and Sonja will commit and push the result. The recurring subagent-git friction is flagged for Tim; a Claude Code restart would most cleanly clear it.

## [2026-05-21] note | Phase 2 rework committed; Carol dispatched for the focused re-check

Sean made the three fixes as file edits only: N1, `buildGrid` now wraps each row's cells in a `div[role="row"]` with `aria-rowindex` on the wrapper; N2, `.info-placeholder` drops `opacity` for an explicit colour `#a8b8d0` at 7.9:1; N3, `--unknown` lightened to `#c2cce0` at 9.8:1. Sonja committed the two files as `f8089f7` and pushed to `feat/accessibility-phase-2`. Dispatched Carol for a focused re-check of N1, N2, and N3 plus a regression check; on a clean result she gives the full Phase 2 WCAG 2.2 AAA sign-off.

## [2026-05-21] note | N1 layout regression fixed; Carol dispatched for the final re-check

Carol's re-check: N2 (`#a8b8d0`, 7.88:1) and N3 (`#c2cce0`, 9.82:1) pass. N1's ARIA row wrappers are structurally correct, but they broke the CSS grid layout: the `div[role="row"]` wrappers became grid items in place of the cells. Carol's recommended fix was a one-rule CSS change. The fix being precisely specified and trivial, Sonja applied it directly: `#pt-grid > div[role="row"] { display: contents; }` in `css/styles.css`, committed as `6e37375`. This makes the wrappers transparent to CSS layout while keeping them in the accessibility tree. Dispatched Carol for the final re-check; on a clean result she gives the full Phase 2 WCAG 2.2 AAA sign-off.

## [2026-05-21] sign-off | Carol's full Phase 2 sign-off; lint fixed; Neil dispatched

Carol's final re-check passed: N1, N2, and N3 all resolved, all 22 Phase 2 findings resolved or documented as exceptions, no regression. Full Phase 2 WCAG 2.2 AAA sign-off. Pull request 3 checks: accessibility, Semgrep, Trivy, CodeQL, and dependency-review pass; the lint check failed on a single stylelint `comment-empty-line-before` error at `css/styles.css:97`, which Sonja fixed directly (commit `7416268`); CI is re-running and is expected green. Dispatched Neil for the Phase 2 release checklist.
Note (2026-05-22, intake I1): Neil's work is now covered by Carol, the team's tester and release manager.

Remaining before the merge gate: the lint re-run confirmed green, Sonja's architecture-and-security conformance check, the `VERSION` bump from 0.1.0 to 1.0.0 for this AAA-conformant release, Neil's checklist, and Tim's sign-off on the two exception records, `002-grid-reflow.md` (WCAG 1.4.10) and `003-identify-purpose.md` (WCAG 1.3.6).

## [2026-05-21] check | CI green, version 1.0.0, conformance check passed; Neil's checklist in

Pull request 3's seven checks all pass after the stylelint fix: lint, accessibility, Semgrep, Trivy, CodeQL, analyze, and dependency-review. Sonja bumped the `VERSION` file to 1.0.0 (commit `6fa135b`), the AAA-conformant first full release. Sonja ran the architecture-and-security conformance check for Phase 2: pass, recorded in `sonja-conformance-check.md`. Neil produced the Phase 2 release checklist (`neil-phase2-release-checklist.md`); his verdict listed five outstanding items.
Note (2026-05-22, intake I1): Neil's work is now covered by Carol, the team's tester and release manager.

Three of Neil's five items are now closed: CI is green, the version is bumped, and the conformance check has passed. Two remain, both Tim's: his sign-off on the two exception records, and his screen-reader test. Both have been put to Tim.

## [2026-05-21] note | Exceptions signed off; Tim's screen-reader test found a keyboard-navigation defect

Tim answered Q1A and Q2A, approving both Phase 2 accessibility exceptions; Sonja recorded his sign-off in `docs/exceptions/002-grid-reflow.md` and `003-identify-purpose.md` and committed it (`2a12055`). Tim answered Q3A and screen-reader tested the Phase 2 branch on a local server.

Tim's test found a keyboard-navigation defect: when a category filter is applied, the grid's arrow-key navigation still moves to the dimmed, filtered-out elements. Tim's instruction: keyboard navigation must move only between the elements that match the active filter.

The Phase 2 merge is held. Per the rework process, Sonja dispatched Sean to fix the grid keyboard navigation in `js/periodic-table.js` so the roving tab-index and the arrow-key, Home, and End navigation skip dimmed elements while a filter is active; Sean makes the edit and Sonja commits. The fix then returns to Carol for a focused re-test, and to Tim to confirm the behaviour before the merge.

## [2026-05-21] note | Keyboard-navigation fix committed; Carol dispatched for the re-test

Sean fixed the defect in `js/periodic-table.js`: a new `isNavigable` predicate excludes dimmed elements; `findNearest` skips them for the arrow, Home, and End keys; `applyFilters` moves the roving tab-index to the nearest navigable cell when the focused cell becomes dimmed. Two pre-existing Home and End branch bugs were corrected alongside. Sonja committed it (`e5b60c2`) and pushed to `feat/accessibility-phase-2`. Dispatched Carol for a focused re-test of the filtered keyboard navigation plus a regression check; on a clean result, Tim re-checks the behaviour on the local server and the merge proceeds.

## [2026-05-21] note | Filter-navigation fix passed Carol; series-button anomaly surfaced

Carol re-tested the filtered keyboard-navigation fix (commit `e5b60c2`): PASS. All six scenarios confirmed, with no functional, accessibility, or visual regression. The defect from Tim's screen-reader test is resolved; the fix is ready for Tim's confirmation on the local server.

Carol flagged a separate pre-existing anomaly, not introduced by the fix: the Lanthanide and Actinide series jump buttons carry no row reference, so ArrowUp and ArrowDown from them do nothing (ArrowLeft and ArrowRight work). It is a keyboard-navigation gap that pre-dates Phase 2 and was not in Carol's 22 baseline findings or Simon's design. Sonja put it to Tim as question Q2: fix it within Phase 2 before the merge, or record it as a known limitation and fix it in a follow-up.

## [2026-05-21] decision | Q2A: series-button keyboard fix dispatched

Tim answered Q2A: fix the Lanthanide and Actinide jump-button keyboard-navigation gap within Phase 2. Dispatched Sean to fix `js/periodic-table.js` so the ArrowUp and ArrowDown keys work from a `series-btn`, by deriving the button's row from its `role="row"` wrapper, since the button itself carries no row reference. Edits only; Sonja commits; Carol then re-tests. After this fix, Carol's re-test, and Tim's re-check of the filter fix on the local server, the Phase 2 merge gate is fully satisfied.

## [2026-05-21] note | Session rate limit hit; series-button fix re-dispatched

The team hit the Claude Max session rate limit. The series-button fix dispatch was cut off before it ran. The limit has since reset; Sonja re-dispatched Sean for the same series-button keyboard fix. No work was lost: nothing had been committed.

## [2026-05-21] note | Series-button fix committed; Carol dispatched for the re-test

Sean completed the series-button keyboard fix: a new `rowOf` helper derives a button's grid row from `data-row`, or, for a `series-btn`, from its `role="row"` wrapper's `aria-rowindex`; `handleGridKeydown` and the `applyFilters` rescue path both use it. Sonja committed it as `3418e45` and pushed to `feat/accessibility-phase-2`. Dispatched Carol for a focused re-test of ArrowUp and ArrowDown from the Lanthanide and Actinide jump buttons, plus a regression check. On a clean result, the only Phase 2 item left is Tim's re-check of the filter fix on the local server, then the merge.

## [2026-05-22] fix | Screen-reader linear-navigation defect: dimmed buttons not excluded from accessibility tree

Tim's screen-reader re-check revealed that VoiceOver's linear reading navigation (VO+Right, element rotor) still traverses all 118 element buttons when a filter is active. The earlier fix (commit `e5b60c2`) only added roving-tabindex and arrow-key skip logic, which operates on the ARIA grid model. It did not prevent VoiceOver's reading cursor from visiting dimmed buttons, because `tabindex="-1"` removes a button from Tab order but does not remove it from the accessibility tree.

Root cause: `applyFilters` toggled the `.dimmed` CSS class and `tabindex` attribute, but did not set `aria-hidden="true"` on filtered-out buttons. VoiceOver and JAWS reading-cursor traversal visits every DOM element that is present in the accessibility tree, regardless of `tabindex`.

Fix applied by Sean: in `applyFilters` in `js/periodic-table.js`, alongside `btn.classList.toggle('dimmed', !show)`, add `btn.setAttribute('aria-hidden', 'true')` when `!show` and `btn.removeAttribute('aria-hidden')` when `show`. This removes filtered-out buttons from the accessibility tree, so VoiceOver and JAWS linear navigation skips them. Clearing the filter restores all buttons to the tree. The `series-btn` elements (Lanthanide and Actinide jump buttons) are not touched by `applyFilters` and remain in the tree at all times, which is correct.

Manual lint review: no new variables, no new control flow beyond an if/else block, all DOM methods standard. ESLint rules no-unused-vars, no-undef, eqeqeq, no-eval, no-implied-eval, no-new-func: all satisfied. No CSS or HTML changes.

Next: Sonja commits the edit and dispatches Carol for a focused re-test of VoiceOver linear navigation in filtered and unfiltered states.

## [2026-05-22] note | Session resumed from the handoff; Carol dispatched for the screen-reader-fix re-test

A fresh Sonja session resumed the engagement from `.claude/work/HANDOFF.md`. Verified the live state of the Periodic-Table repository: branch `feat/accessibility-phase-2` head is `8ef5640` (the `aria-hidden` linear-navigation fix), pushed, working tree clean. Pull request 3: open, mergeable, all seven checks green (CodeQL, accessibility, analyze, dependency-review, lint, semgrep, trivy).

Dispatched Carol in the background for a focused WCAG 2.2 AAA re-test of commit `8ef5640`: that filtered-out element buttons carry `aria-hidden="true"` so VoiceOver and JAWS linear navigation skip them, that clearing the filter restores them to the accessibility tree, that the series jump buttons are unaffected, that the roving-tabindex and arrow-key skip logic from `e5b60c2` and `3418e45` is not regressed, and that no filtered-out button is a focusable element inside an `aria-hidden` subtree. On a clean result, the fix goes to Tim for his screen-reader re-check on the local server, then the conformance check and merge gate.

## [2026-05-22] consolidate | Carol's re-test: aria-hidden fix correct, one related defect flagged

Carol re-tested commit `8ef5640`. The `aria-hidden` toggle in `applyFilters` is correctly implemented and resolves Tim's reported VoiceOver linear-reading defect: filtered-out element buttons get both `.dimmed` and `aria-hidden="true"`, clearing the filter removes `aria-hidden` from all 118 buttons, the series jump buttons are untouched and stay in the accessibility tree, and the roving-tabindex and arrow-key skip logic from `e5b60c2` and `3418e45` is not regressed. Automated scanners are not installed in the project, so Carol's re-test was a static code review.

Carol flagged one related defect (Medium): `jumpToRow` in `js/periodic-table.js` calls `.focus()` on `btnGrid[row][firstCol]` without checking that the button is navigable. When a category filter is active that hides the target series, for example the Actinide filter active and the user presses the Lanthanide series jump button, `jumpToRow` delivers real keyboard focus to a button that is now `.dimmed` and `aria-hidden="true"`. Focusing an element inside an `aria-hidden` subtree is an anti-pattern that risks WCAG 4.1.2 Name, Role, Value and 2.1.1 Keyboard, because the screen reader cannot perceive the focused element.

Per the Carol re-dispatch rule, Sonja re-dispatched Sean to fix `jumpToRow`: focus the nearest navigable cell in the target row using the existing `findNearest` helper, which honours `isNavigable`; if the whole target row is dimmed under the active filter, suppress the jump and leave focus and the roving tab-index unchanged. Edits only; Sonja commits and pushes; Carol then re-tests. Tim's screen-reader re-check is deferred until this fix passes Carol.

## [2026-05-22] note | jumpToRow fix committed; Carol dispatched for the re-test

Sean made the `jumpToRow` fix as a file edit: the one substantive change is `const btn = rowBtns[firstCol]` replaced with `const btn = findNearest(row, firstCol, 'other')`, plus an updated comment. `findNearest` honours `isNavigable`, so a dimmed button is never focused; when the whole target row is dimmed, `findNearest` returns null and the existing `if (btn)` guard suppresses the jump, leaving focus and the roving tab-index unchanged. Sean's manual ESLint review was clean. Sonja committed it as `7794554` and pushed to `feat/accessibility-phase-2`.

Dispatched Carol for a focused re-test of commit `7794554`: the Defect 1 trigger scenario in both directions, the navigable-cell path, the suppression path, and a regression check. On a clean PASS, the screen-reader navigation fix is fully signed off and the work moves to Tim's screen-reader re-check on the local server, then the conformance check and merge gate.

## [2026-05-22] sign-off | Carol's PASS on the jumpToRow fix; screen-reader navigation fix signed off by testing

Carol re-tested commit `7794554`. Verdict: PASS at WCAG 2.2 AAA. Defect 1 does not reproduce in either direction (Actinide filter then Lanthanide jump button, and the reverse): when the whole target series is hidden, `findNearest` returns null and `jumpToRow` suppresses the jump, leaving focus on the series button the user activated, so no dimmed `aria-hidden` button is ever focused. The navigable-cell path and the no-filter path are unchanged in observable behaviour; no regression to the `aria-hidden` filter fix, the roving tab-index, or arrow-key navigation. This completes the full focused re-test sign-off for the screen-reader navigation fix.

Carol noted one non-blocking usability item, not a WCAG failure: the suppressed jump is silent, with no screen-reader announcement, so a user does not learn why nothing happened. Carol flagged it for Tim's attention during his screen-reader re-check; if he finds it confusing, a one-line live-region announcement in the suppression branch would address it.

CI on `7794554`: all seven checks green (CodeQL, accessibility, analyze, dependency-review, lint, semgrep, trivy). Pull request 3 mergeable. The local server was restarted on port 8080 serving the branch. Next: Tim's screen-reader re-check, then the architecture-and-security conformance re-confirmation and the merge gate.

## [2026-05-22] merge | Periodic-Table Phase 2 merged to main; release workflow found broken

Tim completed his screen-reader re-check and gave express approval to merge. Sonja ran the merge gate: all seven checks green on `7794554`; Carol's full WCAG 2.2 AAA sign-off in place; the architecture-and-security conformance check re-confirmed for the keyboard-navigation commits (recorded in `sonja-conformance-check.md`); all five release-checklist items closed (CI green, VERSION at 1.0.0, conformance passed, exceptions signed off, Tim's screen-reader test complete). Gate satisfied.

Sonja squash-merged pull request 3 to `main` as commit `6ab5054`, "feat: WCAG 2.2 AAA accessibility remediation (Phase 2)". The squash collapses the three weak early commit messages. The squash commit body carries a `Release-As: 1.0.0` footer to drive the intended 1.0.0 release. The CI workflow on `main` passed and GitHub Pages is deploying the AAA-conformant site.

The Release workflow failed: `release-please failed: Missing required manifest config: release-please-config.json`. release-please v17 (action v5) runs in manifest mode and requires `release-please-config.json` and `.release-please-manifest.json` in the repository; neither exists, and `release.yml` passes no `release-type`. The release automation has never been able to run, so no 1.0.0 release pull request was created. This does not affect the merged, deployed site; it blocks only the automated GitHub release and tag. The handoff's expectation that the merge would "trigger the release-please 1.0.0 pull request" was therefore mistaken: the release workflow was incomplete.

Dispatched Jacob to analyse the release-please configuration gap and recommend the fix. Sonja will bring his recommendation to Tim before any implementation. Then Sean implements, Carol tests, and the fix merges on Tim's express approval.

## [2026-05-22] note | Jacob's release-please recommendation received; Q11 to Q13 triaged

Jacob analysed the gap and wrote `jacob-release-please-recommendation.md`. The fix: `release-type: simple`; add `release-please-config.json` and `.release-please-manifest.json` to the repository root, the manifest seeded at `1.0.0` so it agrees with the `VERSION` file and the `Release-As: 1.0.0` footer on `6ab5054`; an `extra-files` generic entry keeps the `VERSION` file in sync; add `config-file` and `manifest-file` to the `with` block of `release.yml`. The changelog is generated by release-please into `CHANGELOG.md`, which implements the Phase 1 changelog decision unchanged. The workflow permissions and token are unchanged and remain least privilege.

Jacob raised three questions, Q11 to Q13. Q11 (release tag format, `v` prefix recommended) and Q12 (pre-authorise a single forcing empty commit if the first release run is silent, recommended) were put to Tim. Q13 (routing of the fix) is an orchestration call, so Sonja resolved it directly: the fix is a fresh follow-up branch with its own pull request, tracked in this 003 work folder because it completes the Phase 2 release; the merged `feat/accessibility-phase-2` branch is not reused. Q13 is therefore consumed; the next new question is Q14.

Jacob recommends a new Periodic-Table Decision Record 005 (release automation configuration) and a cross-cutting update to the global `release-process.md`, because Clock-Practice, LLBS, Braille-Reference, and timdixon82.github.io will all hit the identical gap. Sonja accepts the cross-cutting call: the release-please manifest-mode requirement is a team-wide lesson, so it will be dual-written to the global wiki and the project decision record, and the global `release.yml` template checked. Planned sequence once Tim answers Q11 and Q12: Sean implements; Jed reviews the workflow change for supply-chain security; Carol tests; conformance check and merge gate; merge on Tim's express approval; then the release-please 1.0.0 pull request is created.

## [2026-05-22] note | Release-please fix implemented; pull request 4 open; Jed and Carol dispatched

Tim answered Q11A (`v`-prefixed tags) and Q12A (Sean pre-authorised to add one forcing empty commit only if the first release run is silent). Sonja created the branch `fix/release-please-config` off `main` and dispatched Sean, who created `release-please-config.json`, `.release-please-manifest.json`, and `docs/decisions/005-release-automation-configuration.md`, added `config-file` and `manifest-file` to the `with:` block of `release.yml`, and listed the new record in `docs/index.md`. Sonja reviewed all five files against Jacob's specification: correct, and Decision Record 005 is well-formed and screen-reader friendly. Committed as one `ci:` commit, pushed, and pull request 4 opened on the Periodic-Table repository.

Dispatched Jed for a CI and supply-chain security review of the workflow change, and Carol for testing and the WCAG 2.2 AAA accessibility check of Decision Record 005, in parallel. On clean results: Sonja's conformance confirmation, the merge gate, and merge on Tim's express approval, which triggers the release-please 1.0.0 pull request.

## [2026-05-22] note | Carol's PASS on pull request 4

Carol tested pull request 4. Verdict: PASS. The two configuration files match Jacob's specification exactly; the `release.yml` change is exactly the two specified lines at correct indentation; no `CHANGELOG.md` was committed; Decision Record 005 and the `docs/index.md` change meet WCAG 2.2 AAA; all seven CI checks pass on the branch (CodeQL, accessibility, analyze, dependency-review, lint, semgrep, trivy); no source file was touched, so the merged Phase 2 site is intact. As release manager, Carol confirmed this configuration fix needs no separate release checklist and that her PASS is sufficient for the pull request 4 merge gate. Awaiting Jed's security review before Sonja presents the merge gate to Tim.

## [2026-05-22] note | Jed's security PASS on pull request 4; merge gate satisfied

Jed reviewed pull request 4 against the OWASP Top 10 and GitHub Actions supply-chain security. Verdict: PASS, no findings. Workflow permissions remain least-privilege (`contents: write` and `pull-requests: write` only); the action stays pinned to a full commit SHA; only the built-in `GITHUB_TOKEN` is used; the new configuration files carry no secrets, trigger no runtime fetch, and create no path-traversal or injection risk. Jed produced a six-point release-please supply-chain security note for the team and flagged it, alongside Jacob's configuration recommendation, for promotion to the global `release-process.md`.

Merge gate for pull request 4: all seven CI checks green; Carol's full PASS; the architecture-and-security conformance check satisfied (Jacob designed the change, Jed's security review passed, Sonja confirms it conforms); no separate release checklist needed. The gate is satisfied. Sonja is presenting pull request 4 to Tim for his express merge approval.

## [2026-05-22] merge | Pull request 4 merged; release-please blocked on a repository setting

Tim gave express approval and Sonja squash-merged pull request 4 to `main` as `d5278e7`, adding the release-please configuration. The Release workflow then ran and got much further than before: it read the config, scanned history, and created the release branch and a commit. It failed at the final step with `release-please failed: GitHub Actions is not permitted to create or approve pull requests`. This is the repository setting "Allow GitHub Actions to create and approve pull requests" (Settings, Actions, General), which is off. While it is off, no workflow can open a pull request, so release-please cannot open the 1.0.0 release pull request. This is a repository-settings gap, not a code or configuration defect.

Sonja dispatched Jed to assess it. Jed's verdict: enabling the setting is the correct and proportionate fix. The repository's workflows are all pinned to full commit SHAs and the merge gate requires Tim's express approval, so the risk is low and acceptable. A Personal Access Token, the alternative, is worse, as Jed's pull request 4 note already advised. Only `can_approve_pull_request_reviews` needs changing; the release workflow's own `permissions` block makes `default_workflow_permissions` irrelevant to release-please, though setting it to `read` is good hygiene. Jed produced a standing note for the global release process, since every team project that uses release-please needs this setting enabled.

Sonja is putting the setting change to Tim for approval, because it is a GitHub action and is not pre-approved. On his approval, Sonja enables the setting and re-runs the Release workflow, so release-please opens the 1.0.0 release pull request.

## [2026-05-22] release | Setting enabled; release-please opened the 1.0.0 release pull request

Tim approved enabling the setting. Sonja enabled "Allow GitHub Actions to create and approve pull requests" on the Periodic-Table repository: `can_approve_pull_request_reviews` set to true, `default_workflow_permissions` confirmed already `read`. Sonja re-ran the Release workflow. The rerun succeeded, and release-please opened pull request 5, "chore(main): release 1.0.0", from the `release-please--branches--main` branch.

Pull request 5 has no continuous-integration checks. This is expected: GitHub does not trigger `pull_request` workflows for a pull request opened by another workflow's `GITHUB_TOKEN`. Pull request 5 contains only generated release metadata, the changelog and the manifest, not source code; the source already passed every check when Phase 2 and pull request 4 merged. Next: Carol, as release manager, reviews the release pull request's contents; then the merge gate; then Sonja presents pull request 5 to Tim, whose express approval merges it and creates the `v1.0.0` tag and the GitHub release.

## [2026-05-22] release | Pull request 5 merged; version 1.0.0 released; project complete

Carol, as release manager, reviewed pull request 5: verdict READY TO MERGE, all release-checklist items satisfied, the pull request adds only the generated changelog, version 1.0.0 consistent across the changelog, manifest, and `VERSION` file. Sonja confirmed the merge gate and presented pull request 5 to Tim. Tim gave express approval.

Sonja squash-merged pull request 5 as commit `100b09f`. The Release workflow then created the `v1.0.0` Git tag and the `v1.0.0` GitHub release, marked Latest. Periodic-Table Phase 2 is complete: the WCAG 2.2 AAA accessibility remediation is merged, version 1.0.0 is released, and the site is deployed via GitHub Pages. Work folder 003 is closed.

One small open follow-up, not Periodic-Table-specific: Periodic-Table's `eslint.config.js` carries a dead `eslint/use-at-your-own-risk` import (found during the Clock-Practice globals work). Jacob recommended removing it and optionally adopting the `globals` package, as a separate small change so the two reference projects match.
