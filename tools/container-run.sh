#!/bin/sh
# Runs a command in one of the project's containers in a session of its own, and when this script is stopped (TERM,
# INT or HUP, as the journal stops a run) kills that whole session inside the container too: stopping docker exec
# alone leaves the command, and every process it started, running in the container. The service comes first, then
# any options for docker compose exec such as -w or -e, then a lone --, then the command.
#
#   sh tools/container-run.sh app -- composer test:run -- tests/Feature/Web/TerminalPageTest.php
#   sh tools/container-run.sh queue -w /app/.journal/worktrees/main/worker-271 -- composer run-script test:run-inside

set -u

service=$1
shift
project=${CONTAINER_RUN_PROJECT:-agent-journal-6}
marker=/tmp/container-run-$$-$(date +%s).pid

# The arguments become: the exec options, the service, the session that records its group, then the command.
total=$#
options_done=no
for argument in "$@"; do
    if [ "$options_done" = no ] && [ "$argument" = '--' ]; then
        options_done=yes
        # shellcheck disable=SC2016
        set -- "$@" "$service" setsid -w sh -c 'echo $$ > "$0"; exec "$@"' "$marker"
        continue
    fi
    set -- "$@" "$argument"
done
shift "$total"

docker compose -p "$project" exec -T "$@" &
client=$!

stop_inside() {
    docker compose -p "$project" exec -T "$service" sh -c \
        '[ -f "$1" ] || exit 0; group=$(cat "$1"); kill -TERM -"$group" 2>/dev/null; sleep 5; kill -KILL -"$group" 2>/dev/null; rm -f "$1"' \
        sh "$marker"
    kill "$client" 2>/dev/null
    exit 143
}

trap stop_inside TERM INT HUP

wait "$client"
status=$?
docker compose -p "$project" exec -T "$service" rm -f "$marker"
exit "$status"
