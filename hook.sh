#!/bin/sh
[ "$AGENT_JOURNAL_ACTIVE" = 1 ] || exit 0
read -r at url < "$2/runtime/heartbeat" 2>/dev/null || exit 0
[ $(( $(date +%s) - at )) -le 5 ] || exit 0
reply=$(curl -s -m 10 -w '\n%{http_code}' -H 'Content-Type: application/json' \
  --url-query "root=$2" --url-query "pid=$PPID" --url-query "env=$JOURNAL_ENV" --url-query "inbox=$CLAUDE_CODE_MESSAGING_SOCKET" --data-binary @- "${url}api/hook/$1")
code=${reply##*
}
body=${reply%
*}
case "$code" in
  200|403) [ -z "$body" ] || [ "$body" = "{}" ] || printf '%s\n' "$body" ;;
esac
exit 0
