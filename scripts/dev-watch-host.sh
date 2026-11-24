#!/bin/sh
# Development only: builds journal-agent for the local containers whenever a Go file changes, and restarts the running
# services on it.   sh scripts/dev-watch-host.sh [--once]   (--once builds once and restarts nothing)
set -eu

main() {
    local architecture binaries=.build/dev/bin built=.build/dev/built
    cd "$(dirname "$0")/.."
    architecture=$(read_architecture)
    mkdir -p "$binaries"
    build_binaries "$architecture" "$binaries" "$built"
    echo "Built journal-agent for linux/$architecture into $binaries."
    [ "${1:-}" = --once ] && exit 0
    watch_changes "$architecture" "$binaries" "$built"
}

read_architecture() {
    docker info --format '{{.Architecture}}' | sed 's/x86_64/amd64/; s/aarch64/arm64/'
}

# The agent image's own programs are built too: the local host mounts them over the image's copies.
build_binaries() {
    (cd tools/journal-agent &&
        env CGO_ENABLED=0 GOOS=linux GOARCH="$1" go build -o "../../$2/journal-agent.next" ./cmd/journal-agent)
    mv "$2/journal-agent.next" "$2/journal-agent"
    mkdir -p .build/dev/protected
    (cd tools/journal-agent &&
        env CGO_ENABLED=0 GOOS=linux GOARCH="$1" go build -o ../../.build/dev/protected/ \
            ./cmd/journal-init ./cmd/journal-exec ./cmd/journal-shell ./cmd/journal-hook ./cmd/journal-mcp)
    touch "$3"
}

watch_changes() {
    local changed
    echo "Watching the Go files of tools/journal-agent."
    while :; do
        sleep 1
        changed=$(find tools/journal-agent -name '*.go' -newer "$3" | head -n 1)
        [ -n "$changed" ] || continue
        echo "Changed: $changed"
        rebuild "$@"
    done
}

# A failed build keeps the running binary; the next change tries again.
rebuild() {
    if build_binaries "$@"; then
        echo "Built journal-agent."
        restart_services
    else
        touch "$3"
        echo "The build failed; the running host keeps its binary."
    fi
}

# Only running services are restarted; a stopped one starts on the new binary by itself.
restart_services() {
    local running service
    running=$(docker compose ps --services --status running)
    for service in agent-host accounts; do
        if printf '%s\n' "$running" | grep -qx "$service"; then
            docker compose restart "$service" >/dev/null
            echo "Restarted $service."
        fi
    done
}

main "$@"
