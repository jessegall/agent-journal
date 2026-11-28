#!/bin/sh
# Runs the command given in a process group of its own until standard input ends or the script is ended, then kills
# that whole group: the command and every worker it forked end with the test, whichever way the test lets it go.
set -eu

main() {
    local group
    group=$(start_group "$@")
    trap 'kill_group "$group"; exit 0' TERM INT HUP
    wait_for_input_end
    kill_group "$group"
}

# setsid makes the background command lead a process group of its own, named after its process id.
start_group() {
    setsid "$@" </dev/null >/dev/null 2>&1 &
    echo "$!"
}

# The read runs in the background so a signal reaches the trap at once; a background job's own input is /dev/null,
# so it reads the script's input from a copy kept on descriptor 3.
wait_for_input_end() {
    exec 3<&0
    cat <&3 >/dev/null &
    wait "$!" || true
}

kill_group() {
    local group="$1"
    kill -KILL "-$group" 2>/dev/null || true
}

main "$@"
