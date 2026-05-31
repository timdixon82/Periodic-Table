# Release process: Periodic Table

This document records the release process for the Periodic Table project.

## Branching model

`main` is the production branch. Feature work happens on short-lived branches named by type and scope, for example `feat/search-improvements` or `fix/keyboard-nav`. No long-lived development branches.

## Pull-request flow

1. Open a pull request from a feature branch to `main`.
2. Continuous integration checks pass: HTML linting (html-validate), CSS linting (Stylelint), JavaScript linting (ESLint), accessibility (Pa11y and axe-core at WCAG 2.2 AAA), CodeQL analysis, and security (Semgrep and Trivy).
3. Carol signs off functional, accessibility, and visual testing.
4. Sonja reviews for architecture and security conformance.
5. Tim gives express approval to merge.
6. Sonja merges.

## Merge gate

- All required CI checks pass (lint, accessibility, CodeQL, security).
- Carol has signed off.
- The architecture-and-security conformance check has passed.
- Tim has given express approval.

## Release steps

Merging to `main` triggers two workflows:

1. **release.yml** runs release-please, which inspects conventional commit messages, bumps VERSION, updates CHANGELOG.md, and opens a release pull request. When that pull request is merged, release-please creates a GitHub release and tag.

2. **deploy.yml** runs on every push to `main`. It assembles the site using rsync (excluding dev tooling, docs wiki, and config files), uploads the artefact, and deploys to GitHub Pages. Deployment completes within a few minutes of the merge. The live site is at [projects.timdixon.net/Periodic-Table/](https://projects.timdixon.net/Periodic-Table/).
