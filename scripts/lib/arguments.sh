#!/bin/sh
# Shared by the project's shell scripts: reading the arguments a script or a stand-in program was called with.
#   . scripts/lib/arguments.sh

# The value that follows an option, such as the tag after --tag: option_after --tag "$@"
option_after() {
    local wanted=$1
    shift
    while [ "$#" -gt 1 ]; do
        if [ "$1" = "$wanted" ]; then echo "$2"; return 0; fi
        shift
    done
}
