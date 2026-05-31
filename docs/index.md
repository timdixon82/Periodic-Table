# Project Wiki: Periodic-Table

This is the project wiki for Periodic-Table. It holds knowledge specific to this project. Knowledge shared across every project lives in the global wiki at the team root.

Periodic-Table is a static, accessible, interactive periodic table of the chemical elements, built with HTML, CSS, and JavaScript and hosted on GitHub Pages.

Cross-cutting learnings flow to both this wiki and the global wiki at the time they are learned.

## Standards

- `coding-standards.md`: this project's stack and its project-specific coding notes.
- `accessibility.md`: this project's accessibility notes.

## Requirements

- `requirements.md`: the project's purpose, scope, functional requirements, and acceptance criteria. Written by Tad as part of work 001-periodic-table-setup.

## Reviews

- `security-review.md`: the security governance review, mapping the OWASP Top 10 and assessing UK GDPR.
- `code-review.md`: the hands-on code review and penetration-test findings.

## Decisions

Architecture Decision Records are in `decisions/`:

- `decisions/001-static-front-end-architecture.md`: split the single-file page into separate HTML, CSS, and JavaScript files.
- `decisions/002-no-build-step.md`: keep no build step.
- `decisions/003-github-pages-hosting-and-security-headers.md`: stay on GitHub Pages and deliver security headers through meta tags.
- `decisions/004-dependency-posture.md`: use no third-party JavaScript, and self-host the web fonts.
- `decisions/005-release-automation-configuration.md`: configure release-please in manifest mode with the `simple` release type.

## Patterns

- `patterns/github-pages-deploy.md`: unbundled rsync deploy to GitHub Pages — the approach used by this project, including the full exclude list and activation notes.

## Privacy

- `privacy.md`: analytics posture (GoatCounter self-hosted), data collection statement, third-party services, and UK GDPR obligations.

## Release process

- `release-process.md`: branching model, pull-request flow, merge gate, and release steps (release-please and GitHub Pages deploy).

## Glossary

- `glossary.md`: this project's domain terms.

## Exceptions

- `exceptions/`: this project's documented accessibility and security exceptions.

## Operations

- `log.md`: this project's chronological, append-only operations log.
