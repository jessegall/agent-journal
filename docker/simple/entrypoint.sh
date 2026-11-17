#!/bin/bash
# Prepares the project and its journal as the user journal, then runs the journal's server on the loopback and Caddy
# in front of it with the username and password from .env; the container stops when either of them stops.
set -euo pipefail

: "${JOURNAL_USER:?set JOURNAL_USER in .env}"
: "${JOURNAL_PASSWORD:?set JOURNAL_PASSWORD in .env}"
PROJECT=/data/project
ROOT="$PROJECT/.journal"

mkdir -p /data/home "$PROJECT" /data/caddy
chown journal:journal /data/home "$PROJECT"
AS_JOURNAL=(setpriv --reuid journal --regid journal --init-groups env -C "$PROJECT" HOME=/data/home)

"${AS_JOURNAL[@]}" bash -eu <<'SETUP'
git config --global user.name "${GIT_NAME:-Journal on a server}"
git config --global user.email "${GIT_EMAIL:-journal@localhost}"
if [ -n "${GITHUB_TOKEN:-}" ]; then
    # The token stays in the environment, never in .git/config.
    git config --global credential.https://github.com.helper '!f() { echo username=x-access-token; echo "password=$GITHUB_TOKEN"; }; f'
fi
if [ ! -d /data/project/.git ]; then
    if [ -n "${GIT_REPOSITORY:-}" ] && [ -z "$(ls -A /data/project)" ]; then
        git clone --quiet "$GIT_REPOSITORY" /data/project
    else
        git -C /data/project init --quiet
    fi
fi
# Claude Code's first-run questions have no one to answer them here; its login comes from .env.
[ -f "$HOME/.claude.json" ] || printf '{"hasCompletedOnboarding": true, "theme": "dark"}\n' > "$HOME/.claude.json"
# The installer of version 4 installs or upgrades the journal in the project, from the code in the image.
sh /opt/agent-journal/install.sh < /dev/null
SETUP

JOURNAL_PASSWORD_HASH="$(caddy hash-password --plaintext "$JOURNAL_PASSWORD")"
export JOURNAL_PASSWORD_HASH
unset JOURNAL_PASSWORD

"${AS_JOURNAL[@]}" JOURNAL_ROOT="$PROJECT" JOURNAL_PORT=8421 "$(cat "$ROOT/python")" "$ROOT/src/journal.py" serve &
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
wait -n
exit 1
