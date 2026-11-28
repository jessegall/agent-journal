#!/bin/sh
# Checks an operator's workspace folder; prints the one word of the first check it fails and exits 1.
# Usage: workspace-folder-check.sh <folder> <user id>
set -u

main() {
    local folder="$1" user="$2"
    check_place "$folder"
    check_owner "$folder" "$user"
    check_links "$folder"
    check_git "$folder"
}

refuse() {
    echo "$1"
    exit 1
}

check_place() {
    [ -e "$1" ] || [ -L "$1" ] || refuse missing
    [ -L "$1" ] && refuse outside
    [ -d "$1" ] || refuse missing
    [ "$(readlink -f "$1")" = "$1" ] || refuse outside
}

check_owner() {
    [ "$(stat -c %u "$1")" = "$2" ] || refuse owner
}

check_links() {
    local link
    find "$1" -maxdepth 2 -type l | while read -r link; do
        case "$(readlink -f "$link")" in "$1"/*) ;; *) echo symlink-out; exit 1;; esac
    done || exit 1
}

# A linked worktree, alternates or hooks reach outside the folder.
check_git() {
    local reaching
    for reaching in objects/info/alternates commondir hooks; do
        [ -e "$1/.git/$reaching" ] && refuse unsafe-git
    done
    return 0
}

main "$@"
