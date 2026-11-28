#!/bin/sh
# Fills an empty workspace volume with a self-contained clone at the revision, with the deploy key read from input.
# Usage: workspace-clone.sh <repository> <revision> <branch> <folder>
set -eu

main() {
    local repository="$1" revision="$2" branch="$3" folder="$4"
    local GIT_SSH_COMMAND='ssh -i /tmp/deploy_key -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/tmp/known_hosts'
    export GIT_SSH_COMMAND
    [ -d "$folder/.git" ] && exit 0
    keep_key
    clone "$repository" "$revision" "$branch" "$folder" || { empty_folder "$folder"; exit 1; }
    rm -f /tmp/deploy_key
}

# The key lives in the private memory folder for this one clone.
keep_key() {
    umask 077
    cat > /tmp/deploy_key
}

clone() {
    local repository="$1" revision="$2" branch="$3" folder="$4"
    git clone --quiet --no-local --no-hardlinks --no-checkout --config core.hooksPath=/dev/null "$repository" "$folder"
    git -C "$folder" checkout --quiet -B "$branch" "$revision"
    git -C "$folder" remote remove origin
    rm -rf "$folder/.git/hooks"
}

# A failed clone leaves the volume as empty as it came, so the next start clones again.
empty_folder() {
    find "$1" -mindepth 1 -delete
}

main "$@"
