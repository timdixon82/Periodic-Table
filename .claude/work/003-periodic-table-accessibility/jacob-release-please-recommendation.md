# Jacob: release-please configuration recommendation for Periodic-Table

## Summary

The Periodic-Table `Release` workflow has never been able to run. The
`release.yml` workflow calls `googleapis/release-please-action@v5.0.0`
with only a `token` input. Action v5 runs release-please v17, which
operates in manifest mode and requires two configuration files in the
repository root: `release-please-config.json` and
`.release-please-manifest.json`. Neither file exists, and the workflow
passes no `release-type`. So the very first push to `main` after the
workflow was added failed immediately, as the Phase 2 squash merge
(`6ab5054`) showed today.

This is a missing-configuration gap, not a code defect. The fix is to
add the two manifest files and one line to `release.yml`. It does not
touch any source file and does not conflict with any architecture
decision. This document is a recommendation only; it makes no change to
the Periodic-Table repository. Sean implements it.

The fix is small and self-contained, so it can be done as part of the
Phase 2 work folder (`003-periodic-table-accessibility`) on the same
branch, or as a short follow-up. Sonja decides the routing.

## 1. Recommended release-type: `simple`

The recommended `release-type` is `simple`.

Reasoning:

- `simple` is release-please's strategy for a project that is not tied
  to any one language's package ecosystem. It tracks the version in a
  plain-text `version.txt` file and writes a `CHANGELOG.md`. It runs no
  build, expects no package manifest, and reads no language-specific
  metadata.
- Periodic-Table is a static HTML, CSS, and JavaScript site with no
  build step (Decision Record 002) and no package manifest that
  describes the product. There is a `package.json` only inside
  `node_modules/` for the dev-only lint and test tooling; the project
  itself ships no `package.json` at its root, so the `node`
  release-type does not apply and must not be used. If `node` were
  chosen, release-please would expect to bump a root `package.json`
  `version` field that does not exist.
- The project already tracks its version in a `VERSION` file. `simple`
  is the only built-in strategy whose model is "a project whose version
  is a plain version string in a file", which matches Periodic-Table
  exactly. The one mismatch, that `simple` defaults to a file named
  `version.txt` while the project's file is `VERSION`, is resolved by
  the `extra-files` entry in section 2 below, so `simple` still tracks
  the existing `VERSION` file with no rename.

Alternatives considered and rejected:

- `node`. Rejected: the project has no product `package.json`. The
  presence of `node_modules/` is dev tooling only and does not make
  this a Node package.
- `html`. Release-please has no `html` release-type. There is no
  static-site-specific strategy; `simple` is the generic one.
- Staying with no `release-type` and no manifest. This is the current
  broken state and is not an option.

## 2. The two configuration files

Both files go in the repository root, alongside `VERSION` and
`.github/`.

