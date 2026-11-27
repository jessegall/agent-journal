#!/bin/sh
# Gives a writer its own clone of the main workspace at the revision; the folder check runs after it.
# Usage: workspace-checkout.sh <source> <revision> <branch> <folder>
set -eu

main() {
    local source="$1" revision="$2" branch="$3" folder="$4"
    [ -d "$folder/.git" ] && exit 0
    clone "$source" "$revision" "$branch" "$folder" || { empty_folder "$folder"; exit 1; }
}

clone() {
    local source="$1" revision="$2" branch="$3" folder="$4"
    git clone --quiet --no-local --no-hardlinks --no-checkout --config core.hooksPath=/dev/null "$source" "$folder"
    git -C "$folder" checkout --quiet -B "$branch" "$revision"
    git -C "$folder" remote remove origin
    rm -rf "$folder/.git/hooks"
}

empty_folder() {
    find "$1" -mindepth 1 -delete
}

main "$@"
