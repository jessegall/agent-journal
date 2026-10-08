#!/bin/sh
# Starts the journal on a server: the project checkout, the journal installed into it, and its server in the foreground.
set -eu
umask 077

: "${JOURNAL_ADDRESS:?set JOURNAL_ADDRESS in .env to the server's own domain}"
PROJECT="${JOURNAL_PROJECT:-/data/project}"
mkdir -p "$HOME" "$PROJECT"

if [ -n "${GIT_REPOSITORY:-}" ] && [ ! -d "$PROJECT/.git" ] && [ -z "$(ls -A "$PROJECT")" ]; then
    git clone --quiet "$GIT_REPOSITORY" "$PROJECT"
fi
git config --global user.name "${GIT_NAME:-Journal on a server}"
git config --global user.email "${GIT_EMAIL:-journal@localhost}"
if [ -n "${GITHUB_TOKEN:-}" ]; then
    # The token stays in the environment; git reads it from there on each push.
    git config --global credential.https://github.com.helper '!f() { echo username=x-access-token; echo "password=$GITHUB_TOKEN"; }; f'
fi

mkdir -p "$PROJECT/.claude"
# Claude's first-run questions have no one to answer them on a server; its login comes from .env.
[ -f "$HOME/.claude.json" ] || printf '{"hasCompletedOnboarding": true, "theme": "dark"}\n' > "$HOME/.claude.json"
AGENT_JOURNAL_BOOTSTRAPPED=1 python3 /opt/agent-journal/src/install.py upgrade "$PROJECT" >/dev/null
hosted-journal prepare --address "$JOURNAL_ADDRESS" --listen 0.0.0.0 --port 8440

exec python3 "$PROJECT/.journal/journal.py" --root "$PROJECT/.journal" serve --port 8421