### `release-please-config.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
  "release-type": "simple",
  "include-component-in-tag": false,
  "include-v-in-tag": true,
  "changelog-path": "CHANGELOG.md",
  "packages": {
    ".": {
      "extra-files": [
        {
          "type": "generic",
          "path": "VERSION"
        }
      ]
    }
  }
}
```

Notes on each field:

- `release-type: simple` sets the strategy for the one package, the
  repository root (`.`).
- `include-component-in-tag: false` keeps the release tag as a plain
  version (`v1.0.0`), not a component-prefixed tag. The project is a
  single deliverable, so it has no component name.
- `include-v-in-tag: true` produces the tag `v1.0.0`. This is the
  release-please default and the common convention. If Tim prefers an
  unprefixed `1.0.0` tag, set this to `false`; see question Q11.
- `changelog-path: CHANGELOG.md` writes the changelog to the repository
  root, which is where a reader expects it.
- The `extra-files` entry is how the existing `VERSION` file is kept in
  sync. The `simple` strategy by default updates a `version.txt` file.
  Periodic-Table's file is named `VERSION`. Rather than rename the file,
  the `generic` updater is pointed at `VERSION`. The `generic` updater
  rewrites any version string it finds in the file on each release, so
  on the 1.0.0 release `VERSION` is updated in the release pull request
  (it already reads `1.0.0`, so the first release leaves it unchanged),
  and on every later release `VERSION` is bumped automatically in step
  with the tag and the changelog. No version file is ever edited by
  hand again.

  An equally valid alternative is to keep `simple`'s default and rename
  `VERSION` to `version.txt`; then no `extra-files` entry is needed.
  This is **not** recommended, because `VERSION` is already referenced
  as the project's version file in the global `release-process.md` and
  in the Phase 1 release checklist, and renaming it is a needless churn.
  Keeping `VERSION` and pointing `extra-files` at it is the cleaner fix.

### `.release-please-manifest.json`

```json
{
  ".": "1.0.0"
}
```

This is covered in section 3.

## 3. The initial manifest version value

The manifest must read:

```json
{
  ".": "1.0.0"
}
```

Reasoning, and why this avoids a conflict with the `Release-As: 1.0.0`
footer on `6ab5054`:

- The manifest is release-please's record of "the version last
  released". On each run, release-please reads the manifest, looks at
  the commits since that version, and proposes the next version.
- The merge commit `6ab5054` already carries a `Release-As: 1.0.0`
  footer. `Release-As` is an explicit override: it tells release-please
  to propose exactly `1.0.0` for the release pull request that includes
  that commit, regardless of what the conventional-commit history would
  otherwise compute.
- Setting the manifest to `1.0.0` makes the starting point and the
  target the same value. release-please sees "last released 1.0.0" and
  "this commit asks to be released as 1.0.0". It opens a release pull
  request for `1.0.0`, tags `v1.0.0`, and writes the changelog. There
  is no version going backwards and no conflict.
- The `VERSION` file on `main` already reads `1.0.0`, so the manifest,
  the `VERSION` file, and the `Release-As` footer all agree on `1.0.0`.
  This is the clean, consistent first release the team intends.

Why not `0.0.0` or `0.1.0`:

- `0.0.0` would also work, because `Release-As: 1.0.0` overrides the
  computed bump. But it would briefly misstate history: the manifest
  would claim the last release was `0.0.0` when no release exists and
  the project's own `VERSION` file says `1.0.0`. Starting the manifest
  at the value the project already declares (`1.0.0`) is the honest and
  least surprising choice.
- `0.1.0` was the Phase 1 pre-release version in the `VERSION` file
  during work 001. It is no longer the value on `main`; `main` now
  reads `1.0.0`. The manifest must match the current `main`, so `0.1.0`
  is wrong.

One caveat for Sean: there is **no existing Git tag and no existing
GitHub release**. With the manifest seeded at `1.0.0`, release-please
treats `1.0.0` as already released and, on the next push to `main`,
will collect only commits *after* `6ab5054` into the next release pull
request. Because `6ab5054` itself carries the `Release-As: 1.0.0`
footer, the intended behaviour is that this fix lands and release-please
then produces the `1.0.0` release pull request that includes `6ab5054`.

To make that happen cleanly, the manifest must be seeded so that
`6ab5054` is *not* yet considered released. The reliable way to do this,
and the one Sean should follow:

- Seed `.release-please-manifest.json` with `{ ".": "1.0.0" }` as shown.
- This fix (the two config files plus the `release.yml` change) is
  committed on a branch and merged to `main` as a normal pull request.
- The merge of this fix is itself a push to `main`, which triggers the
  `Release` workflow. release-please now reads a valid manifest, scans
  the history, finds the `Release-As: 1.0.0` footer on `6ab5054`, and
  opens the `1.0.0` release pull request.
- Merging that release pull request creates the `v1.0.0` tag and the
  GitHub release, and updates `CHANGELOG.md` and `VERSION`.

If release-please instead treats `1.0.0` as fully released and produces
nothing, the recovery is to add a new commit to `main` with a
`Release-As: 1.0.0` footer (an empty commit is enough), which forces the
release pull request. This is the documented fallback and Sean should
note it in the work log if the first run is silent. This edge is the
subject of question Q12.

## 4. Change needed to `release.yml`

One line is added to the `with` block so the action reads the new
config files explicitly. The action defaults to the standard file names,
but stating them removes any doubt and survives a future default change.
The `manifest: true` style is no longer needed in action v5 with v17;
supplying `config-file` and `manifest-file` is the current form.

The `with` block becomes:

```yaml
      - name: Release Please
        uses: googleapis/release-please-action@45996ed1f6d02564a971a2fa1b5860e934307cf7  # v5.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
