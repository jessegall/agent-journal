#!/bin/sh
# Makes or reconciles one account folder under the accounts root as root, pinned to the sign-in that made it.
# Usage: account-folder-make.sh <accounts root> <account id> <operation> <user id>
set -eu

main() {
    local root="$1" account="$2" operation="$3" user="$4"
    local folder="$root/$account"
    keep_root_private "$root"
    make_folder "$folder" "$operation"
    hand_over "$folder" "$user" "$operation"
}

keep_root_private() {
    chown 0:0 "$1" && chmod 0755 "$1"
}

# A folder another sign-in made is refused, and so is a link in its place or in place of its mark.
make_folder() {
    local folder="$1" operation="$2"
    local mark="$folder/.journal-folder-operation"
    [ -L "$folder" ] && { echo "the account folder is a link"; exit 1; }
    if [ -e "$folder" ]; then
        [ -L "$mark" ] && { echo "the folder's operation mark is a link"; exit 1; }
        if [ -f "$mark" ] && [ "$(cat "$mark")" != "$operation" ]; then echo "another sign-in made this folder"; exit 1; fi
    else
        mkdir -m 0700 "$folder"
    fi
}

hand_over() {
    local folder="$1" user="$2" operation="$3"
    local mark="$folder/.journal-folder-operation"
    chown "$user:$user" "$folder" && chmod 0700 "$folder"
    [ -f "$mark" ] || printf '%s' "$operation" > "$mark"
    chown "$user:$user" "$mark" && chmod 0600 "$mark"
}

main "$@"
