#!/bin/sh
# Runs the command given in a process group of its own until standard input ends, then kills that whole group:
# a test that started it keeps the pipe open, so the command and every worker it forked end with the test.
set -eu

main() {
    local group
    group=$(start_group "$@")
    wait_for_input_end
    kill_group "$group"
}

# set -m puts the background command in a process group named after its own process id.
start_group() {
    set -m
    "$@" </dev/null >/dev/null 2>&1 &
    echo "$!"
}

wait_for_input_end() {
    cat >/dev/null
}

kill_group() {
    local group="$1"
    kill -KILL -- "-$group" 2>/dev/null || true
}

main "$@"
