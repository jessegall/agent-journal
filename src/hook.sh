#!/bin/sh
[ "$AGENT_JOURNAL_ACTIVE" = 1 ] || exit 0
root=$2
body=$(mktemp) || exit 0
cat > "$body"
keep() {
  if grep -q '"hook_event_name" *: *"MessageDisplay"' "$body"; then
    mkdir -p "$root/runtime/unsent" && mv "$body" "$root/runtime/unsent/$(date +%s)-$$.json"
  fi
  rm -f "$body"
  exit 0
}
read -r at url < "$root/runtime/heartbeat" 2>/dev/null || keep
[ $(( $(date +%s) - at )) -le 5 ] || keep
tries=0
while :; do
  reply=$(curl -s -m 10 -w '\n%{http_code}' -H 'Content-Type: application/json' \
    --url-query "root=$root" --url-query "pid=$PPID" --url-query "env=$JOURNAL_ENV" --url-query "inbox=$CLAUDE_CODE_MESSAGING_SOCKET" --data-binary @"$body" "${url}api/hook/$1")
  code=${reply##*
}
  tries=$((tries + 1))
  [ "${code:-000}" = 000 ] || break
  [ -e "$root/runtime/upgrading" ] && [ $tries -lt 16 ] || [ $tries -lt 4 ] || break
  sleep 0.5
done
out=${reply%
*}
case "$code" in
  200|403) [ -z "$out" ] || [ "$out" = "{}" ] || printf '%s\n' "$out" ;;
  *) printf '%s %s %s\n' "$(date +%s)" "${code:-000}" "$1" >> "$root/runtime/hook-failures.log"; keep ;;
esac
rm -f "$body"
exit 0
