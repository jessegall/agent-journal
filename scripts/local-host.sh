#!/bin/sh
# Sets up the contained agent host on a development machine, the way docs/accounts/contained-installation.md sets it
# up on a server, so the local journal signs in accounts and starts agents with no further step. It is safe to run
# again: images already built, settings already in .env and an enrolled host are kept.
#
#   sh scripts/local-host.sh           sets up what is missing and keeps the rest
#   sh scripts/local-host.sh --fresh   first removes the local containers, the database and the host's enrolment,
#                                      for a clean demo
#
# It builds the agent and runner images for this machine's architecture, writes the contained settings into .env
# (COMPOSE_PROFILES=contained, so every later docker compose up starts the host and the sign-in service too), enrolls
# the host once and saves its secret in secrets/, starts everything and activates the built-in profiles.
set -eu
cd "$(dirname "$0")/.."

[ -f .env ] || { echo "Copy .env.example to .env first." >&2; exit 1; }

fresh=false
[ "${1:-}" = --fresh ] && fresh=true

architecture="linux/$(docker info --format '{{.Architecture}}' | sed 's/x86_64/amd64/; s/aarch64/arm64/')"
suffix=$(echo "$architecture" | tr / -)

# An image is built again only when what goes into it changed, committed or not, so no other change costs a build.
# The agent image holds its own folder and the Go programs; the runner image holds the application too, so it follows
# the whole checkout.
content_state() {
    git ls-files -co --exclude-standard -z -- "$@" | xargs -0 shasum 2>/dev/null | shasum | cut -d' ' -f1
}
for name in agent runner; do
    case "$name" in
        agent) source_state=$(content_state .docker/helper tools/journal-agent tools/journal-check) ;;
        runner) source_state="$(git rev-parse HEAD) $(git status --porcelain | shasum | cut -d' ' -f1)" ;;
    esac
    built_from="images/$name-$suffix.source"
    if [ ! -f "images/$name-$suffix.tar" ] || [ "$(cat "$built_from" 2>/dev/null)" != "$source_state" ]; then
        sh .docker/helper/build.sh "$architecture" "$name"
        printf '%s\n' "$source_state" >"$built_from"
    fi
done

# Writes one setting into .env, replacing the line that sets it or adding one.
setting() {
    if grep -q "^$1=" .env; then
        sed -i.before-local-host "s#^$1=.*#$1=$2#" .env
        rm -f .env.before-local-host
    else
        printf '%s=%s\n' "$1" "$2" >> .env
    fi
}

setting COMPOSE_PROFILES contained
setting AGENTS_ARRANGEMENT contained
setting AGENTS_INSTALLATION_NAME local
setting ACCOUNTS_ROOT /srv/journal/accounts
setting AGENT_DAEMON_IMAGE docker:28-dind
setting AGENT_DAEMON_DATA /var/lib/docker
setting AGENT_DAEMON_SOCKET_GROUP 1000
# Agents start in /workspace of their container, from the environment main's folder under the workspaces folder.
mkdir -p "$HOME/.agent-journal-6/workspaces/main"
setting AGENTS_WORKSPACES_FOLDER "$HOME/.agent-journal-6/workspaces"
setting AGENTS_WORKSPACES '{"main":{"folder":"main"}}'
# An image's pin is its config digest, the id the agent daemon gives it once loaded; the Mac's own Docker shows another
# id, so it is read from the saved archive.
pin() {
    tar -xOf "images/$1-$suffix.tar" manifest.json | sed -n 's#.*"Config":"blobs/sha256/\([0-9a-f]*\)".*#sha256:\1#p'
}
# A session container reaches the Mac's published port, never the app's internal name.
setting AGENTS_SESSION_JOURNAL_URL "http://host.docker.internal:${APP_PORT:-54700}"
setting AGENT_IMAGE "$(pin agent)"
setting RUNNER_IMAGE "$(pin runner)"

if $fresh; then
    docker compose down --volumes --remove-orphans
    sed -i.before-local-host '/^AGENTS_HOST_ID=/d' .env
    rm -f .env.before-local-host secrets/journal_host_secret
fi

# The services that run journal-agent take the one built here first, so a Go change needs no image build.
sh scripts/dev-watch-host.sh --once

docker compose up -d --wait app
docker compose exec -T app php artisan migrate --force
$fresh && docker compose exec -T app php artisan db:seed --force
sh scripts/prepare-hook-test-database.sh

# A database made again since the last run no longer knows the enrolled host, and its secret would be refused on every
# call (the sign-in service would never pick up a sign-in), so the host is enrolled again with fresh host state.
known_host=$(grep '^AGENTS_HOST_ID=' .env | cut -d= -f2)
if [ -n "$known_host" ] && ! docker compose exec -T app php artisan tinker --execute \
    "echo App\\Models\\Host::query()->withoutGlobalScopes()->whereKey('$known_host')->exists() ? 'known' : 'gone';" \
    | grep -q known; then
    echo "The database no longer knows host $known_host: enrolling the host again."
    docker compose rm --stop --force agent-host accounts agent-host-enroll
    docker volume rm --force "$(docker compose config | sed -n 's/^name: //p')_host-state"
    sed -i.before-local-host '/^AGENTS_HOST_ID=/d' .env
    rm -f .env.before-local-host secrets/journal_host_secret
fi

# The host is enrolled once: its id lives in .env and its secret in secrets/, both kept on a later run.
if ! grep -q '^AGENTS_HOST_ID=.' .env || [ ! -s secrets/journal_host_secret ]; then
    enrolment=$(docker compose exec -T app php artisan agents:host-enroll local --contained --root /workspace)
    host=$(printf '%s\n' "$enrolment" | sed -n 's/^Host \([^ ]*\) is enrolled.*/\1/p')
    [ -n "$host" ] || { echo "The host enrolment printed no host id." >&2; exit 1; }
    mkdir -p secrets
    umask 077
    printf '%s\n' "$enrolment" | tail -n 1 > secrets/journal_host_secret
    setting AGENTS_HOST_ID "$host"
fi

docker compose up -d --wait
docker compose exec -T app php artisan profile:activate
docker compose exec -T app php artisan agents:install
echo "The local host is enrolled and running."
echo "To reload the host on every Go change, run: sh scripts/dev-watch-host.sh"
