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
# gh reads the same GitHub token git uses, so an agent opens pull requests as it does on a laptop.
export GH_TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-}}"
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

# A record sent by send-journal.sh replaces the one here before the journal starts; the one it replaces is kept beside it.
if [ -f /data/import/journal.db ]; then
    [ ! -f "$ROOT/journal.db" ] || mv "$ROOT/journal.db" "$ROOT/journal.db.before-import"
    rm -f "$ROOT/journal.db-wal" "$ROOT/journal.db-shm"
    cp /data/import/journal.db "$ROOT/journal.db"
    [ ! -f /data/import/project-id ] || cp /data/import/project-id "$ROOT/project-id"
    if [ -d /data/import/readers ]; then rm -rf "$ROOT/readers" && cp -R /data/import/readers "$ROOT/readers"; fi
    chown -R journal:journal "$ROOT"
    rm -rf /data/import
    # The installer upgrades the record it takes in to the code in this image.
    "${AS_JOURNAL[@]}" sh /opt/agent-journal/install.sh < /dev/null
    echo "took in the journal record sent by send-journal.sh"
fi

JOURNAL_PASSWORD_HASH="$(caddy hash-password --plaintext "$JOURNAL_PASSWORD")"
export JOURNAL_PASSWORD_HASH
unset JOURNAL_PASSWORD

"${AS_JOURNAL[@]}" JOURNAL_ROOT="$PROJECT" JOURNAL_PORT=8421 "$(cat "$ROOT/python")" "$ROOT/src/journal.py" serve &
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
wait -n
exit 1
