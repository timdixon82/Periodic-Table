# Decision Record 002: No build step

## Status

Accepted. Decided by Jacob (architect) on 2026-05-21, during work 001-periodic-table-setup. Reviewed by Sonja.

## Context

Periodic-Table is a static front-end project. The team's static front-end stack standard says a small project needs no build step, and a larger one may use a light bundler such as Vite. The project has no build step today: the files are served to the browser exactly as they are written.

This record decides whether the project should adopt a build step, given its size.

## Decision

The project keeps no build step. The files are written in standards-based HTML, modern CSS, and modern JavaScript, and are served to the browser unchanged.

The project is small. After the split in Decision Record 001 it is one HTML file, one CSS file, and two JavaScript files. It has no third-party JavaScript libraries to bundle (see Decision Record 004). Modern browsers run modern JavaScript and modern CSS directly, so there is nothing a build step would need to transform.

A build step would add a dependency, a configuration file, a step that can fail, and a gap between the source a developer reads and the code a browser runs. For a project this size none of that is repaid. The team's general standard is to prefer the simple solution and to add complexity only when a real need arrives.

This decision is not permanent. The trigger to revisit it is a genuine need, for example: the JavaScript grows large enough that splitting it into modules and bundling them would measurably help load time; or a third-party library is adopted that ships only as a package needing a bundler; or the project needs a tool, such as a CSS pre-processor, that only runs at build time. If any of those arrives, a light bundler such as Vite is the expected choice, and a new decision record will record it.

## Alternatives considered

### Adopt a bundler now, such as Vite

Rejected as premature. A bundler earns its place when there are many modules to combine, third-party packages to resolve, or transforms to run. Periodic-Table has none of these. Adopting one now would add setup and a failure point with no return.

### Add a minification-only step

Rejected for now. Minifying the CSS and JavaScript would shave a small amount off the download. The saving is tiny for a project of this size, and the cost is a build step that makes the served code differ from the source. The simpler win, browser caching of separate files, comes for free from Decision Record 001. Minification can be reconsidered if the asset size grows.

## Consequences

- The repository's source is exactly what the browser runs. This makes debugging direct and review straightforward, which suits a project being adopted and audited.
- Continuous integration still lints the HTML, CSS, and JavaScript and runs the accessibility checks, as the stack standard requires. Linting and testing are not a build step; they check the code without transforming it. Sean sets up the lint and accessibility workflows.
- GitHub Pages serves the repository files directly, with no build action in between. This is covered in Decision Record 003.
- If the project later outgrows this decision, the named trigger and the expected choice (a light bundler such as Vite) are recorded above, so the next decision starts from a clear position.