```

No other change to `release.yml` is needed:

- The trigger (`push` to `main`), the permissions (`contents: write`,
  `pull-requests: write`), and the runner are all correct for
  release-please and need no change.
- The action is pinned to a commit SHA with the version in a comment,
  which matches the team's GitHub Actions pinning standard. Keep it
  pinned; do not change it to a floating tag.
- The deploy step described in the global `release-process.md` is a
  separate concern and is out of scope for this fix. This recommendation
  only makes the release-please job able to run.

A note on least privilege: the workflow grants `contents: write` and
`pull-requests: write`, which is the minimum release-please needs to
push the release branch, open the release pull request, and create the
tag and release. This is correct and should not be widened. The token
is the built-in `GITHUB_TOKEN`, which is the right choice for a
single-repository release with no cross-repository action.

## 5. Changelog generation, and the Phase 1 decision

The changelog is generated by release-please. With `release-type:
simple` and `changelog-path: CHANGELOG.md`, release-please reads the
Conventional Commits history since the last release and writes a
`CHANGELOG.md` at the repository root. It adds a new section to that
file inside every release pull request, so the changelog is always
produced by the tool, never written by hand.

This does **not** conflict with the Phase 1 decision. The Phase 1
release checklist (`.claude/work/001-periodic-table-setup/`
`neil-release-checklist.md`, the "Changelog is written or deferred to
automation" item) records Tim's decision exactly:

> the changelog is generated by release-please at release time, not
> pre-written ... No CHANGELOG.md pre-commit is required.

The recommended configuration is the faithful implementation of that
decision. It also matches the team coding standard in the global
`coding-standards.md`, which states that releases use release-please to
build the changelog automatically from Conventional Commits. The
project's branch and commit history already follow Conventional Commits,
so the generated changelog will be correct.

One consequence for Sean to note: the very first `1.0.0` release
changelog will list the commits since the start of history, because
there is no prior tag to bound it. release-please handles this
correctly; the result is a complete first-release changelog. No
`CHANGELOG.md` should be committed by hand before the first release;
doing so would clash with the file release-please creates.

## 6. Decision record and global wiki

### A new project decision record: yes

This fix should be recorded as **Periodic-Table Decision Record 005:
release automation configuration**. The reasoning:

- It is an architecture-level choice with lasting effect: the
  `release-type`, the manifest model, the changelog location, and the
  tag format are decisions that every future release of this project
  depends on. They belong in `decisions/`, not only in a work log.
- Decision Record 002 ("no build step") is closely related. A future
  reader who revisits the build-step decision needs to know that
  release automation runs with no build, on the `simple` strategy, and
  bumps the `VERSION` file through `extra-files`. Recording it as a
  decision keeps that link explicit.
- The Phase 1 changelog decision currently lives only in a work-folder
  release checklist. A work folder is not the wiki. Promoting it into a
  project decision record, alongside the configuration that implements
  it, gives the project a single durable home for "how this project
  releases".

The new record should state: the `simple` release-type and why; the two
manifest files and the `extra-files` link to `VERSION`; the changelog
approach (carried forward from the Phase 1 checklist decision); the tag
format; and the manifest seeding at `1.0.0`. It supersedes nothing; it
records a previously unrecorded decision and is a sibling of 001 to 004.

### The global `release-process.md`: yes, update it

The global `release-process.md` should be updated, and this is a
genuine cross-cutting lesson, not a project-specific one. Per the
`CLAUDE.md` cross-cutting rule, I am flagging this to Sonja, who makes
the final call on the global write.

The reasoning that it is cross-cutting:

- The global `release-process.md` "Release-Please Configuration"
  section describes the *behaviour* of release-please but gives no
  configuration. It does not mention manifest mode, the two required
  config files, or the `release-type`. Any project that copies the
  current `release.yml` will hit exactly this failure on its first push
  to `main`.
- The team has several static front-end projects in flight that will
  use the same pattern: Clock-Practice (work 004), LLBS (work 005),
  Braille-Reference (work 006), and timdixon82.github.io (work 007).
  Global Decision Record 006 already treats static-project setup
  questions as standing, team-wide standards. Release configuration
  belongs in that same standing set.
- The fix is identical for every static project: `release-type:
  simple`, the two manifest files, an `extra-files` entry pointing at
  whatever version file the project uses, and the two `*-file` inputs
  in `release.yml`. Writing it once in the global wiki stops four more
  projects rediscovering it.

Recommended global update: add to the "Release-Please Configuration"
section of `release-process.md` a short subsection stating that
release-please runs in manifest mode and requires
`release-please-config.json` and `.release-please-manifest.json` in the
repository root; that the standard `release-type` for a static
front-end project is `simple`; that the version file is kept in sync
with an `extra-files` entry; and that `release.yml` must pass
`config-file` and `manifest-file`. A short worked example, referencing
Periodic-Table Decision Record 005, is enough. This also gives the team
the option of a reusable `release-please-setup` pattern page in
`patterns/`, which Sonja may decide is worth a separate page.

Whether the global `release.yml` template (used to scaffold new
projects) should also be corrected is a related item: if such a
template exists, it should carry the `config-file` and `manifest-file`
inputs and ship the two manifest files, so no future project starts
broken. I flag this to Sonja as part of the same cross-cutting write;
it is outside this repository and outside this recommendation's scope to
change.

## Open questions for Tim

These are batched for Sonja to relay. The first two are genuine choices;
both have a recommended option so Tim can accept in one step. The
recommendation is implementable as it stands if Tim accepts the
recommended options.

**Q11. Release tag format.** release-please can tag releases with or
without a `v` prefix. The project has no existing tag, so either is a
clean start.

- A. Tag releases as `v1.0.0`, with the `v` prefix
  (`include-v-in-tag: true`). This is the release-please default and
  the common convention. **Recommended.**
- B. Tag releases as `1.0.0`, with no prefix
  (`include-v-in-tag: false`), to match the bare value in the `VERSION`
  file exactly.

**Q12. First-release fallback if the manifest is treated as already
released.** With the manifest seeded at `1.0.0`, release-please should
still produce the `1.0.0` release pull request because `6ab5054`
carries a `Release-As: 1.0.0` footer. If the first run is silent
instead, the fix is one extra commit to `main` with a `Release-As:
1.0.0` footer to force the release pull request.

- A. Pre-authorise Sean to add that single forcing commit (an empty
  commit with the `Release-As: 1.0.0` footer) if, and only if, the
  first `Release` workflow run after this fix produces no release pull
  request. It is recorded in the work log. **Recommended.**
- B. Do not pre-authorise it. If the first run is silent, Sean stops
  and Sonja brings the situation back to Tim before any further commit.

**Q13. Routing of this fix.** The fix is small (two new files, one
edited line) and unblocks the intended 1.0.0 release.

- A. Sean implements it on the existing Phase 2 accessibility branch, so
  the 1.0.0 release ships the accessibility work and a working release
  pipeline together. **Recommended.**
- B. Sean implements it as a separate short follow-up work folder and
  pull request, kept independent of the accessibility change.

## Handoff

Returned to Sonja. This recommendation informs Jed's security review
(the workflow permissions and token are unchanged and remain least
privilege) and Sean's implementation. Sean can implement directly from
sections 2, 3, and 4. Sonja decides Q11 to Q13 with Tim, records
Periodic-Table Decision Record 005, and makes the final call on the
cross-cutting write to the global `release-process.md`.

Jacob, architect.
