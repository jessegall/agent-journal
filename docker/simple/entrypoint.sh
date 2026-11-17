#!/bin/bash
# Prepares the project and its journal as the user journal, then runs the journal's server on the loopback and Caddy,
# as the user caddy, in front of it with the username and password from .env; the container stops when either stops.
# Root only reads .env, hashes the password and hands each user what it needs: the journal and its agents never see
# the password or its hash, and root never writes inside a folder the journal owns.
set -euo pipefail

: "${JOURNAL_USER:?set JOURNAL_USER in .env}"
: "${JOURNAL_PASSWORD:?set JOURNAL_PASSWORD in .env}"
[ "${#JOURNAL_PASSWORD}" -ge 12 ] || { echo "JOURNAL_PASSWORD needs 12 characters or more" >&2; exit 1; }
# The login goes over https to the domain; plain http, which sends the password readable, is only for a test on a
# private network, and only when asked for by name.
if [ -z "${JOURNAL_ADDRESS:-}" ]; then
    [ "${JOURNAL_PLAIN_HTTP:-}" = "1" ] || { echo "set JOURNAL_ADDRESS in .env to the server's domain, or JOURNAL_PLAIN_HTTP=1 for a test on a private network" >&2; exit 1; }
    JOURNAL_ADDRESS=":8080"
fi
# The hash is made before anything runs as another user, from standard input, so the password is on no command line.
PASSWORD_HASH="$(printf '%s\n' "$JOURNAL_PASSWORD" | caddy hash-password)"
unset JOURNAL_PASSWORD
PROJECT=/data/project
ROOT="$PROJECT/.journal"

mkdir -p /data/home "$PROJECT" /data/caddy
chown journal:journal /data/home "$PROJECT"
# only the top folder: caddy makes and owns what is inside, which root without privileges may not even read
chown caddy:caddy /data/caddy
# The journal and its agents get only these variables; gh reads the same GitHub token git uses.
JOURNAL_ENV=(env -i PATH=/usr/local/bin:/usr/bin:/bin HOME=/data/home USER=journal SHELL=/bin/bash TERM=xterm-256color LANG=C.UTF-8 PYTHONDONTWRITEBYTECODE=1
    GIT_NAME="${GIT_NAME:-Journal on a server}" GIT_EMAIL="${GIT_EMAIL:-journal@localhost}" GIT_REPOSITORY="${GIT_REPOSITORY:-}"
    GITHUB_TOKEN="${GITHUB_TOKEN:-}" GH_TOKEN="${GITHUB_TOKEN:-}"
    CLAUDE_CODE_OAUTH_TOKEN="${CLAUDE_CODE_OAUTH_TOKEN:-}" ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}")
AS_JOURNAL=(setpriv --reuid journal --regid journal --init-groups --no-new-privs "${JOURNAL_ENV[@]}")

# A record sent by send-journal.sh is handed to the journal user, which takes it in itself.
IMPORTING=0
if [ -f /data/import/journal.db ]; then
    chown -R -P journal:journal /data/import
    IMPORTING=1
fi

"${AS_JOURNAL[@]}" IMPORTING="$IMPORTING" bash -eu <<'SETUP'
cd /data/project
git config --global user.name "$GIT_NAME"
git config --global user.email "$GIT_EMAIL"
if [ -n "$GITHUB_TOKEN" ]; then
    # The token stays in the environment, never in .git/config.
    git config --global credential.https://github.com.helper '!f() { echo username=x-access-token; echo "password=$GITHUB_TOKEN"; }; f'
fi
if [ ! -d .git ]; then
    if [ -n "$GIT_REPOSITORY" ] && [ -z "$(ls -A .)" ]; then
        git clone --quiet "$GIT_REPOSITORY" .
    else
        git init --quiet
    fi
fi
# Claude Code's first-run questions have no one to answer them here; its login comes from .env.
[ -f "$HOME/.claude.json" ] || printf '{"hasCompletedOnboarding": true, "theme": "dark"}\n' > "$HOME/.claude.json"
# The installer of version 4 installs or upgrades the journal in the project, from the code in the image.
sh /opt/agent-journal/install.sh < /dev/null
if [ "$IMPORTING" = 1 ]; then
    # The record sent replaces the one here; the one it replaces is kept beside it.
    [ ! -f .journal/journal.db ] || mv .journal/journal.db .journal/journal.db.before-import
    rm -f .journal/journal.db-wal .journal/journal.db-shm
    cp /data/import/journal.db .journal/journal.db
    [ ! -f /data/import/project-id ] || cp /data/import/project-id .journal/project-id
    if [ -d /data/import/readers ]; then rm -rf .journal/readers && cp -R /data/import/readers .journal/readers; fi
    find /data/import -mindepth 1 -delete
    # The installer upgrades the record it took in to the code in this image.
    sh /opt/agent-journal/install.sh < /dev/null
    echo "took in the journal record sent by send-journal.sh"
fi
SETUP
[ "$IMPORTING" = 0 ] || rmdir /data/import

"${AS_JOURNAL[@]}" JOURNAL_ROOT="$PROJECT" JOURNAL_PORT=8421 "$(cat "$ROOT/python")" "$ROOT/src/journal.py" serve &
# Caddy listens on 8080 and 8443 inside the container, which compose publishes as 80 and 443, so it needs no privilege.
setpriv --reuid caddy --regid caddy --init-groups --no-new-privs env -i PATH=/usr/bin:/bin HOME=/data/caddy \
    XDG_DATA_HOME=/data/caddy XDG_CONFIG_HOME=/data/caddy/config JOURNAL_ADDRESS="$JOURNAL_ADDRESS" \
    JOURNAL_USER="$JOURNAL_USER" JOURNAL_PASSWORD_HASH="$PASSWORD_HASH" caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
wait -n
exit 1
