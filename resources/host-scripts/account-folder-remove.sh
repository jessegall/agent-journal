#!/bin/sh
# Removes one account folder and everything in it, or a link standing in its place without following it.
# Usage: account-folder-remove.sh <accounts root> <account id>
set -eu

main() {
    local folder="$1/$2"
    remove_folder "$folder"
}

remove_folder() {
    rm -rf -- "$1" && [ ! -e "$1" ] && [ ! -L "$1" ]
}

main "$@"
