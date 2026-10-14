#!/bin/sh
# Claude's statusline runs this with its status JSON on stdin; the figure the journal wants is the context, and it is kept per session.
[ "$AGENT_JOURNAL_ACTIVE" = 1 ] || exit 0
payload=$(cat)
session=$(printf '%s' "$payload" | sed -n 's/.*"session_id" *: *"\([^"]*\)".*/\1/p')
[ -n "$session" ] || exit 0
dir="$HOME/.journal/status"
mkdir -p "$dir" && printf '%s' "$payload" > "$dir/$session.json"
exit 0
