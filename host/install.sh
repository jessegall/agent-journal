#!/bin/sh
# Sets up a hosted team journal on this machine with Docker: asks for the project, the admin and the address,
# writes the admin into a new volume, starts the team server and prints the line a journal joins it with.
# Run it on the server with the copy each release carries, which pulls that release's team image:
#   curl -fsSL https://github.com/jessegall/agent-journal/releases/latest/download/install.sh | sh
# A second project on the same host needs ports of its own: TEAM_HTTPS_PORT and TEAM_HTTP_PORT, with the server's own
# certificate (give an IP address), since only one container can hold 80 and 443.
# Back up a running server with: docker exec agent-journal-<project> python -m sync_server backup --data /data/team
set -eu

IMAGE="${TEAM_IMAGE:-ghcr.io/jessegall/agent-journal-team:${TEAM_VERSION:-latest}}"
HTTPS_PORT="${TEAM_HTTPS_PORT:-443}"
HTTP_PORT="${TEAM_HTTP_PORT:-80}"

# Prompts come from the terminal even when the script itself arrives on standard input through a pipe.
if [ -z "${TEAM_SETUP_STDIN:-}" ] && [ -r /dev/tty ]; then
    exec < /dev/tty
fi

ask() {
    printf '%s: ' "$1" >&2
    IFS= read -r answer
    printf '%s' "$answer"
}

ask_secret() {
    printf '%s: ' "$1" >&2
    stty -echo 2>/dev/null || true
    IFS= read -r answer
    stty echo 2>/dev/null || true
    printf '\n' >&2
    printf '%s' "$answer"
}

json_text() {
    printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

command -v docker >/dev/null || { echo "Docker is not installed here: install it first, then run this again." >&2; exit 1; }

project=$(ask "Project name, which names the server's volume and container")
admin_name=$(ask "Your name")
admin_email=$(ask "Your email")
password=$(ask_secret "Your password, at least 10 characters")
password_repeat=$(ask_secret "Your password again")
address=$(ask "The address the team reaches this server at, a domain name or this machine's IP address")

slug=$(printf '%s' "$project" | tr 'A-Z' 'a-z' | tr -cs 'a-z0-9' '-' | sed 's/^-//; s/-$//')
[ -n "$slug" ] || { echo "The project name needs at least one letter or digit." >&2; exit 1; }
name="agent-journal-$slug"
if docker volume inspect "$name" >/dev/null 2>&1; then
    echo "A team server for $project is set up here already, in the volume $name." >&2
    exit 1
fi

case "$address" in
    *[!0-9.]*) certificate="" ;;
    *) certificate="internal" ;;
esac

docker pull -q "$IMAGE" >/dev/null 2>&1 || docker image inspect "$IMAGE" >/dev/null || { echo "The image $IMAGE could not be found." >&2; exit 1; }
docker volume create "$name" >/dev/null
answers=$(printf '{"name": "%s", "email": "%s", "password": "%s", "password_repeat": "%s"}' "$(json_text "$admin_name")" "$(json_text "$admin_email")" "$(json_text "$password")" "$(json_text "$password_repeat")")
if ! code=$(printf '%s' "$answers" | docker run --rm -i -v "$name:/data" "$IMAGE" python -m sync_server setup --data /data/team); then
    docker volume rm "$name" >/dev/null
    exit 1
fi

docker run -d --name "$name" --restart unless-stopped -p "$HTTPS_PORT:443" -p "$HTTP_PORT:80" -v "$name:/data" \
    -e TEAM_ADDRESS="$address" -e TEAM_CERTIFICATE="$certificate" "$IMAGE" >/dev/null

if [ "$HTTPS_PORT" = "443" ]; then url="https://$address"; else url="https://$address:$HTTPS_PORT"; fi
# The server answers an unknown path with 404 once Caddy holds a certificate the client accepts.
tries=0
until [ "$(curl -s ${certificate:+-k} --max-time 5 -o /dev/null -w '%{http_code}' "$url/nothing")" = "404" ]; do
    tries=$((tries + 1))
    if [ "$tries" -ge 30 ]; then
        echo "The server runs, but $url does not answer over HTTPS: the certificate for $address could not be got." >&2
        echo "Check that $address points at this machine and that ports 80 and 443 are open; what Caddy said:" >&2
        docker logs --tail 15 "$name" >&2
        exit 1
    fi
    sleep 2
done

fingerprint=""
if [ -n "$certificate" ]; then
    fingerprint=$(docker exec "$name" python -c "import hashlib, ssl; print(hashlib.sha256(ssl.PEM_cert_to_DER_cert(open('/data/caddy/pki/authorities/local/root.crt').read())).hexdigest())")
fi

echo
echo "The team server for $project runs at $url."
echo "Join it from your journal with:"
echo
echo "    journal team join $url --code $code${fingerprint:+ --fingerprint $fingerprint}"
echo
echo "Invite colleagues from your journal afterwards with journal team invite <email>."
