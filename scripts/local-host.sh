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

for name in agent runner; do
    if [ ! -f "images/$name-$suffix.tar" ]; then
        sh .docker/helper/build.sh "$architecture" "$name"
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
# An image's pin is its config digest, the id the agent daemon gives it once loaded; the Mac's own Docker shows another
# id, so it is read from the saved archive.
pin() {
    tar -xOf "images/$1-$suffix.tar" manifest.json | sed -n 's#.*"Config":"blobs/sha256/\([0-9a-f]*\)".*#sha256:\1#p'
}
setting AGENT_IMAGE "$(pin agent)"
setting RUNNER_IMAGE "$(pin runner)"

if $fresh; then
    docker compose down --volumes --remove-orphans
    sed -i.before-local-host '/^AGENTS_HOST_ID=/d' .env
    rm -f .env.before-local-host secrets/journal_host_secret
fi

docker compose up -d --wait app
docker compose exec -T app php artisan migrate --force
$fresh && docker compose exec -T app php artisan db:seed --force

# The host is enrolled once: its id lives in .env and its secret in secrets/, both kept on a later run.
if ! grep -q '^AGENTS_HOST_ID=.' .env || [ ! -s secrets/journal_host_secret ]; then
    enrolment=$(docker compose exec -T app php artisan agents:host-enroll local --contained)
    host=$(printf '%s\n' "$enrolment" | sed -n 's/^Host \([^ ]*\) is enrolled.*/\1/p')
    [ -n "$host" ] || { echo "The host enrolment printed no host id." >&2; exit 1; }
    mkdir -p secrets
    umask 077
    printf '%s\n' "$enrolment" | tail -n 1 > secrets/journal_host_secret
    setting AGENTS_HOST_ID "$host"
fi

docker compose up -d --wait
docker compose exec -T app php artisan profile:activate
echo "The local host is enrolled and running."
