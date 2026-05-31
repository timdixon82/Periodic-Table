# Architecture-and-Security Conformance Check: Periodic-Table Phase 2

Checked by: Sonja (orchestrator)
Date: 2026-05-21
Work folder: 003-periodic-table-accessibility
Branch: feat/accessibility-phase-2, pull request 3, branch head 6fa135b

## Purpose

The architecture-and-security conformance check for Phase 2, the gate confirmed in decision 4A, before the merge gate. It checks that Phase 2 conforms to the project's four Architecture Decision Records and to the team's security standards.

## Architecture conformance

Phase 2 is an accessibility remediation: changes to CSS, JavaScript, and ARIA markup within the structure Phase 1 established. It introduces no architectural change.

- **ADR 001, file split.** Phase 2 edits `index.html`, `css/styles.css`, `js/periodic-table.js`, and `js/elements-data.js` in place. The separated file structure is kept. Conforms.
- **ADR 002, no build step.** Phase 2 adds no build step. The accessibility workflow gained a `browser-driver-manager` install step and a `pa11y.json`; these are continuous-integration tooling, not a project build step. Conforms.
- **ADR 003, GitHub Pages security headers.** The meta-tag Content-Security-Policy is unchanged. Carol's re-test confirmed the legend markers use CSS classes, not inline styles, so the policy stays at `script-src 'self'` and `style-src 'self'`. Two new exception records were added, `002-grid-reflow.md` and `003-identify-purpose.md`; these are accessibility exceptions, recorded correctly in `docs/exceptions/`, and are separate from the Phase 1 security-header exceptions. Conforms.
- **ADR 004, dependency posture.** Phase 2 adds no third-party JavaScript library. The fonts remain self-hosted. Conforms.

## Security conformance

Phase 2 changes no security-relevant behaviour. Carol's re-test confirmed the security-sound patterns from Phase 1 are preserved: `announce()` uses `textContent`, not `innerHTML`; `selectElement()` still guards its input with `parseInt` and `Number.isFinite`; `renderInfo()` builds the DOM with `createElement` and `textContent`. No new network request, input, or third-party resource is introduced. On pull request 3, lint, Semgrep, Trivy, CodeQL, and dependency-review all pass.

## Verdict

Pass. Phase 2 conforms to all four Architecture Decision Records and to the team's security standards. No architecture or security non-conformance was found, and nothing requires escalation. The architecture-and-security conformance check is satisfied for the Phase 2 merge gate.

The remaining merge-gate items are governance, not conformance: Tim's sign-off on the two accessibility exception records, and Tim's screen-reader test.

## Re-confirmation, 2026-05-22, branch head 7794554

The original check was at branch head `6fa135b`. Five commits followed: `2a12055` (recording Tim's exception sign-off, a docs change) and `e5b60c2`, `3418e45`, `8ef5640`, `7794554`, four keyboard-navigation fixes confined to `js/periodic-table.js`.

These commits change keyboard-navigation behaviour only: a roving tab-index and arrow-key skip for filtered elements, ArrowUp and ArrowDown from the series jump buttons, `aria-hidden` toggling on filtered-out buttons, and `jumpToRow` using `findNearest` so it never focuses a hidden button. They add no dependency, no build step, no network request, no inline style, and no new input. They do not touch the file split, the no-build-step decision, the Content-Security-Policy, or the dependency posture. All four Architecture Decision Records still hold. The security-sound DOM patterns are unchanged; `setAttribute` and `removeAttribute` for `aria-hidden` are safe APIs. On pull request 3, all seven checks pass on `7794554`, including CodeQL, Semgrep, Trivy, and dependency-review.

Re-confirmation verdict: Pass. The keyboard-navigation fixes are not architecture-sensitive or security-sensitive. The architecture-and-security conformance check remains satisfied for the Phase 2 merge gate at branch head `7794554`.
