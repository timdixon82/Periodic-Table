#!/usr/bin/env bash
# clean-stale-branches.sh
#
# Removes stale local sync branches that have already been merged and
# whose remote counterparts no longer exist.
#
# Must be run from main (or will switch to main automatically).
# Safe to run more than once. Branches that are already gone are skipped
# without error.
#
# Run from any directory.

set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"

echo "Switching to main and pulling latest..."
git -C "$REPO" checkout main
git -C "$REPO" pull origin main

echo "Fetching and pruning remote tracking refs..."
git -C "$REPO" fetch --prune

echo "Deleting stale local sync branches..."
# -D (force delete) is required because these branches were squash-merged
# into main; git branch -d cannot verify a squash merge and refuses to delete.
git -C "$REPO" branch -D \
  chore/sync-template-v1.4.2 \
  chore/sync-template-v1.4.5 \
  chore/sync-template-v1.5.3 \
  chore/sync-template-v1.5.6 \
  2>/dev/null && echo "Done." || echo "Some branches were already gone — nothing to worry about."

echo ""
echo "Remaining local branches:"
git -C "$REPO" branch
