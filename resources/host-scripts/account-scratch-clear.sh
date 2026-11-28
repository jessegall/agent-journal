#!/bin/sh
# Empties the account's scratch folders, which every start holds in memory instead, of what a program left there.
# Usage: account-scratch-clear.sh <account folder> <scratch folder> [scratch folder ...]
set -eu

main() {
    local folder="$1"
    shift
    clear_scratch "$folder" "$@"
}

# A run outside a start, such as a sign-in, writes its scratch into the account itself; no start ever reads it.
clear_scratch() {
    local folder="$1" scratch
    shift
    for scratch in "$@"; do
        [ -d "$folder/$scratch" ] && [ ! -L "$folder/$scratch" ] && find "$folder/$scratch" -mindepth 1 -delete
    done
    return 0
}

main "$@"
