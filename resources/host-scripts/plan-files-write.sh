#!/bin/sh
# Writes a process's plan files from the tar on its input into their folder, readable by every user and owned by root.
# Usage: plan-files-write.sh <files folder> <session folder>
set -eu

main() {
    local folder="$1" session="$2"
    rm -rf -- "$folder"
    mkdir -p -- "$folder"
    tar -x -o -C "$folder"
    chmod -R u=rwX,go=rX -- "$session"
}

main "$@"
