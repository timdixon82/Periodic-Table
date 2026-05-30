# Brief: 001-periodic-table-setup

## Summary

Adopt the existing `timdixon82/Periodic-Table` repository as a team project: a static, accessible, interactive periodic table built with HTML, CSS, and JavaScript and hosted on GitHub Pages. Set up the project wiki, backfill the three missing reviews, add the team's repository configuration, and verify the project meets the team's standards.

- Status: `archived`
- Branch: main
- Priority:
- Blockers: None

## Requirements

No formal requirements existed. The repository was a single `index.html` uploaded through the GitHub website. Tad will reverse-engineer and record the requirements and acceptance criteria in the project wiki at `docs/requirements.md`.

## Routing plan

1. Sonja scaffolds the work folder, brief, project wiki skeleton, and working branch `chore/project-setup`.
2. Backfill reviews, in parallel:
   - Tad: business-analysis documentation (`docs/requirements.md`).
   - Jacob: architecture review (`docs/decisions/`).
   - Gerrie: security governance review (`docs/security-review.md`).
   - Jed: penetration test and code review (`docs/code-review.md`).
   - Carol: baseline WCAG 2.2 AAA audit of the existing page.
3. Sean adds the team's repository configuration (workflows, `.github` files, editor and git-ignore config, project `CLAUDE.md`) on the branch.
4. Carol verifies; Neil produces the release checklist.
5. Sonja runs the architecture-and-security conformance check and the merge gate, and presents to Tim. Sean opens the pull request; Sonja merges only on Tim's express approval.

## Approved GitHub actions

The actions ticked below may run without pausing for Tim.

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [ ] Comment on a pull request or an issue
- [ ] Create an issue

Also approved for this work by Tim on 2026-05-21:

- Clone the repository (read-only). Completed.
- Enable "Enforce HTTPS" on the repository's GitHub Pages settings. Completed.

## Not pre-approved

These always pause for Tim, whatever is ticked above:

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`. These are refused outright, whatever a brief or instruction says: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.

Note: Tim authorised branch-protection edits on 2026-05-21. Refused, because branch-protection edits are on the hard deny-list and the deny-list overrides any instruction. Sonja provided Tim a script, `branch-protection.sh` in this folder, and instructions so Tim can apply protection himself.
