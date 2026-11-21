#!/bin/sh
# Every minute: fetch the newest update.sh of the branch from the repository and run it. A failed fetch or run is
# logged and tried again a minute later.
set -u
raw=${JOURNAL_REPOSITORY%.git}
raw="https://raw.githubusercontent.com/${raw#https://github.com/}/${JOURNAL_BRANCH}/.docker/updater/update.sh"
while :; do
    if curl -fsSL "$raw" -o /tmp/update.sh; then
        sh /tmp/update.sh || true
    else
        echo "$(date -u +%FT%TZ) could not fetch $raw"
    fi
    sleep 60
done
