#!/bin/bash
# Starts the team server, the team's hosted journal and Caddy in front of both; the container ends when the team server or
# Caddy ends, so Docker restarts them, and the hosted journal is started again whenever it stops.
set -euo pipefail
mkdir -p /data/team /data/journal
if [ "${TEAM_PLAIN_HTTP:-}" = "1" ]; then
    config=/etc/caddy/Caddyfile.plain
elif [ "${TEAM_CERTIFICATE:-}" = "internal" ]; then
    : "${TEAM_ADDRESS:?set TEAM_ADDRESS to the address the team reaches this server at}"
    config=/etc/caddy/Caddyfile.internal
else
    : "${TEAM_ADDRESS:?set TEAM_ADDRESS to the address the team reaches this server at, or TEAM_PLAIN_HTTP=1}"
    config=/etc/caddy/Caddyfile.https
fi
python -m sync_server serve --data /data/team --host 127.0.0.1 --port 8470 &
caddy run --config "$config" --adapter caddyfile &
(while true; do bash /app/hosted.sh || sleep 30; done) &
wait -n
exit 1
