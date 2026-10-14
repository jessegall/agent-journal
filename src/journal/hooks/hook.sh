#!/bin/sh
# The agent's hooks run this: the hook body on stdin goes to the running server, and the server's answer goes back on stdout.
# Nothing is decided here. If the server does not answer, the agent goes on.
agent=$1
root=$2
port=$(cat "$root/.journal/port" 2>/dev/null) || exit 0
curl -sS --max-time 5 -X POST "http://127.0.0.1:$port/hooks/$agent" \
    -H "Content-Type: application/json" \
    -H "X-Journal-Env: ${JOURNAL_ENV:-main}" \
    --data-binary @- || exit 0
