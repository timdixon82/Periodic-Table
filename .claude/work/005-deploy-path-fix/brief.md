# Brief: 005-deploy-path-fix

## Summary

The live site at https://projects.timdixon.net/Periodic-Table/ is missing its CSS and JavaScript. A recent template sync (v1.9.3 through v1.9.6) replaced this project's deploy workflow with the generic BUNDLED-job allow-list, which only copies `styles/`, `scripts/`, `data/`, and `assets/` into the published site. This project's real folders are named `css/` and `js/` (confirmed against `index.html` and the project's own pattern doc, `docs/patterns/github-pages-deploy.md`), so those folders are silently dropped and the deployed page loads unstyled with no interactivity.

Preamble fields:

- Status: `done`
- Branch: `main` (merged)
- Mockup mode: D (bug fix, no visual redesign)
- Priority: 1
- Blockers: None

## Requirements

No new requirements; this restores existing, previously-working behaviour. Reference: this project's `docs/patterns/github-pages-deploy.md`, which already documents `css/` and `js/` as runtime folders that must be served.

## Routing plan

Sean fixes `.github/workflows/deploy.yml` to include this project's actual runtime folders, then Carol verifies the deployed build output contains the right files and the live site renders correctly, then Sonja reviews and takes it to Tim for merge approval.

## Out of scope

- No change to the team-wide template `deploy.yml` pattern in AgentTeam. This fix is project-local, using the documented extension point ("add one explicit --include line" for a project-specific runtime path) rather than a change to the master template.
- No redesign or content change to the periodic table page itself.
- No change to the project's build tooling (npm scripts, package.json).

## Risk and rollback

Risk: an incorrect include pattern could either still omit needed files or accidentally publish files that should stay private (for example node_modules or docs).

Rollback: revert the single commit to `deploy.yml` on the fix branch; the previous (broken but harmless) workflow redeploys automatically on the next push to main.

## Definition of done

- [x] `.github/workflows/deploy.yml` includes `/css/***` and `/js/***` (matching this project's actual folder names) in the rsync allow-list, alongside the existing `/index.html`, `/assets/***` includes.
- [x] A test deploy (or Carol's inspection of the assembled `_site` output in CI) confirms `css/styles.css`, `js/periodic-table.js`, `js/elements-data.js`, and `js/pt-logic.js` are present in the published artefact.
- [x] The live site loads with styling and full interactivity once merged and deployed (Carol re-checks after merge).
- [x] `docs/patterns/github-pages-deploy.md` is confirmed still accurate, or updated if its description of the workflow has drifted further from the current file.
- [x] No unintended files (node_modules, docs, .claude, config files) appear in the published artefact.

## Approved GitHub actions

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [x] Comment on a pull request or an issue
- [x] Create an issue

## Not pre-approved

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
