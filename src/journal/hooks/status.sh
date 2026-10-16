#!/bin/sh
# Claude's statusline runs this with its status JSON on stdin. The journal keeps the JSON per session, for the context, the model
# and the plan windows the agent bar shows, and prints the bar's words from the file the supervisor keeps current.
root=$(cd "$(dirname "$0")/../../../.." && pwd)
payload=$(cat)
if [ "$AGENT_JOURNAL_ACTIVE" = 1 ]; then
    session=$(printf '%s' "$payload" | sed -n 's/.*"session_id" *: *"\([^"]*\)".*/\1/p')
    if [ -n "$session" ]; then
        dir="$HOME/.journal/status"
        mkdir -p "$dir" && printf '%s' "$payload" > "$dir/$session.json"
    fi
fi
[ -f "$root/.journal/runtime/status-line" ] && cat "$root/.journal/runtime/status-line"
exit 0
