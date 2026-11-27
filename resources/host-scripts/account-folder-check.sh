#!/bin/sh
# Checks an account folder is private to the program's user; prints the first failing check, a tab and its path.
# Usage: account-folder-check.sh <data folder> <account id> <user id> <root user id>
set -u

main() {
    local root="$1" account="$2" user="$3" root_user="$4"
    local folder="$root/accounts/$account"
    check_above "$root" "$root_user"
    check_folder "$folder" "$user"
    check_contents "$folder" "$user"
}

refuse() {
    printf '%s\t%s\n' "$1" "$2"
    exit 1
}

check_above() {
    local above
    for above in "$1" "$1/accounts"; do
        [ "$(stat -c %u "$above")" = "$2" ] || refuse "is not owned by root" "$above"
        [ $(( 0$(stat -c %a "$above") & 022 )) = 0 ] || refuse "is writable by group or other" "$above"
    done
}

check_folder() {
    local folder="$1" user="$2"
    [ -L "$folder" ] && refuse "is a link" "$folder"
    [ -d "$folder" ] || refuse "is not a folder" "$folder"
    [ "$(stat -c %u:%g:%a "$folder")" = "$user:$user:700" ] || refuse "is not owned $user:$user with mode 0700" "$folder"
    case "$(ls -ld "$folder")" in ??????????+*) refuse "has ACL entries" "$folder";; esac
}

check_contents() {
    local folder="$1" user="$2" found
    found=$(find "$folder" -mindepth 1 ! -type l ! -uid "$user" -print -quit)
    [ -z "$found" ] || refuse "is not owned by $user" "$found"
    found=$(find "$folder" -mindepth 1 ! -type l -perm /077 -print -quit)
    [ -z "$found" ] || refuse "is readable or writable by group or other" "$found"
    found=$(find "$folder" -type l -exec sh -c 'for link; do case "$(readlink -f "$link")" in "$0"/*) ;; *) echo "$link"; exit 0;; esac; done' "$folder" {} + | head -n 1)
    [ -z "$found" ] || refuse "is a link leading out of the folder" "$found"
}

main "$@"
