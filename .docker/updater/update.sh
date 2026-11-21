#!/bin/sh
# Brings an installation up to the newest commit of its branch. The updater service fetches this script from the
# repository every minute and runs it in the installation's folder, so a change to it reaches every installation.
# When the branch has a commit newer than the installed one, it writes that commit's files into the folder (never a
# checkout there), removes the files the commit deleted, rebuilds, restarts, migrates and records the commit. A
# commit that fails is recorded too and not tried again; the next push is.
#
# It reads, from the environment the updater service passes on:
#   JOURNAL_ROOT       the installation's folder, the same path inside the updater as on the server
#   JOURNAL_BRANCH     the branch to follow (version-6)
#   JOURNAL_REPOSITORY the repository to follow (the public journal repository)
set -eu

root=${JOURNAL_ROOT:?the updater names the installation folder}
branch=${JOURNAL_BRANCH:?the updater names the branch}
repository=${JOURNAL_REPOSITORY:?the updater names the repository}
mirror=/var/lib/journal-updater/mirror.git
cd "$root"

newest=$(git ls-remote "$repository" "refs/heads/$branch" | cut -f1)
[ -n "$newest" ] || { echo "$(date -u +%FT%TZ) the branch $branch is not in $repository"; exit 1; }
installed=$(cat .installed-commit 2>/dev/null || true)
failed=$(cat .failed-commit 2>/dev/null || true)
[ "$newest" = "$installed" ] || [ "$newest" = "$failed" ] && exit 0

echo "$(date -u +%FT%TZ) installing $branch $newest (installed: ${installed:-nothing})"
[ -d "$mirror" ] || git clone --quiet --bare "$repository" "$mirror"
git -C "$mirror" fetch --quiet --force "$repository" "refs/heads/$branch:refs/heads/$branch"

git -C "$mirror" archive "$newest" | tar -x -C "$root"
# The version the journal shows, baked into the build: the commit, its branch and its release tag, if it has one.
tag=$(git -C "$mirror" describe --tags --exact-match "$newest" 2>/dev/null || true)
printf '%s\n%s\n%s\n' "$newest" "$branch" "$tag" > .installed-version
if [ -n "$installed" ] && git -C "$mirror" cat-file -e "$installed^{commit}" 2>/dev/null; then
    git -C "$mirror" diff --name-only --diff-filter=D "$installed" "$newest" | while read -r gone; do
        rm -f "$root/$gone"
    done
fi

# Migrations run only when the commits since the installed one add or change one; a first install always runs them.
migrations_changed=yes
if [ -n "$installed" ] && git -C "$mirror" cat-file -e "$installed^{commit}" 2>/dev/null &&
    ! git -C "$mirror" diff --name-only "$installed" "$newest" | grep -qE '(^|/)(Database/Migrations|database/migrations)/'; then
    migrations_changed=no
fi

# A contained installation, as its .env says, also runs the contained profile and its pinned runner image.
arrangement=$(sed -n 's/^AGENTS_ARRANGEMENT=//p' .env | tail -n 1)
profiles=""
[ "$arrangement" = contained ] && profiles="--profile contained"

# Each step must pass for the commit to count as installed: set -e does not hold inside an if, so they are chained.
install() {
    docker compose --progress=quiet build app share &&
        { [ "$arrangement" != contained ] || pin_runner; } &&
        docker compose $profiles up -d --wait --wait-timeout 240 &&
        { [ "$migrations_changed" = no ] || docker compose exec -T app php artisan migrate --force; } &&
        docker compose exec -T app php artisan cache:forget installed-version &&
        docker image prune -f >/dev/null
}

pin_runner() {
    platform=$(docker version --format '{{.Server.Os}}/{{.Server.Arch}}') &&
        sh .docker/helper/build.sh "$platform" runner &&
        runner=$(python3 -c 'import json; print(json.load(open("docs/accounts/docker-images.json"))["images"][-1]["reference"])') &&
        sed -i "s|^RUNNER_IMAGE=.*|RUNNER_IMAGE=$runner|" .env
}

if install; then
    echo "$newest" > .installed-commit
    rm -f .failed-commit
    echo "$(date -u +%FT%TZ) installed $newest"
else
    echo "$newest" > .failed-commit
    echo "$(date -u +%FT%TZ) $newest failed to install; the next commit is tried"
    exit 1
fi
