#!/bin/sh
# Removes a session's folder of plan files once the session has ended.
# Usage: session-files-remove.sh <session folder>
set -eu

main() {
    rm -rf -- "$1"
}

main "$@"
