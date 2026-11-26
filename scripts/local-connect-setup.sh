#!/bin/sh
# Lets the local Docker journal hand out install lines a folder on this Mac can use: signs a release of this checkout
# into the app and names this Mac's address and that release in .env.   sh scripts/local-connect-setup.sh
set -eu

main() {
    local key="$HOME/.journal-release/local.key" origin=${JOURNAL_LOCAL_ORIGIN:-http://localhost:54700} version
    cd "$(dirname "$0")/.."
    . scripts/lib/settings.sh
    version="local-$(date +%Y%m%d%H%M%S)"
    make_signing_key "$key"
    publish_release "$key" "$version"
    set_setting JOURNAL_SERVER_ORIGIN "$origin"
    set_setting JOURNAL_RELEASE "$version"
    docker compose -p agent-journal-6 restart app queue drivers >/dev/null
    echo "release $version is published. Switch on Connect projects on other machines in Settings once, then make an install line at $origin/connections"
}

# The key lives outside the repository and is made once.
make_signing_key() {
    [ -f "$1" ] && return
    mkdir -p "$(dirname "$1")"
    openssl genpkey -algorithm ed25519 -out "$1"
    chmod 600 "$1"
}

# The app's releases volume lies over the mounted source, so the release is built aside and copied in.
publish_release() {
    local built
    built=$(mktemp -d)
    go -C tools/journal-agent run ./cmd/journal-release --version "$2" --signing-key "$1" --out "$built/$2" --module .
    docker compose -p agent-journal-6 exec -T app mkdir -p /app/storage/app/releases
    docker compose -p agent-journal-6 cp "$built/$2" "app:/app/storage/app/releases/$2"
    rm -rf "$built"
}

main "$@"
