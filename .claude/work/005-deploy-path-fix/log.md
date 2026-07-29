## [2026-07-29] Opened | Live site missing CSS/JS

Tim reported the live site at https://projects.timdixon.net/Periodic-Table/ appears to have resource files at the wrong path. Confirmed by fetching `css/styles.css` from the live site: HTTP 404.

Root cause traced: `.github/workflows/deploy.yml` was overwritten by the v1.9.3-1.9.6 template syncs with the generic BUNDLED-job rsync allow-list (`/styles/***`, `/scripts/***`, `/data/***`, `/assets/***`). This project's actual runtime folders are `css/` and `js/` (per `index.html` and the project's own `docs/patterns/github-pages-deploy.md`), so neither folder is copied into `_site/` and the deployed page ships with no CSS and no JavaScript.

This is project-specific: the deploy.yml template already documents the correct extension mechanism ("a project that genuinely needs an extra runtime path adds one explicit --include line for it"), so no change to the AgentTeam master template is needed. Classified as a bug fix (triage type 6). Dispatching Sean to add the missing include lines.
- [2026-07-29 18:33:53] subagent completed
- [2026-07-29 18:34:17] subagent completed

## [2026-07-29] Sean's fix complete | PR #53 open

Sean added `--include='/css/***'` and `--include='/js/***'` to the rsync allow-list in `.github/workflows/deploy.yml` (BUNDLED job, unchanged otherwise), and updated `docs/patterns/github-pages-deploy.md` to describe the current allow-list mechanism accurately, noting the two project-specific includes. Branch `fix/deploy-include-css-js`, PR: https://github.com/timdixon82/Periodic-Table/pull/53. UNBUNDLED JOB section and no files outside the repo were touched. Did not merge. Dispatching Carol to verify the CI build artefact and check for unintended files before this goes to Tim.
- [2026-07-29 18:35:18] subagent completed
- [2026-07-29 18:35:40] subagent completed

## [2026-07-29] Carol's verification | PASS, ready for Tim

Carol confirmed: the rsync include list on the PR branch adds `/css/***` and `/js/***` without touching any existing line or the UNBUNDLED JOB section; the four expected files (`css/styles.css`, `js/elements-data.js`, `js/periodic-table.js`, `js/pt-logic.js`) would be published and nothing new outside the allow-list would be; all PR #53 CI checks are green (accessibility, CI build, lint, Playwright, security scans) and it is mergeable; the pattern doc matches the code exactly. Overall verdict: pass, no rework needed.

Carol separately flagged a pre-existing, unrelated issue: the inherited `/scripts/***` include (present on main before this PR) publishes this project's five internal tooling shell scripts to the public site. Not introduced by this fix and out of this brief's scope. Logged as a low-priority follow-up task for Jacob via the task substrate, not blocking this merge.

Taking PR #53 to Tim for merge approval next.

## [2026-07-29] Merged | Tim approved

Tim approved. Merged PR #53 to main (squash, branch deleted). Local clone fast-forwarded. GitHub Pages deploy workflow triggered automatically (run 30476252544). Dispatching Carol to confirm the live site once that deploy completes — the final open item in the Definition of Done.

## [2026-07-29] Closed | Live site confirmed fixed

Deploy run 30476252544 completed successfully. Carol confirmed against the live site: `css/styles.css` returns HTTP 200 with real CSS content (was 404), all three JavaScript files return HTTP 200, the page renders fully styled, and all 118 elements populate in the interactive grid with search and category filters working. No console errors related to this fix. All Definition of Done items complete. Status set to `done`.

Two unrelated low-priority follow-ups were logged separately via the task substrate during this work, not blocking: the pre-existing `/scripts/***` over-publish (owner: Jacob) and a site-root `favicon.ico` 404 (owner: Sean).
- [2026-07-29 18:39:35] subagent completed
- [2026-07-29 18:39:46] subagent completed
