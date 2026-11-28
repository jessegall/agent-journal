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
        play_scenario "$owner" "$scenario" || stop_at_failure "$scenario"
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
    echo "sh scripts/local-host.sh; touch storage/recordings/.enabled"
    for scenario in $2; do
        echo "docker compose exec app php -d memory_limit=$PLAY_MEMORY artisan recordings:play $scenario --owner=$1"
    done
    echo "rm -f storage/recordings/.enabled"
}

# A failed play stops the run at once with the one line the play wrote on why.
stop_at_failure() {
    echo "The scenario $1 was not recorded; its earlier recording stays: $(cat storage/recordings/last-failure.txt 2>/dev/null)" >&2
    exit 1
}

# The running journal reads the switch file at each play, so switching restarts nothing; the local host is set up only
# when it does not run yet, so a rerun goes straight to its scenarios.
switch_recording_on() {
    is_host_running || sh scripts/local-host.sh
    touch storage/recordings/.enabled
}

is_host_running() {
    [ "$(docker compose ps --status running --quiet agent-host 2>/dev/null)" != "" ]
}

switch_recording_off() {
    rm -f storage/recordings/.enabled
}

# The play runs in the journal's container, which holds no Docker, so the machine changes it asks for run here.
play_scenario() {
    local watcher status=0 connection_scratch
    connection_scratch=$(make_scratch_folder) || return 1
    run_machine_changes "$connection_scratch" &
    watcher=$!
    docker compose exec $(read_terminal_flag) app php -d memory_limit="$PLAY_MEMORY" artisan recordings:play "$2" \
        --owner="$1" || status=$?
    kill "$watcher" 2>/dev/null || true
    if [ -n "$connection_scratch" ]; then
        stop_recorded_project "$connection_scratch" || status=1
        if [ "$status" -eq 0 ]; then
            remove_recorded_project "$connection_scratch" || status=1
        else
            printf 'The failed recording kept its scratch folder at %s.\n' "$connection_scratch" >&2
        fi
    fi
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
            run_machine_change "$request" "$1"
        fi
        sleep 1
    done
}

# The change's program line is one argument to a line of its request file.
run_machine_change() {
    local status=0 argument connection_scratch=$2
    set -- "$1"
    while IFS= read -r argument; do
        set -- "$@" "$argument"
    done < "$1"
    rm -f "$1"
    shift
    case "$1" in
        connect-recorded-project)
            connect_recorded_project "$connection_scratch" "$2" "$3" || status=$?
            ;;
        start-recorded-terminal)
            start_recorded_terminal "$connection_scratch" "$2" "$3" "$4" || status=$?
            ;;
        *) "$@" || status=$? ;;
    esac
    printf '%s\n' "$status" > storage/recordings/drafts/machine-change.done
}

connect_recorded_project() {
    [ -n "$1" ] || return 1
    docker compose exec -T app cat /app/storage/recordings/drafts/connection-ticket |
        sh programs/runner/scripts/install-relay.sh --for-recording "$1" "$2" "$3" "$PWD/scripts/record-project-relay.py"
}

start_recorded_terminal() {
    local scratch="$1" installation
    installation=$(cat "$scratch/installation") || return 1
    [ -x "$installation/bin/journal-terminal" ] || return 1
    python3 scripts/record-project-relay.py terminal "$scratch/project" "$scratch/terminal.pid" \
        "$installation/bin/journal-terminal" --state "$scratch/state" --model "$3" --effort "$4" "$2" \
        > "$scratch/terminal.log" 2>&1 &
}

stop_recorded_project() {
    if [ -f "$1/terminal.pid" ]; then
        kill "$(cat "$1/terminal.pid")" 2>/dev/null || true
    fi
    python3 scripts/record-project-relay.py stop "$1/state"
}

remove_recorded_project() {
    # An installed release is read-only, as the installer leaves it.
    chmod -R u+w "$1" && rm -rf "$1"
}

# The installer refuses a folder reached through a link, and macOS's temporary folder lies under the link /var.
make_scratch_folder() {
    local folder
    folder=$(mktemp -d) || return 1
    cd "$folder" && pwd -P
}

main "$@"
