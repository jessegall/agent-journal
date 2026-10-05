#!/bin/sh
[ "$AGENT_JOURNAL_ACTIVE" = 1 ] || exit 0
agent=$1
root=$2
heartbeat_age=5
restart_window=30
tries_when_waiting=16
tries_otherwise=4
body=$(mktemp) || exit 0
cat > "$body"
keep() {
  if grep -q '"hook_event_name" *: *"MessageDisplay"' "$body"; then
    mkdir -p "$root/runtime/unsent" && mv "$body" "$root/runtime/unsent/$(date +%s)-$$.json"
  fi
  rm -f "$body"
  exit 0
}
down() {
  mkdir -p "$root/runtime" && printf '%s down %s %s\n' "$(date +%s)" "$agent" "$JOURNAL_ENV" >> "$root/runtime/hook-failures.log"
  keep
}
read -r at url < "$root/runtime/heartbeat" 2>/dev/null || down
[ $(( $(date +%s) - at )) -le $heartbeat_age ] || down
# the server writes its restart time with a fraction; ${since%.*} keeps the whole seconds the shell can count with
restarting() { read -r since < "$root/runtime/restarting" 2>/dev/null && [ $(( $(date +%s) - ${since%.*} )) -lt $restart_window ]; }
tries=0
while :; do
  reply=$(curl -s -m 10 -w '\n%{http_code}' -H 'Content-Type: application/json' \
    --url-query "root=$root" --url-query "pid=$PPID" --url-query "env=$JOURNAL_ENV" --url-query "inbox=$CLAUDE_CODE_MESSAGING_SOCKET" --data-binary @"$body" "${url}api/hook/$1")
  code=${reply##*
}
  tries=$((tries + 1))
  [ "${code:-000}" = 000 ] || break
  { [ -e "$root/runtime/upgrading" ] || restarting; } && [ $tries -lt $tries_when_waiting ] || [ $tries -lt $tries_otherwise ] || break
  sleep 0.5
done
out=${reply%
*}
case "$code" in
  200|403) [ -z "$out" ] || [ "$out" = "{}" ] || printf '%s\n' "$out" ;;
  *) printf '%s %s %s %s\n' "$(date +%s)" "${code:-000}" "$agent" "$JOURNAL_ENV" >> "$root/runtime/hook-failures.log"; keep ;;
esac
rm -f "$body"
exit 0
