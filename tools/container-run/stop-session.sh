#!/bin/sh
# Inside a container: stops the session group a marker file names, politely and then forcefully, and removes the marker.
#   sh tools/container-run/stop-session.sh <marker>
set -u

main() {
    local marker=$1 group
    [ -f "$marker" ] || exit 0
    group=$(cat "$marker")
    kill -TERM -"$group" 2>/dev/null
    sleep 5
    kill -KILL -"$group" 2>/dev/null
    rm -f "$marker"
}

main "$@"
