#!/bin/bash
# Starts the team server and Caddy in front of it; the container ends when either ends, so Docker restarts both.
set -euo pipefail
mkdir -p /data/team
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
wait -n
exit 1
