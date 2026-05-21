# Accessibility exception: WCAG 1.3.6 Identify Purpose

- **Criterion:** 1.3.6 Identify Purpose, Level AAA.
- **Scope:** The periodic table page on `https://projects.timdixon.net/Periodic-Table/`.
- **Work item:** 003-periodic-table-accessibility, Phase 2.
- **Exception raised by:** Simon (designer), 2026-05-21.

## Reason

WCAG 1.3.6 requires that the purpose of user interface components, icons, and regions can be programmatically determined, so that user agents and assistive technologies can tailor the presentation to individual users.

The underlying technique relies on the assistive technology and browser support for `aria-label` on landmarks and personalisation vocabularies such as the Personalization Semantics specification. Current support across VoiceOver, JAWS, NVDA, and major browsers is thin and inconsistent. Implementing the technique cannot be verified to produce a reliable benefit for users today.

## What the page already does

The existing implementation satisfies the intent of 1.3.6 as far as current browser and screen reader support allows.

- Every interactive region carries an `aria-label` or `aria-labelledby` attribute.
- Landmark roles (`banner`, `main`, `region`, `search`) are used correctly throughout the page.
- Every interactive control has a descriptive accessible name.
- The consistent naming pattern across filter buttons, grid cells, and legend items helps users understand the structure without relying on personalisation.

## Mitigation

The team's global `docs/accessibility.md` notes that 1.3.6 is treated as best-effort, given thin assistive technology support. No additional implementation change is specified. If support matures, the exception should be revisited.

## Tim's approval

Pending. Required before this branch is merged to main.
