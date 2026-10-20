#!/bin/sh
# The agent's hooks run this: the hook body on stdin goes to the running server, and the server's status decides.
#   200  go on; the body is JSON in the agent's own hook shape, printed for it to read
#   409  refused; the body's error is the reason, and exit 2 is how the agent is told to stop (or, on Stop, not to stop)
#   anything else, or no server  go on, silently
# Nothing is decided here, and a deferred handler never changes the status: the server replies before it runs.
# Who runs the hook: JOURNAL_ACTOR is agent, sub-agent or worker-agent; only the agent's own hooks reach the journal.
# A hook whose body carries a subagent's id is a sub-agent's, whatever the variable says, since a subagent inherits the agent's shell;
# only its start, its stop and its PreToolUse reach the server, which pairs that announced command with the shim's own post.
[ "$AGENT_JOURNAL_ACTIVE" = 1 ] || exit 0
[ "${JOURNAL_ACTOR:-agent}" = agent ] || exit 0
agent=$1
root=$2
port=$(cat "$root/.journal/port" 2>/dev/null) || exit 0
. "$(dirname "$0")/environment.sh"
body=$(mktemp)
sent=$(mktemp)
cat > "$sent"
if grep -q '"agent_id"' "$sent" && ! grep -q '"hook_event_name": *"\(Subagent\|PreToolUse\)' "$sent"; then rm -f "$body" "$sent"; exit 0; fi
status=$(curl -sS --max-time 10 -o "$body" -w '%{http_code}' -X POST "http://127.0.0.1:$port/hooks/$agent" \
    -H "Content-Type: application/json" \
    -H "X-Journal-Env: $(journal_environment)" \
    --data-binary @"$sent") || status=0
rm -f "$sent"
case "$status" in
    200) cat "$body" ;;
    409) sed -e 's/^{"error": *"//' -e 's/"}$//' -e 's/\\n/\n/g' "$body" >&2; rm -f "$body"; exit 2 ;;
esac
rm -f "$body"
exit 0
