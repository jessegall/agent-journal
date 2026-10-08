#!/bin/sh
# Deploys a new journal image only once cosign has verified that this repository's release workflow signed it,
# and runs exactly the digest it verified.
set -eu
IMAGE="${JOURNAL_IMAGE_NAME:-ghcr.io/jessegall/agent-journal}"
SIGNER="${JOURNAL_SIGNER:-^https://github.com/jessegall/agent-journal/\.github/workflows/docker-image\.yml@refs/tags/v}"
ISSUER="https://token.actions.githubusercontent.com"
cd /compose
while true; do
    if verified="$(cosign verify --certificate-identity-regexp "$SIGNER" --certificate-oidc-issuer "$ISSUER" "$IMAGE:latest" 2>/dev/null)"; then
        digest="$(printf '%s' "$verified" | sed -n 's/.*"docker-manifest-digest":"\(sha256:[0-9a-f]*\)".*/\1/p' | head -1)"
        running="$(docker inspect --format '{{.Config.Image}}' "$(docker compose ps -q journal)" 2>/dev/null || true)"
        if [ -n "$digest" ] && [ "$running" != "$IMAGE@$digest" ]; then
            echo "deploying $IMAGE@$digest, signed by the release workflow"
            JOURNAL_IMAGE="$IMAGE@$digest" docker compose up -d --no-deps --pull always journal
        fi
    else
        echo "$IMAGE:latest carries no signature from the release workflow, so nothing is deployed"
    fi
    [ "${UPDATE_ONCE:-}" = "1" ] && exit 0
    sleep "${UPDATE_EVERY:-3600}"
done
