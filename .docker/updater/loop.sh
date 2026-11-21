#!/bin/sh
# Every minute: fetch update.sh of the branch's newest commit from the repository and run it. The script is fetched by
# commit, never by branch name, since a cache can serve a branch's file stale for minutes after a push. A failed fetch
# or run is logged and tried again a minute later.
set -u
project=${JOURNAL_REPOSITORY%.git}
project=${project#https://github.com/}
while :; do
    newest=$(git ls-remote "$JOURNAL_REPOSITORY" "refs/heads/$JOURNAL_BRANCH" | cut -f1)
    raw="https://raw.githubusercontent.com/$project/$newest/.docker/updater/update.sh"
    if [ -n "$newest" ] && curl -fsSL "$raw" -o /tmp/update.sh; then
        sh /tmp/update.sh || true
    else
        echo "$(date -u +%FT%TZ) could not fetch update.sh of $JOURNAL_BRANCH ($newest)"
    fi
    sleep 60
done
