#!/usr/bin/env bash
#
# branch-protection.sh
#
# Applies a baseline branch-protection rule to the default branch of every
# repository owned by a GitHub account.
#
# IMPORTANT: Tim must run this script himself. The agent team must not run it.
# Branch-protection edits are on the team's hard deny-list in CLAUDE.md, and
# the deny-list overrides any instruction.
#
# What the baseline rule does:
#   - Requires a pull request before merging to the default branch.
#   - Requires zero approving reviews, so a solo maintainer can still merge.
#   - Blocks force pushes to the default branch.
#   - Blocks deletion of the default branch.
#   - Does NOT require status checks. Repositories without the team workflows
#     are therefore not blocked from merging. Add required status checks per
#     repository once its CI, accessibility, and security workflows exist.
#
# Prerequisites:
#   - The GitHub CLI (gh), installed and authenticated. Check with:
#       gh auth status
#
# Usage:
#   bash branch-protection.sh                          # every repository
#   bash branch-protection.sh timdixon82/Periodic-Table  # only the named ones
#
# Note: branch protection on private repositories may need a paid GitHub plan.
# If a private repository reports FAIL, that is the most likely reason.

set -euo pipefail

OWNER="timdixon82"

# Build the JSON body for the protection rule in a temporary file.
BODY_FILE="$(mktemp)"
trap 'rm -f "$BODY_FILE"' EXIT
cat > "$BODY_FILE" <<'JSON'
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

# Decide which repositories to process.
if [ "$#" -gt 0 ]; then
  REPOS=$(printf '%s\n' "$@")
else
  REPOS=$(gh repo list "$OWNER" --no-archived --limit 200 \
    --json nameWithOwner --jq '.[].nameWithOwner')
fi

echo "Repositories to protect:"
printf '%s\n' "$REPOS" | sed 's/^/  /'
echo
printf 'Apply the baseline protection rule to the branches above? [y/N] '
read -r reply
case "$reply" in
  y|Y) ;;
  *) echo "Cancelled. No changes made."; exit 0 ;;
esac

# Apply the rule to each repository's default branch.
while IFS= read -r repo; do
  [ -n "$repo" ] || continue
  branch=$(gh repo view "$repo" --json defaultBranchRef \
    --jq '.defaultBranchRef.name' 2>/dev/null || true)
  if [ -z "$branch" ]; then
    echo "SKIP  $repo - could not read its default branch."
    continue
  fi
  if gh api --method PUT "repos/${repo}/branches/${branch}/protection" \
       --input "$BODY_FILE" >/dev/null 2>&1; then
    echo "OK    $repo ($branch)"
  else
    echo "FAIL  $repo ($branch) - check the account plan and permissions."
  fi
done <<< "$REPOS"

echo
echo "Done. Review each repository's branch settings on GitHub to confirm."
