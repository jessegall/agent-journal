#!/bin/sh
# The updater's supervisor: brings back each service that stopped or turned unhealthy and each one-shot step that
# failed, a few tries each with a growing pause, and writes what it could not heal to storage/installation/faults.
set -eu

main() {
    local root state faults
    root=${JOURNAL_ROOT:?the updater names the installation folder}
    state=${JOURNAL_UPDATER_STATE:-/var/lib/journal-updater}/heal
    cd "$root"
    [ -f .installed-commit ] || exit 0
    . scripts/lib/settings.sh
    mkdir -p "$state" storage/installation
    faults=$(find_faults "$state")
    forget_healed "$faults" "$state"
    heal_faults "$faults" "$state"
    write_unhealed "$state"
}

# One line for each service that is not as it should be: its name, service or step, and the plain reason.
find_faults() {
    docker compose $(compose_profiles) ps --all --format json > "$1/containers.json"
    docker compose $(compose_profiles) config --format json | python3 .docker/updater/service-faults.py "$1/containers.json"
}

# A service that came back by itself starts with a clean count.
forget_healed() {
    local tries service
    for tries in "$2"/*.tries; do
        [ -f "$tries" ] || continue
        service=$(basename "$tries" .tries)
        printf '%s\n' "$1" | cut -f1 | grep -qx "$service" || rm -f "$2/$service".*
    done
}

heal_faults() {
    local service kind reason
    printf '%s\n' "$1" | while IFS="$(printf '\t')" read -r service kind reason; do
        [ -z "$service" ] || heal "$service" "$kind" "$reason" "$2"
    done
}

# Tries one service again once its pause is over; the pause doubles with each failed try, and after the last try the
# fault stays for the journal to show.
heal() {
    local tries next now
    tries=$(cat "$4/$1.tries" 2>/dev/null || echo 0)
    next=$(cat "$4/$1.next" 2>/dev/null || echo 0)
    now=$(date +%s)
    printf '%s\n' "$3" > "$4/$1.reason"
    [ "$tries" -lt "$(heal_tries)" ] && [ "$now" -ge "$next" ] || return 0
    echo "$(date -u +%FT%TZ) healing $1: it $3"
    if start_again "$1" "$2"; then
        echo "$(date -u +%FT%TZ) healed $1"
        rm -f "$4/$1".*
        return 0
    fi
    echo $((tries + 1)) > "$4/$1.tries"
    echo $((now + $(heal_pause) * (1 << tries))) > "$4/$1.next"
}

heal_tries() {
    echo "${JOURNAL_HEAL_TRIES:-5}"
}

heal_pause() {
    echo "${JOURNAL_HEAL_PAUSE_SECONDS:-60}"
}

# A service is started and waited on until healthy; a step runs again in a new container and must end well.
start_again() {
    local container
    case "$2" in
        service) docker compose $(compose_profiles) up -d --wait --wait-timeout 120 "$1" ;;
        step)
            docker compose $(compose_profiles) up -d --force-recreate --no-deps "$1" &&
                container=$(docker compose $(compose_profiles) ps --all -q "$1") &&
                [ "$(docker wait "$container")" = 0 ] ;;
    esac
}

# Each service whose tries ran out, as a sentence the journal shows until it is well again.
write_unhealed() {
    local tries service
    for tries in "$1"/*.tries; do
        [ -f "$tries" ] && [ "$(cat "$tries")" -ge "$(heal_tries)" ] || continue
        service=$(basename "$tries" .tries)
        echo "The installation could not bring back $service: it $(cat "$1/$service.reason"). It stopped trying after $(heal_tries) tries; the updater's log has each try."
    done > storage/installation/faults.next
    mv storage/installation/faults.next storage/installation/faults
}

main "$@"
