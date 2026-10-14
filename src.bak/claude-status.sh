#!/bin/sh
[ "$AGENT_JOURNAL_ACTIVE" = 1 ] || exit 0
payload=$(cat)
session=$(printf '%s' "$payload" | sed -n 's/.*"session_id" *: *"\([^"]*\)".*/\1/p')
[ -n "$session" ] || exit 0
dir="$HOME/.journal/claude-status"
mkdir -p "$dir" && printf '%s' "$payload" > "$dir/$session.json"
exit 0
