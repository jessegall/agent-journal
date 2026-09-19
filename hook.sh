#!/bin/sh
[ "$AGENT_JOURNAL_ACTIVE" = 1 ] || exit 0
beat=$(cat "$2/runtime/viewer.json" 2>/dev/null) || exit 0
at=$(printf '%s' "$beat" | sed -n 's/.*"at": *\([0-9]*\).*/\1/p')
url=$(printf '%s' "$beat" | sed -n 's/.*"url": *"\([^"]*\)".*/\1/p')
[ -n "$at" ] && [ -n "$url" ] && [ $(( $(date +%s) - at )) -le 5 ] || exit 0
reply=$(curl -s -m 10 -w '\n%{http_code}' -H 'Content-Type: application/json' \
  --url-query "root=$2" --url-query "pid=$PPID" --url-query "env=$JOURNAL_ENV" --data-binary @- "${url}api/hook/$1")
code=${reply##*
}
body=${reply%
*}
case "$code" in
  200|403) [ -z "$body" ] || [ "$body" = "{}" ] || printf '%s\n' "$body" ;;
esac
exit 0
