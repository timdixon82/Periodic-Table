# Pattern: GitHub Pages deploy (unbundled static site)

## Status

Active. In use on this project since the initial deploy workflow was added.

## Problem

This project has no build step. Runtime files live in the repository root alongside dev tooling, CI config, docs wiki, and config files that must not be served. GitHub Pages needs a clean artefact containing only what the browser should receive.

## Solution

Use the rsync ALLOW-list pattern: an "Assemble the deploy artifact" step copies only explicitly listed runtime paths into a `_site` directory. Everything else is excluded by a trailing `--exclude='*'`. This is a fail-safe allow-list, not a deny-list: a file nobody thought to list is not published by default, so `node_modules`, `.github`, `.claude`, `docs`, and every config file stay out of the public site automatically, without needing a name on an exclude list. GitHub Actions then uploads and deploys `_site`.

Every include line (other than the `*/` descend-only pattern) carries a leading `/` to anchor it to the repository root. An include that contains a `/` but has no leading `/` is not anchored and matches at any depth, which can silently pull in nested paths such as `node_modules/some-package/scripts/*`.

## The include list for this project

The template default covers `index.html`, `styles/`, `scripts/`, `data/`, and `assets/`. This project does not use `styles/` or `scripts/` as folder names; it uses `css/` and `js/`. `/css/***` and `/js/***` are this project's two includes added beyond the template default, restoring the folders this project actually serves.

```
--include='/index.html'
--include='/styles/***'
--include='/scripts/***'
--include='/data/***'
--include='/assets/***'
--include='/css/***'
--include='/js/***'
--include='*/'
--exclude='*'
```

What is served to the browser: `index.html`, `assets/` (if present), `css/`, `js/`. The `styles/`, `scripts/`, and `data/` includes are inherited from the template default and currently match nothing in this project, since it has no folders by those names.

## Activation (one-time, per repository)

GitHub Settings, then Pages, then Build and deployment, then Source, then select "GitHub Actions" (not "Deploy from a branch"). This setting is not managed by any workflow file; it must be set once in the repository settings.

## Key workflow notes

- Action SHAs must be full 40-character commit SHAs. GitHub no longer resolves shortened SHAs and the deploy fails silently.
- The concurrency group `pages` with `cancel-in-progress: true` ensures only one deploy runs at a time and a new push cancels an in-progress one.
- The deploy job requires `pages: write` and `id-token: write` permissions on the workflow, and `contents: read`.

## Reference

The workflow file is `.github/workflows/deploy.yml`. The global wiki pattern at `docs/patterns/github-pages-deploy.md` (AgentTeam) documents the same approach and names this project as the reference implementation.
