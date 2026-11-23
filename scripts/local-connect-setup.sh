#!/bin/sh
# Lets the local Docker journal hand out install lines a folder on this Mac can use, so connecting a folder and starting
# an agent in it can be tried end to end without the test server: it makes a release signing key outside the
# repository once, builds and signs a release of this checkout into the app's releases folder, names this Mac's plain http
# address as the server origin and that release in .env and restarts the app. Run it
# again after changing the host or the relay; it adds a new release each time. Then open http://localhost:54700/connections and make an install line.
set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
compose="docker compose -p agent-journal-6"
key="$HOME/.journal-release/local.key"
origin=${JOURNAL_LOCAL_ORIGIN:-http://localhost:54700}

if [ ! -f "$key" ]; then
    mkdir -p "$(dirname "$key")"
    openssl genpkey -algorithm ed25519 -out "$key"
    chmod 600 "$key"
fi

# The app reads releases from its releases volume, which lies over the mounted source, so the release is built in a
# temporary folder and copied into the running app.
version="local-$(date +%Y%m%d%H%M%S)"
built=$(mktemp -d)
trap 'rm -rf "$built"' EXIT
go -C "$root/tools/journal-agent" run ./cmd/journal-release \
    --version "$version" --signing-key "$key" --out "$built/$version" --module .
$compose exec -T app mkdir -p /app/storage/app/releases
$compose cp "$built/$version" "app:/app/storage/app/releases/$version"

set_env() {
    if grep -q "^$1=" "$root/.env"; then
        sed -i '' "s|^$1=.*|$1=$2|" "$root/.env"
    else
        printf '%s=%s\n' "$1" "$2" >> "$root/.env"
    fi
}
set_env JOURNAL_SERVER_ORIGIN "$origin"
set_env JOURNAL_RELEASE "$version"

$compose restart app queue >/dev/null
echo "release $version is published. Switch on Connect projects on other machines in Settings once, then make an install line at $origin/connections"
