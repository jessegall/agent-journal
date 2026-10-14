#!/bin/sh
# The agent's hooks run this: the hook body on stdin goes to the running server, and the server's status decides.
#   200  go on; the body is JSON in the agent's own hook shape, printed for it to read
#   409  refused; the body's error is the reason, and exit 2 is how the agent is told to stop (or, on Stop, not to stop)
#   anything else, or no server  go on, silently
# Nothing is decided here, and a deferred handler never changes the status: the server replies before it runs.
agent=$1
root=$2
port=$(cat "$root/.journal/port" 2>/dev/null) || exit 0
body=$(mktemp)
status=$(curl -sS --max-time 10 -o "$body" -w '%{http_code}' -X POST "http://127.0.0.1:$port/hooks/$agent" \
    -H "Content-Type: application/json" \
    -H "X-Journal-Env: ${JOURNAL_ENV:-main}" \
    --data-binary @-) || status=0
case "$status" in
    200) cat "$body" ;;
    409) sed -e 's/^{"error": *"//' -e 's/"}$//' -e 's/\\n/\n/g' "$body" >&2; rm -f "$body"; exit 2 ;;
esac
rm -f "$body"
exit 0
