#!/bin/sh
# Development only: the median and 95th percentile of the deliveries and model changes applied since a moment.
#   sh tools/latency/request-times.sh "2026-11-26 20:00"   (the moment in the database's time zone)
set -eu

main() {
    local since=$1 project=agent-journal-6
    cd "$(dirname "$0")/../.."
    for operation in deliver change_model; do
        read_times "$project" "$operation" "$since"
    done
}

read_times() {
    docker compose -p "$1" exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" "$@"' psql \
        -v operation="$2" -v since="'$3'" -f - < tools/latency/request-times.sql
}

main "$@"
