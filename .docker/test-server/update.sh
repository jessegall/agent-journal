#!/bin/sh
# Run every minute by cron on the test server: when the branch on GitHub has a commit newer than the one deployed, it
# fetches that commit into a bare copy of the repository beside the deploy folder, writes its files into the deploy
# folder (never a checkout there), removes the files the commit deleted, deploys it and records it as deployed.
set -eu

root=${DEPLOY_ROOT:-/srv/journal-test}
mirror=${DEPLOY_MIRROR:-/srv/journal-mirror.git}
branch=${DEPLOY_BRANCH:-version-6}
repository=https://github.com/jessegall/agent-journal.git

exec 9>/run/journal-update.lock
flock -n 9 || exit 0

newest=$(git ls-remote "$repository" "refs/heads/$branch" | cut -f1)
[ -n "$newest" ] || { echo "$(date -u +%FT%TZ) no $branch on GitHub"; exit 1; }
deployed=$(cat "$root/.deployed-commit" 2>/dev/null || true)
[ "$newest" = "$deployed" ] && exit 0

echo "$(date -u +%FT%TZ) deploying $branch $newest (was ${deployed:-nothing})"
[ -d "$mirror" ] || git clone --quiet --bare "$repository" "$mirror"
git -C "$mirror" fetch --quiet origin "+refs/heads/$branch:refs/heads/$branch"

git -C "$mirror" archive "$newest" | tar -x -C "$root"
if [ -n "$deployed" ] && git -C "$mirror" cat-file -e "$deployed^{commit}" 2>/dev/null; then
    git -C "$mirror" diff --name-only --diff-filter=D "$deployed" "$newest" | while read -r gone; do
        rm -f "$root/$gone"
    done
fi

sh "$root/.docker/test-server/deploy.sh"
echo "$newest" > "$root/.deployed-commit"
echo "$(date -u +%FT%TZ) deployed $newest"
