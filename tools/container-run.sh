#!/bin/sh
# Runs a command in a project container in a session of its own, and when stopped kills that whole session inside too.
#   sh tools/container-run.sh <service> [exec options] -- <command...>   (for example: app -- composer test:run)
set -u

main() {
    local service=$1 project=${CONTAINER_RUN_PROJECT:-agent-journal-6} marker client status
    shift
    marker=/tmp/container-run-$$-$(date +%s).pid
    start_command "$project" "$service" "$marker" "$@" &
    client=$!
    trap 'stop_session "$project" "$service" "$marker" "$client"' TERM INT HUP
    wait "$client"
    status=$?
    docker compose -p "$project" exec -T "$service" rm -f "$marker"
    exit "$status"
}

# The arguments become: the exec options, the service, the session that records its group, then the command.
start_command() {
    local project=$1 service=$2 marker=$3 total argument options_done=no
    shift 3
    total=$#
    for argument in "$@"; do
        if [ "$options_done" = no ] && [ "$argument" = '--' ]; then
            options_done=yes
            set -- "$@" "$service" setsid -w sh /app/tools/container-run/start-session.sh "$marker"
            continue
        fi
        set -- "$@" "$argument"
    done
    shift "$total"
    exec docker compose -p "$project" exec -T "$@"
}

# Stopping docker exec alone leaves the command, and every process it started, running in the container.
stop_session() {
    docker compose -p "$1" exec -T "$2" sh /app/tools/container-run/stop-session.sh "$3"
    kill "$4" 2>/dev/null
    exit 143
}

main "$@"
