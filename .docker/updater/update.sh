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
#   JOURNAL_PROFILES   the compose profiles the installation runs, space-separated (contained)
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
if [ -n "$installed" ] && git -C "$mirror" cat-file -e "$installed^{commit}" 2>/dev/null; then
    git -C "$mirror" diff --name-only --diff-filter=D "$installed" "$newest" | while read -r gone; do
        rm -f "$root/$gone"
    done
fi

profiles=""
for profile in ${JOURNAL_PROFILES:-}; do
    profiles="$profiles --profile $profile"
done

install() {
    docker compose --progress=quiet build app share
    case " ${JOURNAL_PROFILES:-} " in
        *" contained "*)
            platform=$(docker version --format '{{.Server.Os}}/{{.Server.Arch}}')
            sh .docker/helper/build.sh "$platform" runner
            runner=$(python3 -c 'import json; print(json.load(open("docs/accounts/docker-images.json"))["images"][-1]["reference"])')
            sed -i "s|^RUNNER_IMAGE=.*|RUNNER_IMAGE=$runner|" .env
            ;;
    esac
    # shellcheck disable=SC2086
    docker compose $profiles up -d --wait --wait-timeout 240
    docker compose exec -T app php artisan migrate --force
    docker image prune -f >/dev/null
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
