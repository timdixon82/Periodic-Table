# Handoff — 2026-07-29

## Tim-facing tasks

No Tim-facing tasks open.

## What happened this session

Tim reported the live site at https://projects.timdixon.net/Periodic-Table/ appeared to have resource files in the wrong place. Confirmed by fetching `css/styles.css` from the live site: HTTP 404.

Traced the root cause: `.github/workflows/deploy.yml` had been overwritten by the last three template syncs (v1.9.3 through v1.9.6) with the team's generic file allow-list, which only publishes folders named `styles/` and `scripts/`. This project's real runtime folders are `css/` and `js/`, so both were silently dropped from every deploy since the sync, leaving the live page unstyled with no interactivity.

Classified as a bug fix (triage type 6) and ran the standard chain:

- Opened work folder `005-deploy-path-fix`.
- Dispatched Sean, who added `--include='/css/***'` and `--include='/js/***'` to the rsync allow-list in `.github/workflows/deploy.yml` and corrected the project's own deployment pattern doc (`docs/patterns/github-pages-deploy.md`), which had also drifted out of date. Opened PR #53 on branch `fix/deploy-include-css-js`.
- Dispatched Carol, who verified the include list, reasoned through what the assembled deploy artefact would contain, confirmed all CI checks green, and confirmed the pattern doc matched the code. Verdict: pass.
- Tim approved the merge. Squash-merged PR #53, branch deleted, local clone fast-forwarded.
- Dispatched Carol again to confirm the live site after the automatic redeploy (run 30476252544, completed successfully). Confirmed: stylesheet and all three JavaScript files now return HTTP 200, the page renders fully styled, and all 118 elements populate correctly with search and category filters working.
- Closed work folder `005-deploy-path-fix` as `done`.

This fix was project-local only; no change was made to the AgentTeam master template, since the workflow file already documents the correct extension point for a project with non-default folder names.

Two small, unrelated issues were logged as low-priority follow-up tasks via the task substrate rather than holding up this fix:

- A pre-existing (not introduced by this PR) `/scripts/***` include in `deploy.yml` publishes this project's five internal tooling shell scripts to the public site. Owner: Jacob.
- The site root's `favicon.ico` returns a 404 at `https://projects.timdixon.net/favicon.ico`. Owner: Sean.

## State of work folders

- `005-deploy-path-fix`: done.

No work folder is currently active. The three-folder cap is not a constraint for the next session.

## What's next

Nothing queued. The two low-priority follow-up tasks above are sitting in the task substrate for whenever Tim wants them picked up; neither is urgent.

## Carry-forward notes

None.
