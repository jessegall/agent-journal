#!/bin/sh
# Shared by the project's shell scripts: running docker commands.
#   . scripts/lib/docker.sh

# Runs a docker command again, up to three times with a growing pause, while Docker itself fails (exit code 125, a
# passing daemon error); the program's own failure is returned at once: retry_docker docker run ...
retry_docker() {
    local try=1 code
    while :; do
        code=0
        "$@" || code=$?
        [ "$code" = 125 ] && [ "$try" -lt 3 ] || return "$code"
        sleep $((try * 2))
        try=$((try + 1))
    done
}
