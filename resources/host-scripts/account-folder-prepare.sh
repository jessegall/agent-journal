#!/bin/sh
# Makes the account's mount points as the program's user and takes the group and other bits off its files.
# Usage: account-folder-prepare.sh <account folder> [mount point ...]
set -eu

main() {
    local folder="$1"
    shift
    make_mount_points "$folder" "$@"
    keep_files_private "$folder"
}

# The daemon would make a missing mount point as root while it mounts there.
make_mount_points() {
    local folder="$1" point
    shift
    for point in "$@"; do
        [ -L "$folder/$point" ] || [ -e "$folder/$point" ] || mkdir -m 0700 "$folder/$point"
    done
}

keep_files_private() {
    find "$1" -mindepth 1 ! -type l -exec chmod go-rwx {} +
}

main "$@"
