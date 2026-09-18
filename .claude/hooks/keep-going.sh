#!/bin/sh
f="${CLAUDE_PROJECT_DIR:-$PWD}/.journal/keep-going"
[ -f "$f" ] || exit 0
input=$(cat)
case "$input" in *'"stop_hook_active": true'*|*'"stop_hook_active":true'*) exit 0;; esac
printf '{"decision":"block","reason":"KEEP GOING: %s"}\n' "$(tr -d '"' < "$f" | tr '\n' ' ')"
