#!/bin/sh
# Development only: takes the latency proxy away and enrolls the contained host straight with the journal again.
#   sh tools/latency/stop-proxy.sh
set -eu

main() {
    cd "$(dirname "$0")/../.."
    enroll_host
    docker rm -f journal-latency-proxy >/dev/null 2>&1 || true
    echo "The host reaches the journal straight again."
}

enroll_host() {
    docker compose --profile contained up -d --force-recreate agent-host-enroll agent-host
}

main "$@"
