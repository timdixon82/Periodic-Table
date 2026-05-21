# Project Coding Standards: Periodic-Table

This project follows the team's stack-independent standards in the global wiki's `coding-standards.md`, and the per-stack standards in the global wiki's `stacks/static-front-end.md`.

This page records only what is specific to Periodic-Table: its stack, and any project-specific coding decisions.

## Stack

A static front-end: HTML, CSS, and JavaScript that runs entirely in the browser, with no server and no build step. The project is hosted on GitHub Pages and served from the `main` branch.

## Project-specific notes

These notes follow from the architecture decisions in `decisions/`. Read those records for the full reasoning.

### File layout

The project is split so that structure, presentation, and behaviour live in separate files, as Decision Record 001 sets out:

- `index.html`: the page structure only.
- `css/styles.css`: all presentation.
- `js/periodic-table.js`: all behaviour.
- `js/elements-data.js`: the element data set.

File and folder names use kebab-case, in line with the team's naming standard.

### No build step

The project has no build step, as Decision Record 002 sets out. The files are served to the browser exactly as they are written. Continuous integration still lints the HTML, CSS, and JavaScript and runs the accessibility checks; linting and testing are not a build step.

### Security headers

GitHub Pages cannot set arbitrary HyperText Transfer Protocol response headers. Decision Record 003 sets out how each required header is handled. The Content-Security-Policy and the Referrer-Policy are delivered through `<meta>` tags in `index.html`. The Content-Security-Policy must never allow inline script, so the behaviour stays in its own files. Two headers cannot be delivered, X-Frame-Options and Permissions-Policy; both are recorded as low-risk security exceptions in `exceptions/`.

### Dependencies

The project uses no third-party JavaScript libraries, and should keep it that way. Web fonts are self-hosted rather than loaded from Google Fonts, as Decision Record 004 sets out. Any future third-party resource is added only when genuinely needed, is preferably self-hosted, and, if loaded from a third-party origin, is pinned with Subresource Integrity at a fixed version. Every third-party dependency is recorded in Decision Record 004.
