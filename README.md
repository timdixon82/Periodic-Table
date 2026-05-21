# Periodic Table of Elements

An interactive periodic table of all 118 known chemical elements. The table is keyboard-navigable, screen-reader accessible, and built to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AAA.

## Live site

The table is published at [projects.timdixon.net/Periodic-Table/](https://projects.timdixon.net/Periodic-Table/).

## Features

- All 118 elements displayed in the standard periodic table layout.
- Per-element detail panel showing atomic number, symbol, atomic mass, category, state, period, group, and a plain-language description.
- Free-text search by name, symbol, or atomic number.
- Ten category toggle filters (Alkali Metals, Alkaline Earth, Transition Metals, Post-Transition, Metalloids, Nonmetals, Halogens, Noble Gases, Lanthanides, Actinides).
- Full keyboard navigation with arrow keys, Home, End, Tab, Enter, and Space.
- Screen-reader support: accessible names on every element cell, live region announcements for element selection and filter changes, and three skip links.
- Colour-coded category legend, supplemented by text labels so colour is never the only way information is conveyed.

## Running it locally

The project has no build step. Serve the repository root with any static file server. The simplest option on most systems is Python 3:

```
python3 -m http.server 8080
```

Then open a browser and go to `http://localhost:8080`.

Alternatively, use the Node.js package `serve`:

```
npx serve .
```

Or the VS Code Live Server extension, or any other static server.

## Accessibility

This project is built to WCAG 2.2 AAA. That is the highest of the three WCAG levels, and it satisfies the accessibility laws in scope: the United Kingdom Equality Act, the Public Sector Bodies Accessibility Regulations, the European Accessibility Act, the Americans with Disabilities Act, and Section 508.

The team tests with VoiceOver on macOS and JAWS on Windows. Every pull request must pass the automated accessibility checks (axe-core and Pa11y at WCAG 2.2 AAA) before it can be merged.

Known accessibility issues that are out of scope for the current phase are tracked in the [project wiki](docs/).

## Project wiki

The full project documentation is in the [docs/ folder](docs/), including architecture decision records, security and code review findings, requirements, and the glossary.

## Security

The project uses a Content Security Policy (CSP) delivered via a meta tag, and a Referrer-Policy meta tag. Two security headers that require an HTTP response header (X-Frame-Options and Permissions-Policy) cannot be delivered on GitHub Pages; these gaps are recorded as accepted exceptions in [docs/exceptions/001-security-headers.md](docs/exceptions/001-security-headers.md).

Web fonts are self-hosted under `assets/fonts/` and served from the same origin as the page, so no external font service is contacted at load time.

## Licence

The project code is the work of Tim Dixon. The three web fonts (Rajdhani, Share Tech Mono, and Nunito Sans) are published under the SIL Open Font License, version 1.1. Licence files for each font are in `assets/fonts/`.
