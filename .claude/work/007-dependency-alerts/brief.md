# Brief: 007-dependency-alerts

Status: active

## Summary

Clear the 14 open Dependabot alerts in the root `package-lock.json` (8 high, 4 medium, 2 low, all development scope) for brace-expansion, fast-uri, js-yaml and minimatch. Approved by Tim (Q323C).

Method:
- fast-uri (3.1.4 to 3.1.9), js-yaml (4.3.0 to 4.3.2) and brace-expansion (5.0.8 to 5.0.12) are fixed by a targeted `npm update` within existing ranges. No `package.json` range changes.
- minimatch needs 11.0.1 or later, but eslint and `@eslint/config-array` (including the latest eslint 10.14.0) depend on `^10`. There is no upstream path, so a documented override `"minimatch": "^11.0.1"` is added, next to the existing js-yaml override. Locked at 11.0.4.

## Out of scope

Feature changes, other work folders, workflows, the accessibility tools lock files, and open Dependabot pull requests (none open for these packages).

## Risk and rollback

Risk is low: all four packages are development-only and are not shipped to the browser. The minimatch major bump (10 to 11) is the main risk; eslint's use of it is covered by lint and tests passing. Rollback: revert the pull request, or remove the minimatch override and re-run `npm install`. Remove the override once eslint depends on minimatch 11 or later.

## Definition of done

- `npm ci`, `npm run lint` and `npm test` pass.
- `npm audit` reports 0 vulnerabilities.
- One pull request against main, not merged by Sean.
