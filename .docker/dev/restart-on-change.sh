#!/bin/sh
# Runs a long-lived PHP command in development and starts it again whenever a PHP file of the project changes.
# Usage: sh .docker/dev/restart-on-change.sh <command> [arguments...]   (polls every POLL_SECONDS, default 2)
set -eu

main() {
    local stamp child
    stamp=$(make_stamp)
    child=$(start_command "$@")
    trap 'stop_command "$child"; exit 0' TERM INT

    while true; do
        sleep "${POLL_SECONDS:-2}"

        if has_changes "$stamp" || ! is_running "$child"; then
            touch "$stamp"
            stop_command "$child"
            child=$(start_command "$@")
        fi
    done
}

# A file whose time marks the last start: a PHP file newer than it is a change.
make_stamp() {
    local stamp
    stamp=$(mktemp)
    touch "$stamp"
    echo "$stamp"
}

# The command runs in the background, printing to the container's own output, and its process id is printed.
start_command() {
    "$@" >/proc/1/fd/1 2>/proc/1/fd/2 &
    echo "$!"
}

has_changes() {
    local changed
    changed=$(find app domain config routes database -newer "$1" -name '*.php' -print 2>/dev/null | head -n 1)
    [ -n "$changed" ] || [ composer.lock -nt "$1" ]
}

is_running() {
    kill -0 "$1" 2>/dev/null
}

stop_command() {
    kill -TERM "$1" 2>/dev/null || true
    wait "$1" 2>/dev/null || true
}

main "$@"
