# Brief: 006-scripts-favicon-fix

## Summary

Closes the two low-priority follow-ups Carol flagged while verifying `005-deploy-path-fix`: (1) the live GitHub Pages deploy publishes this project's internal tooling `scripts/` folder to the public site, which it should not; (2) `https://projects.timdixon.net/favicon.ico` 404s because no favicon has ever been added to this project.

Preamble fields:

- Status: `done`
- Branch: `main` (merged)
- Mockup mode: D (no redesign; a small brand-consistent icon asset, not a UI change)
- Priority: 3
- Blockers: None

## Requirements

1. Stop publishing `scripts/` (five internal shell tooling scripts: `clean-stale-branches.sh`, `next-q.sh`, `record-backport.sh`, `sync-from-template.sh`, `tasks.sh`) to the public site. None of these scripts contain secrets, but they are internal tooling with no purpose on a public page and should not be served.
2. Add a favicon so the browser tab has an icon and `favicon.ico` (or an equivalent referenced icon) stops 404-ing. Use the site's existing colour palette (`--bg: #0b0f1a`, `--accent: #7dd9ff`, defined in `css/styles.css`) so the icon matches the brand rather than introducing a new one.

## Routing plan

Sean makes both fixes on one branch, then Carol tests (confirms the artefact no longer contains `scripts/`, and confirms the favicon loads and displays in a browser tab), then Sonja reviews and takes it to Tim for merge approval.

## Out of scope

- No change to the `css/` and `js/` includes restored in work folder `005-deploy-path-fix`.
- No broader icon set (apple-touch-icon, manifest icons, multiple sizes) unless Sean judges a single favicon insufficient for correctness; if so, flag back to Sonja rather than expanding scope unilaterally.
- No change to the AgentTeam master template; this remains project-local, same as `005-deploy-path-fix`.

## Risk and rollback

Risk: removing the `/scripts/***` include could, in principle, break something if any runtime code unexpectedly depended on a file under `scripts/` being fetchable by the browser (unlikely; `scripts/` holds only local dev-tooling shell scripts, not anything referenced from `index.html`, `css/`, or `js/`) — Sean confirms no such reference exists before removing the include.

Rollback: revert the single commit on the fix branch; the previous (over-publishing but harmless) workflow and missing favicon return until the next push to main.

## Definition of done

- [x] `.github/workflows/deploy.yml` no longer includes `/scripts/***` in the rsync allow-list for the deploy artefact.
- [x] Confirmed no file under `index.html`, `css/`, or `js/` references anything under `scripts/` (so removing the include breaks nothing).
- [x] A favicon exists in the repo (for example `assets/favicon.svg` or `.ico`), is referenced from `index.html` with an appropriate `<link rel="icon">` tag, and uses the site's existing colour palette.
- [x] Carol confirms the assembled deploy artefact no longer contains `scripts/` and does contain the new favicon asset.
- [x] Carol confirms the favicon renders in a browser tab against the branch build or, after merge, against the live site.
- [x] The Content-Security-Policy meta tag in `index.html` still permits the favicon to load under `img-src 'self'` (no CSP change needed if the icon is served from this origin).

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
