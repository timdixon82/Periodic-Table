# Decision Record 004: Dependency posture

## Status

Accepted. Decided by Jacob (architect) on 2026-05-21, during work 001-periodic-table-setup. Reviewed by Sonja.

## Context

The team's static front-end stack standard sets two dependency rules:

- Keep dependencies few. Every dependency is something to keep updated and secure.
- Load a third-party script only when genuinely needed, and pin it with Subresource Integrity.

This record records what Periodic-Table depends on today, and the standard the project follows for any future dependency.

## Decision

### Current dependency inventory

Periodic-Table uses no third-party JavaScript libraries. All behaviour is the project's own code. This is the right posture and the project should keep it: the page is small enough that a framework or a utility library would add risk and maintenance for no real gain.

The project has one external dependency: web fonts loaded from Google Fonts. In `index.html` the `<head>` contains a `<link rel="preconnect">` to `https://fonts.googleapis.com` and a `<link rel="stylesheet">` to a Google Fonts stylesheet that pulls in three font families (Rajdhani, Share Tech Mono, and Nunito Sans). The fonts themselves are then served from `https://fonts.gstatic.com`.

A Google Fonts `<link>` cannot be pinned with Subresource Integrity. Subresource Integrity needs a fixed file with a known hash, and the Google Fonts stylesheet is generated per request and can change. So the standard rule, pin third-party resources with Subresource Integrity, cannot be applied to the fonts in their current form.

### Recommendation: self-host the fonts

The project should self-host the three font families instead of loading them from Google. The font files are downloaded once, committed to the repository under an `assets/fonts/` folder, and referenced from `css/styles.css` with `@font-face` rules. This is the recommendation of this record, to be carried out by Sean.

Self-hosting has clear benefits:

- It removes the external request and the runtime dependency on a third-party origin. The page no longer needs Google's service to be reachable to render correctly.
- It lets the Content-Security-Policy in Decision Record 003 tighten. With fonts self-hosted, `style-src` and `font-src` reduce to `'self'`, and the policy no longer needs to allow the two Google Fonts origins.
- It removes a privacy concern. A request to Google Fonts shares the visitor's internet address with a third party. Self-hosting keeps every request on the project's own origin.
- The font files become fixed assets in the repository, so their integrity is assured by being version-controlled and served from the project's own origin.

The font licences must be checked before the files are committed. The three families are published on Google Fonts under the SIL Open Font License, which permits self-hosting and redistribution; Sean confirms each licence and includes the licence files in `assets/fonts/`.

If, for any reason, the team decides to keep loading fonts from Google rather than self-host, that becomes a documented dependency: it is recorded as a third-party dependency in this record, and the residual privacy point is recorded as a security exception for Gerrie to assess. Self-hosting is the preferred path because it removes the question entirely.

### Standard for any future dependency

If the project ever adds a third-party script or stylesheet, it follows these rules:

- Add it only when the need is genuine and the project's own code cannot reasonably do the job.
- Prefer a self-hosted copy, committed to the repository and served from the project's own origin, over a copy loaded from a third-party content delivery network.
- If a resource is loaded from a third-party origin, pin it with Subresource Integrity: a `<script>` or `<link>` tag with an `integrity` attribute holding the resource's hash, and a `crossorigin` attribute. Pin a specific version, never a "latest" or floating reference, so the hash stays valid.
- Record every third-party dependency in this decision record so the project keeps an inventory, as the OWASP guidance on vulnerable and outdated components requires.

Dependabot, the team's dependency tool from the global Decision Record 001, watches package manifests. This project has no package manifest, so Dependabot has nothing to track here. Keeping the dependency inventory in this record is therefore the project's substitute for an automated dependency list.

## Alternatives considered

### Keep loading fonts from Google Fonts and accept that they cannot be pinned

Rejected as the default. It leaves a runtime dependency on a third-party origin, a third-party request that cannot be integrity-checked, and a privacy point. Self-hosting removes all three at a one-time cost.

### Drop the custom fonts and use system fonts only

Considered. Using the browser's default fonts would remove the dependency completely and is the simplest option. It is not chosen because the three families are part of the page's designed appearance, and Simon, the designer, should decide whether the visual design depends on them. Self-hosting keeps the design intent while removing the dependency risk, so it is the recommended path. If Simon judges system fonts acceptable, that is an even simpler outcome.

## Consequences

- Sean self-hosts the three font families: download the files, confirm each licence, commit the files and their licences under `assets/fonts/`, and reference them from `css/styles.css` with `@font-face`. The `<link>` tags to `fonts.googleapis.com` are then removed from `index.html`.
- Once the fonts are self-hosted, the Content-Security-Policy in Decision Record 003 tightens: `style-src` and `font-src` become `'self'`, and the Google Fonts origins are removed.
- The project keeps zero third-party JavaScript libraries. Any future dependency follows the standard above and is added to this record's inventory.
- If the team chooses to keep Google Fonts instead, the residual privacy point is recorded as a security exception for Gerrie. This is the less preferred path.
