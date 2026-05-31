# Pattern: GitHub Pages deploy (unbundled static site)

## Status

Active. In use on this project since the initial deploy workflow was added.

## Problem

This project has no build step. Runtime files live in the repository root alongside dev tooling, CI config, docs wiki, and config files that must not be served. GitHub Pages needs a clean artefact containing only what the browser should receive.

## Solution

Use the unbundled rsync pattern: an "Assemble site" step copies runtime files into a `_site` directory, excluding everything that is not for the browser. GitHub Actions then uploads and deploys `_site`.

## The exclude list for this project

```
--exclude='_site'
--exclude='node_modules'
--exclude='.github'
--exclude='.claude'
--exclude='docs'
--exclude='package.json'
--exclude='package-lock.json'
--exclude='release-please-config.json'
--exclude='.release-please-manifest.json'
--exclude='eslint.config.js'
--exclude='CHANGELOG.md'
--exclude='README.md'
--exclude='VERSION'
--exclude='pa11y.json'
--exclude='.gitignore'
--exclude='.editorconfig'
--exclude='CLAUDE.md'
```

What remains after exclusion and is served to the browser: `index.html`, `assets/`, `css/`, `js/`.

## Activation (one-time, per repository)

GitHub Settings, then Pages, then Build and deployment, then Source, then select "GitHub Actions" (not "Deploy from a branch"). This setting is not managed by any workflow file; it must be set once in the repository settings.

## Key workflow notes

- Action SHAs must be full 40-character commit SHAs. GitHub no longer resolves shortened SHAs and the deploy fails silently.
- The concurrency group `pages` with `cancel-in-progress: true` ensures only one deploy runs at a time and a new push cancels an in-progress one.
- The deploy job requires `pages: write` and `id-token: write` permissions on the workflow, and `contents: read`.

## Reference

The workflow file is `.github/workflows/deploy.yml`. The global wiki pattern at `docs/patterns/github-pages-deploy.md` (AgentTeam) documents the same approach and names this project as the reference implementation.
