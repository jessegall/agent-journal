#!/bin/sh
# Starts the journal on a server as two users: the login page as gateway, from the root-owned code in /opt,
# and the journal with its agents as journal, so no agent can read or change the login's password and logins.
set -eu
umask 007

: "${JOURNAL_ADDRESS:?set JOURNAL_ADDRESS in .env to the server's own domain}"
PROJECT="${JOURNAL_PROJECT:-/data/project}"
ROOT="$PROJECT/.journal"
AS_JOURNAL="setpriv --reuid journal --regid journal --init-groups env HOME=/data/home"
AS_GATEWAY="setpriv --reuid gateway --regid journal --init-groups env HOME=/data/gateway PYTHONPATH=/opt/agent-journal/src"

$AS_JOURNAL sh -eu <<'SETUP'
umask 007
git config --global user.name "${GIT_NAME:-Journal on a server}"
git config --global user.email "${GIT_EMAIL:-journal@localhost}"
if [ -n "${GITHUB_TOKEN:-}" ]; then
    # Set before the clone, so a private repository's token stays in the environment and never in .git/config.
    git config --global credential.https://github.com.helper '!f() { echo username=x-access-token; echo "password=$GITHUB_TOKEN"; }; f'
fi
if [ -n "${GIT_REPOSITORY:-}" ] && [ ! -d "$JOURNAL_PROJECT/.git" ] && [ -z "$(ls -A "$JOURNAL_PROJECT")" ]; then
    git clone --quiet "$GIT_REPOSITORY" "$JOURNAL_PROJECT"
fi
mkdir -p "$JOURNAL_PROJECT/.claude"
# Claude's first-run questions have no one to answer them on a server; its login comes from .env.
[ -f "$HOME/.claude.json" ] || printf '{"hasCompletedOnboarding": true, "theme": "dark"}\n' > "$HOME/.claude.json"
AGENT_JOURNAL_BOOTSTRAPPED=1 python3 /opt/agent-journal/src/install.py upgrade "$JOURNAL_PROJECT" >/dev/null
hosted-journal prepare --address "$JOURNAL_ADDRESS" --listen 0.0.0.0 --port 8440 --proxy caddy
SETUP

(
    while true; do
        $AS_GATEWAY python3 -m features.sharing.server "$ROOT" 8440 0.0.0.0 || true
        sleep 2
    done
) &
$AS_GATEWAY hosted-journal password-status

exec $AS_JOURNAL python3 "$ROOT/journal.py" --root "$ROOT" serve --port 8421
