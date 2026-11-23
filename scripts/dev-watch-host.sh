#!/bin/sh
# Development only: builds journal-agent for the local containers on this machine, with Go's own caches, whenever a Go
# file under tools/journal-agent changes, and restarts the running services that run it. A change reaches the local
# host in seconds with no image build: compose.override.yaml puts .build/dev/bin first on those services' PATH.
#
#   sh scripts/dev-watch-host.sh          builds now, then again on every change, until stopped
#   sh scripts/dev-watch-host.sh --once   builds once and restarts nothing (scripts/local-host.sh runs this)
set -eu
cd "$(dirname "$0")/.."

architecture=$(docker info --format '{{.Architecture}}' | sed 's/x86_64/amd64/; s/aarch64/arm64/')
binaries=.build/dev/bin
built=.build/dev/built
services="agent-host accounts"
mkdir -p "$binaries"

build() {
    (cd tools/journal-agent &&
        CGO_ENABLED=0 GOOS=linux GOARCH="$architecture" go build -o "../../$binaries/journal-agent.next" ./cmd/journal-agent)
    mv "$binaries/journal-agent.next" "$binaries/journal-agent"
    # The relays a session container runs, for a look at one outside its image.
    (cd tools/journal-agent &&
        CGO_ENABLED=0 GOOS=linux GOARCH="$architecture" go build -o "../../$binaries/" ./cmd/journal-hook ./cmd/journal-mcp)
    touch "$built"
}

# Only the services that are running are restarted; one that is stopped starts on the new binary by itself.
restart() {
    running=$(docker compose ps --services --status running)
    for service in $services; do
        if printf '%s\n' "$running" | grep -qx "$service"; then
            docker compose restart "$service" >/dev/null
            echo "Restarted $service."
        fi
    done
}

build
echo "Built journal-agent for linux/$architecture into $binaries."
[ "${1:-}" = --once ] && exit 0

echo "Watching tools/journal-agent for changes."
while :; do
    sleep 1
    changed=$(find tools/journal-agent -name '*.go' -newer "$built" | head -n 1)
    [ -n "$changed" ] || continue
    echo "Changed: $changed"
    if build; then
        echo "Built journal-agent."
        restart
    else
        # A failed build keeps the running binary; the next change tries again.
        touch "$built"
        echo "The build failed; the running host keeps its binary."
    fi
done
