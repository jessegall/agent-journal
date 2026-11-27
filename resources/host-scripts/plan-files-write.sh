#!/bin/sh
# Writes a process's plan files from the tar on its input into their folder, each with the owner and mode the tar
# gives it; the rest of the session stays readable by every user.
# Usage: plan-files-write.sh <files folder> <session folder>
set -eu

main() {
    local folder="$1" session="$2"
    rm -rf -- "$folder"
    mkdir -p -- "$folder"
    chmod -R u=rwX,go=rX -- "$session"
    tar -x -p --same-owner -C "$folder"
}

main "$@"
