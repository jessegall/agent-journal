#!/bin/sh
# The checks a driver image runs on itself as its last build step, as the program's user; the first failure ends it.
# Usage: driver-image.sh <program> <version line field> <pinned version> <programs list> <policy folder>... -- <other>
set -eu

main() {
    local program="$1" field="$2" version="$3" programs="$4" other
    shift 4
    other=$(other_driver "$@")
    check_programs "$programs"
    check_no_other "$other"
    check_version "$program" "$field" "$version"
    check_no_node
    check_policies "$@"
}

# The driver the image must not hold is the argument after the --, and the policy folders come before it.
other_driver() {
    while [ "$1" != "--" ]; do
        shift
    done
    echo "$2"
}

check_programs() {
    local path
    while read -r path; do
        [ -x "$path" ] || fail "$path is missing or not runnable"
    done < "$1"
}

check_no_other() {
    if command -v "$1" >/dev/null 2>&1; then
        fail "the image holds $1 as well"
    fi
}

check_version() {
    local line printed
    line=$("$1" --version) || fail "$1 --version exited non-zero"
    printed=$(printf '%s\n' "$line" | awk -v field="$2" 'NR == 1 { print $field }')
    [ "$printed" = "$3" ] || fail "$1 prints $printed, not $3"
}

check_no_node() {
    if command -v node >/dev/null 2>&1 || command -v npm >/dev/null 2>&1; then
        fail "the image holds Node"
    fi
}

# Every file of each policy folder is root's and read-only, so no session changes what the driver obeys.
check_policies() {
    local folder file
    for folder in "$@"; do
        [ "$folder" = "--" ] && return
        for file in "$folder"/*; do
            [ "$(stat -c '%U %a' "$file")" = "root 444" ] || fail "$file is not root's and read-only"
        done
    done
}

fail() {
    echo "driver-image: $1" >&2
    exit 1
}

main "$@"
