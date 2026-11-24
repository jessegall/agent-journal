#!/bin/sh
# Inside a container: records this session's group in the marker file, then becomes the command.
#   setsid -w sh tools/container-run/start-session.sh <marker> <command...>
set -eu

main() {
    local marker=$1
    shift
    echo $$ > "$marker"
    exec "$@"
}

main "$@"
