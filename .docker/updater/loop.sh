#!/bin/sh
# The updater's loop: every minute it fetches update.sh of the branch's newest commit and runs it.
# A failed fetch or run is logged and tried again a minute later.
set -u

main() {
    trap 'exit 0' TERM INT
    while :; do
        update_once
        pause
    done
}

# Waiting in the background lets a stop end the loop at once instead of after the minute.
pause() {
    sleep 60 &
    wait $!
}

update_once() {
    local newest fetched
    newest=$(git ls-remote "$JOURNAL_REPOSITORY" "refs/heads/$JOURNAL_BRANCH" | cut -f1)
    fetched=${JOURNAL_UPDATER_STATE:-/tmp}/update.sh
    if [ -n "$newest" ] && curl -fsSL "$(update_script_url "$newest")" -o "$fetched"; then
        sh "$fetched" || true
    else
        echo "$(date -u +%FT%TZ) could not fetch update.sh of $JOURNAL_BRANCH ($newest)"
    fi
}

# The script is fetched by commit, never by branch name: a cache can serve a branch's file stale for minutes.
update_script_url() {
    local project=${JOURNAL_REPOSITORY%.git}
    echo "https://raw.githubusercontent.com/${project#https://github.com/}/$1/.docker/updater/update.sh"
}

main "$@"
