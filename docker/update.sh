#!/bin/sh
# Deploys a new journal image only once cosign has verified that this repository's release workflow signed it,
# and runs exactly the digest it verified. A running journal is upgraded only when its owner asks in the viewer;
# the owner can also take it down, which stops it after a final backup and leaves its data restorable.
set -eu
IMAGE="${JOURNAL_IMAGE_NAME:-ghcr.io/jessegall/agent-journal}"
SIGNER="${JOURNAL_SIGNER:-^https://github.com/jessegall/agent-journal/\.github/workflows/docker-image\.yml@refs/tags/v}"
ISSUER="https://token.actions.githubusercontent.com"
STATE="${JOURNAL_UPDATER_STATE:-/data/updater}"
REQUESTS="${JOURNAL_REQUESTS:-/data/vault/*/hosting-request.json}"
cd /compose
mkdir -p "$STATE"
chmod 755 "$STATE"

asked() {
    for request in $REQUESTS; do
        [ -f "$request" ] && grep -q "\"asked\": *\"$1\"" "$request" && { rm -f "$request"; return 0; }
    done
    return 1
}

running_image() {
    journal="$(docker ps -q --filter "label=com.docker.compose.project=$COMPOSE_PROJECT_NAME" --filter label=com.docker.compose.service=journal)"
    [ -n "$journal" ] && docker inspect --format '{{.Config.Image}}' $journal 2>/dev/null || true
}

write_status() {
    printf '{"latest": "%s", "newer": %s}\n' "$1" "$2" > "$STATE/status.json.new"
    chmod 644 "$STATE/status.json.new"
    mv "$STATE/status.json.new" "$STATE/status.json"
}

take_down() {
    : > "$STATE/down"
    echo "taking the journal down: stopping it, then a final backup"
    docker compose stop journal
    docker compose run --rm -e BACKUP_ONCE=1 -e BACKUP_TAG=final backup \
        || echo "the final backup failed; the journal's data stays in its volume"
}

verify() {
    verified="$(cosign verify --certificate-identity-regexp "$SIGNER" --certificate-oidc-issuer "$ISSUER" "$IMAGE:latest" 2>/dev/null)" || return 1
    digest="$(printf '%s' "$verified" | sed -n 's/.*"docker-manifest-digest":"\(sha256:[0-9a-f]*\)".*/\1/p' | head -1)"
    version="$(printf '%s' "$verified" | sed -n 's/.*@refs\/tags\/v\([0-9][0-9.]*\)".*/\1/p' | head -1)"
    [ -n "$digest" ]
}

check_and_deploy() {
    upgrade_asked="$1"
    if ! verify; then
        echo "$IMAGE:latest carries no signature from the release workflow, so nothing is deployed"
        return
    fi
    running="$(running_image)"
    newer=false
    [ "$running" != "$IMAGE@$digest" ] && newer=true
    write_status "$version" "$([ -n "$running" ] && echo "$newer" || echo false)"
    [ -e "$STATE/down" ] && return
    if [ -z "$running" ] || { [ "$newer" = true ] && [ "$upgrade_asked" = yes ]; }; then
        echo "deploying $IMAGE@$digest, signed by the release workflow"
        JOURNAL_IMAGE="$IMAGE@$digest" docker compose --profile journal up -d --no-deps --pull always journal
        write_status "$version" false
    fi
}

since=0
while true; do
    if asked take-down; then
        take_down
    fi
    upgrade_asked=no
    asked upgrade && upgrade_asked=yes
    if [ "$since" -le 0 ] || [ "$upgrade_asked" = yes ]; then
        check_and_deploy "$upgrade_asked"
        [ "$since" -le 0 ] && since="${UPDATE_EVERY:-3600}"
    fi
    [ "${UPDATE_ONCE:-}" = "1" ] && exit 0
    sleep "${UPDATE_POLL:-5}"
    since=$((since - ${UPDATE_POLL:-5}))
done
