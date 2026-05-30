# Brief: 003-periodic-table-accessibility

## Summary

Phase 2 of the Periodic-Table project: remediate the accessibility findings from Carol's baseline audit so the page meets WCAG 2.2 at AAA. Phase 1 adopted and configured the project; this phase fixes the 21 baseline findings, two of them critical (colour-contrast failures across the category palette, and category conveyed by colour alone).

- Status: archived
- Branch: main
- Priority:
- Blockers: None

## Requirements

The requirements are in the project wiki, `docs/requirements.md`. The findings to remediate are in Carol's baseline audit, `.claude/work/001-periodic-table-setup/carol-baseline-audit.md`.

## Routing plan

1. Simon: design the AAA-conformant remediation, and recommend answers to Carol's five open design questions.
2. Sonja: relay Simon's design and the five questions to Tim; relay his answers back.
3. Sean: implement the remediation on a branch in the Periodic-Table repository.
4. Carol: re-test against WCAG 2.2 AAA for a full accessibility sign-off.
5. Neil: release checklist. Sonja: merge gate, and present to Tim; merge only on his express approval.

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
