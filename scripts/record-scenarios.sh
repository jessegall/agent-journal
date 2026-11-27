#!/bin/sh
# Records scenarios on the local journal: recording on, each scenario played as the owner, recording off again.
# Usage: sh scripts/record-scenarios.sh --owner=<email> [--dry-run] [<driver>/<scenario> ...]   (every one when none)
set -eu

# A play's finisher holds the whole run with its faked copies, more than PHP's default allows for a long one.
PLAY_MEMORY=512M

main() {
    local owner dry_run scenarios scenario
    cd "$(dirname "$0")/.."
    . scripts/lib/settings.sh
    owner=$(read_owner "$@")
    dry_run=$(read_dry_run "$@")
    scenarios=$(list_scenarios "$@")
    [ -n "$owner" ] || { echo "Name the owner the scenarios run as: --owner=<email>." >&2; exit 2; }
    if [ "$dry_run" = true ]; then
        print_plan "$owner" "$scenarios"
        return
    fi
    trap switch_recording_off EXIT
    switch_recording_on
    for scenario in $scenarios; do
        play_scenario "$owner" "$scenario" || echo "The scenario $scenario was not recorded; its earlier recording stays." >&2
    done
}

read_owner() {
    local argument
    for argument in "$@"; do
        case "$argument" in --owner=*) printf '%s\n' "${argument#--owner=}" ;; esac
    done
}

read_dry_run() {
    case " $* " in *" --dry-run "*) echo true ;; *) echo false ;; esac
}

# The scenarios named, a driver's folder named as driver/* included, or every scenario file when none is named.
list_scenarios() {
    local argument file named=""
    for argument in "$@"; do
        case "$argument" in --*) ;; *) named="$named $argument" ;; esac
    done
    [ -n "$named" ] || named="*/*"
    set -f
    for argument in $named; do
        set +f
        for file in resources/recordings/scenarios/$argument.json; do
            if [ -f "$file" ]; then
                printf '%s\n' "${file#resources/recordings/scenarios/}" | sed 's/\.json$//'
            fi
        done
    done
}

print_plan() {
    local scenario
    echo "set_setting AGENTS_RECORDING true; sh scripts/local-host.sh"
    for scenario in $2; do
        echo "docker compose exec app php -d memory_limit=$PLAY_MEMORY artisan recordings:play $scenario --owner=$1"
    done
    echo "set_setting AGENTS_RECORDING false; sh scripts/local-host.sh"
}

switch_recording_on() {
    set_setting AGENTS_RECORDING true
    sh scripts/local-host.sh
}

# Off needs no build: the services that read the setting start again with it.
switch_recording_off() {
    set_setting AGENTS_RECORDING false
    docker compose up -d --wait --force-recreate --no-deps app queue scheduler ticker reverb drivers agent-host
}

# The play runs in the journal's container, which holds no Docker, so the machine changes it asks for run here.
play_scenario() {
    local watcher status=0
    run_machine_changes &
    watcher=$!
    docker compose exec $(read_terminal_flag) app php -d memory_limit="$PLAY_MEMORY" artisan recordings:play "$2" \
        --owner="$1" || status=$?
    kill "$watcher" 2>/dev/null || true
    restore_daemon
    return "$status"
}

# A play stopped part-way can leave the agents' Docker daemon down, which the next scenario needs running.
restore_daemon() {
    docker compose up -d --wait agent-docker >/dev/null
}

# An ask-user step reads your terminal when there is one; without one the play's lines still reach the log.
read_terminal_flag() {
    [ -t 0 ] || echo -T
}

run_machine_changes() {
    local request=storage/recordings/drafts/machine-change.args
    while true; do
        if [ -f "$request" ]; then
            run_machine_change "$request"
        fi
        sleep 1
    done
}

# The change's program line is one argument to a line of its request file.
run_machine_change() {
    local status=0 argument
    set -- "$1"
    while IFS= read -r argument; do
        set -- "$@" "$argument"
    done < "$1"
    rm -f "$1"
    shift
    "$@" || status=$?
    printf '%s\n' "$status" > storage/recordings/drafts/machine-change.done
}

main "$@"
