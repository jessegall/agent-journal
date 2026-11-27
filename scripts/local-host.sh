#!/bin/sh
# Sets up the contained agent host on this machine as docs/accounts/contained-installation.md does on a server; safe
# to run again.   sh scripts/local-host.sh [--fresh]   (--fresh first removes the containers, database and enrolment)
set -eu

main() {
    local architecture suffix images fresh=false
    cd "$(dirname "$0")/.."
    . scripts/lib/settings.sh
    . scripts/lib/templates.sh
    [ -f .env ] || { echo "Copy .env.example to .env first." >&2; exit 1; }
    [ "${1:-}" = --fresh ] && fresh=true
    architecture="linux/$(docker info --format '{{.Architecture}}' | sed 's/x86_64/amd64/; s/aarch64/arm64/')"
    suffix=$(echo "$architecture" | tr / -)
    images=$(read_image_settings)
    build_changed_images "$architecture" "$suffix"
    write_contained_settings "$suffix"
    $fresh && remove_local_installation
    sh scripts/dev-watch-host.sh --once
    start_database "$fresh"
    forget_unknown_host
    enroll_host
    start_services
    [ "$images" = "$(read_image_settings)" ] || recreate_app_services
}

# The images the services run, as .env names them.
read_image_settings() {
    grep -E '^(AGENT_IMAGE|RUNNER_IMAGE)=' .env || true
}

# A service keeps the settings it was created with, so each one that runs the application image starts again on the new.
recreate_app_services() {
    docker compose up -d --wait --force-recreate app queue scheduler ticker reverb drivers
}

# An image is built again only when what goes into it changed, committed or not.
build_changed_images() {
    local name state
    for name in agent runner; do
        state=$(read_source_state "$name")
        if [ ! -f "images/$name-$2.tar" ] || [ "$(cat "images/$name-$2.source" 2>/dev/null)" != "$state" ]; then
            sh .docker/helper/build.sh "$1" "$name"
            printf '%s\n' "$state" > "images/$name-$2.source"
        fi
    done
}

# Locally the Go programs and the app's PHP come from the checkout (compose.override.yaml), so an image follows only
# what the checkout cannot replace: its Dockerfile, its packages and the drivers' pins.
read_source_state() {
    case "$1" in
        agent) read_image_inputs .docker/helper ;;
        runner) read_image_inputs .docker/app composer.json composer.lock ;;
    esac
}

# The paths named, as git would commit them now.
read_image_inputs() {
    local index
    index=$(mktemp)
    cp "$(git rev-parse --git-path index)" "$index"
    env GIT_INDEX_FILE="$index" git add -A -- "$@"
    env GIT_INDEX_FILE="$index" git ls-files -s -- "$@" | shasum -a 256
    rm -f "$index"
}

write_contained_settings() {
    set_setting COMPOSE_PROFILES contained
    set_setting AGENTS_ARRANGEMENT contained
    set_setting AGENTS_INSTALLATION_NAME local
    set_setting ACCOUNTS_ROOT /srv/journal/accounts
    set_setting AGENT_DAEMON_IMAGE docker:28-dind
    set_setting AGENT_DAEMON_DATA /var/lib/docker
    set_setting AGENT_DAEMON_SOCKET_GROUP 1000
    mkdir -p "$HOME/.agent-journal-6/workspaces/main"
    set_setting AGENTS_WORKSPACES_FOLDER "$HOME/.agent-journal-6/workspaces"
    set_setting AGENTS_WORKSPACES '{"main":{"folder":"main"}}'
    set_setting AGENTS_SESSION_JOURNAL_URL "http://host.docker.internal:${APP_PORT:-54700}"
    set_setting AGENT_IMAGE "$(read_image_pin agent "$1")"
    set_setting RUNNER_IMAGE "$(read_image_pin runner "$1")"
}

# An image's pin is the id the agent daemon gives it once loaded, read from the saved archive.
read_image_pin() {
    tar -xOf "images/$1-$2.tar" manifest.json | python3 .docker/helper/image-id.py
}

remove_local_installation() {
    docker compose down --volumes --remove-orphans
    forget_enrolment
}

forget_enrolment() {
    sed -i.before-local-host '/^AGENTS_HOST_ID=/d' .env
    rm -f .env.before-local-host secrets/journal_host_secret
}

start_database() {
    docker compose up -d --wait app
    docker compose exec -T app php artisan migrate --force
    $1 && docker compose exec -T app php artisan db:seed --force
    sh scripts/prepare-hook-test-database.sh
}

# A database made again no longer knows the enrolled host, and would refuse its secret on every call.
forget_unknown_host() {
    local host answer
    host=$(read_setting AGENTS_HOST_ID)
    [ -n "$host" ] || return 0
    answer=$(docker compose exec -T app php artisan tinker --execute \
        "$(fill_template scripts/local-host/host-known.php host="$host")")
    case "$answer" in
        *known*) return 0 ;;
        *gone*) ;;
        # An answer that is neither keeps the host and its state: forgetting it on an error would destroy them.
        *) echo "Could not tell whether the database knows host $host: $answer" >&2; exit 1 ;;
    esac
    echo "The database no longer knows host $host: enrolling the host again."
    docker compose rm --stop --force agent-host accounts agent-host-enroll
    docker volume rm --force "$(docker compose config | sed -n 's/^name: //p')_host-state"
    forget_enrolment
}

# The host is enrolled once: its id lives in .env and its secret in secrets/.
enroll_host() {
    local enrolment host
    grep -q '^AGENTS_HOST_ID=.' .env && [ -s secrets/journal_host_secret ] && return 0
    enrolment=$(docker compose exec -T app php artisan agents:host-enroll local --contained --root /workspace)
    host=$(printf '%s\n' "$enrolment" | sed -n 's/^Host \([^ ]*\) is enrolled.*/\1/p')
    [ -n "$host" ] || { echo "The host enrolment printed no host id." >&2; exit 1; }
    mkdir -p secrets
    (umask 077 && printf '%s\n' "$enrolment" | tail -n 1 > secrets/journal_host_secret)
    set_setting AGENTS_HOST_ID "$host"
}

start_services() {
    docker compose up -d --wait
    docker compose exec -T app php artisan profile:activate
    docker compose exec -T app php artisan agents:install
    echo "The local host is enrolled and running."
    echo "To reload the host on every Go change, run: sh scripts/dev-watch-host.sh"
}

main "$@"
