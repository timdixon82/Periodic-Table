# Architecture-and-Security Conformance Check: Periodic-Table Phase 1

Checked by: Sonja (orchestrator)
Date: 2026-05-21
Work folder: 001-periodic-table-setup
Branch: chore/project-setup, pull request 1

## Purpose

This is the architecture-and-security conformance check, the separate gate confirmed in Tim's decision 4A. It checks that Phase 1's implementation conforms to the project wiki's four Architecture Decision Records and to the security standards from Gerrie's governance review and Jed's code review, before the merge gate.

## Architecture conformance

### ADR 001, static front-end architecture (file split)

Decision: split the single `index.html` into `index.html`, `css/styles.css`, `js/periodic-table.js`, and `js/elements-data.js`. Phase 1: the repository now has `css/`, `js/`, and `assets/` folders and a structure-only `index.html`. Carol's Phase 1 verification confirmed the split is functionally correct with no behaviour change. Conforms.

### ADR 002, no build step

Decision: no build step; files served as written; linting is not a build step. Phase 1: `package.json`, `package-lock.json`, and `eslint.config.js` are present for linting only; there is no bundler. Conforms.

### ADR 003, GitHub Pages hosting and security headers

Decision: Content-Security-Policy and Referrer-Policy delivered by meta tag; X-Frame-Options and Permissions-Policy recorded as exceptions. Phase 1: Carol verified the security meta tags are correctly placed and scoped. `docs/exceptions/001-security-headers.md` records the two header exceptions, both approved by Tim on 2026-05-21. Because the script moved to its own file under ADR 001, the Content-Security-Policy uses `script-src 'self'` and does not need `'unsafe-inline'` for scripts. Conforms.

### ADR 004, dependency posture

Decision: self-host the font families under `assets/`; zero third-party JavaScript libraries. Phase 1: the fonts are self-hosted, and Carol verified they are complete and consistent with the Content-Security-Policy. No third-party JavaScript library is present. Conforms.

## Security conformance

### Jed's code review

The three medium findings are all resolved in Phase 1: innerHTML replaced with DOM construction (Finding 1); Google Fonts self-hosted, removing the un-pinnable third-party resource (Finding 2); a Content-Security-Policy meta tag added (Finding 3). The two low findings are resolved: the integer guard in `selectElement` (Finding 4) and the maintenance comment in `announce` (Finding 5). The Referrer-Policy meta tag (Finding 6) is added. Carol's Phase 1 verification confirmed the code-review fixes are correctly implemented. Conforms.

### Gerrie's security governance review

Gerrie's open question Q1, the Google Fonts UK GDPR transfer, is resolved by self-hosting the fonts, so no visitor data is disclosed to a third party. Q2, the Content-Security-Policy direction, is resolved: the file split allows a policy without `'unsafe-inline'` for scripts. The residual GitHub Pages header gaps are documented and Tim-approved in the exceptions file. Conforms.

### Continuous integration and security checks

On pull request 1, lint, Semgrep, Trivy, CodeQL, and dependency-review all pass.

## Accessibility note

Accessibility is outside this architecture-and-security check. Phase 1 ships with about 21 known accessibility findings, documented and scheduled for Phase 2 under Tim's decision 1A. The accessibility continuous-integration check is red; Carol has separately verified the real accessibility state by running the tools locally and confirmed Phase 1 introduced no regression.

## Verdict

Pass. Phase 1 conforms to all four Architecture Decision Records and to the security standards from Gerrie's and Jed's reviews. No architecture or security non-conformance was found, and nothing requires escalation to Jacob, Gerrie, or Jed. The architecture-and-security conformance check is satisfied for the Phase 1 merge gate.
