#!/bin/sh
# Development only: puts the latency proxy between the local journal and its contained host (task 3436).
#   sh tools/latency/start-proxy.sh [added latency, 300ms]   (tools/latency/stop-proxy.sh takes it away again)
set -eu

main() {
    local added=${1:-300ms} project=agent-journal-6 proxy=journal-latency-proxy
    cd "$(dirname "$0")/../.."
    remove_proxy "$proxy"
    start_proxy "$project" "$proxy" "$added"
    enroll_host "http://$proxy:8000"
    echo "The host now reaches the journal through $proxy, $added added per round trip."
}

remove_proxy() {
    docker rm -f "$1" >/dev/null 2>&1 || true
}

# The proxy joins the host's own network, which reaches nothing outside, so it runs from the mounted source.
start_proxy() {
    docker run -d --name "$2" --network "$1_journal-api" \
        -v "$PWD/tools/latency/proxy:/proxy:ro" -w /proxy -e GOCACHE=/tmp/go-cache -e GOFLAGS=-mod=mod \
        golang:1.26.4-bookworm go run main.go -listen :8000 -target app:8000 -added "$3" >/dev/null
}

# A changed journal address enrolls the host again; the host is made anew so it reads the new enrollment.
enroll_host() {
    AGENTS_JOURNAL_URL=$1 docker compose --profile contained up -d --force-recreate agent-host-enroll agent-host
}

main "$@"
