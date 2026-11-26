#!/bin/sh
# Runs the installation scenarios against this machine's real Docker, never from composer test: a first install of
# the branch, its services booting, a stopped service healed, and an update with nothing new that changes nothing.
#   sh scripts/installation-suite.sh [branch]   (the branch's newest commit of this checkout, version-6 by default)
set -eu

main() {
    local checkout branch folder
    checkout=$(cd "$(dirname "$0")/.." && pwd)
    branch=${1:-version-6}
    folder=$(make_installation "$checkout")
    trap 'remove_installation "$folder"' EXIT
    run_updater "$checkout" "$folder" "$branch" update.sh
    check_services_run "$folder"
    stop_service "$folder" queue
    run_updater "$checkout" "$folder" "$branch" heal.sh
    check_services_run "$folder"
    check_update_changes_nothing "$checkout" "$folder" "$branch"
    echo "The installation scenarios passed against the real Docker."
}

# A fresh installation folder with its own compose project, so the running journal of this machine is never touched.
make_installation() {
    local checkout="$1"
    local folder
    folder=$(mktemp -d "${TMPDIR:-/tmp}/journal-suite-XXXXXX")
    mkdir -p "$folder/root" "$folder/state"
    cp "$checkout/tests/Support/Installation/installation.env" "$folder/root/.env"
    cp "$checkout/.docker/updater/loop.sh" "$folder/state/journal-updater"
    echo "$folder"
}

run_updater() {
    local checkout="$1"
    local folder="$2"
    local branch="$3"
    local script="$4"
    (cd "$folder/root" && exec env "COMPOSE_PROJECT_NAME=$(basename "$folder")" "JOURNAL_ROOT=$folder/root" \
        "JOURNAL_BRANCH=$branch" "JOURNAL_REPOSITORY=$checkout" "JOURNAL_UPDATER_STATE=$folder/state" \
        "JOURNAL_UPDATER_LOOP=$folder/state/journal-updater" "JOURNAL_HEAL_PAUSE_SECONDS=0" \
        sh "$checkout/.docker/updater/$script")
}

# Every service of the installation runs, and each with a health check is healthy.
check_services_run() {
    local folder="$1"
    local stopped
    stopped=$(compose "$folder" ps --all --format '{{.Service}} {{.State}} {{.Health}}' \
        | awk '$2 != "running" && $2 != "exited" || ($3 != "" && $3 != "healthy")')
    [ -z "$stopped" ] || { echo "Services not running: $stopped" >&2; return 1; }
}

stop_service() {
    local folder="$1"
    local service="$2"
    compose "$folder" stop "$service" >/dev/null
}

# A second update of the same commit installs nothing: the installed commit and every container stay as they were.
check_update_changes_nothing() {
    local checkout="$1"
    local folder="$2"
    local branch="$3"
    local before after
    before=$(compose "$folder" ps -q | sort)
    run_updater "$checkout" "$folder" "$branch" update.sh
    after=$(compose "$folder" ps -q | sort)
    [ "$before" = "$after" ] || { echo "An update with nothing new replaced containers." >&2; return 1; }
}

compose() {
    local folder="$1"
    shift
    (cd "$folder/root" && docker compose --project-name "$(basename "$folder")" "$@")
}

remove_installation() {
    local folder="$1"
    compose "$folder" down --volumes --remove-orphans >/dev/null 2>&1 || true
    rm -rf "$folder"
}

main "$@"
