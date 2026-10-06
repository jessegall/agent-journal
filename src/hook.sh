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
# a late heartbeat is a busy server as often as a dead one: try it once before giving up
stale=
[ $(( $(date +%s) - at )) -le $heartbeat_age ] || { stale=1; [ -e "$root/runtime/upgrading" ] || tries_otherwise=1; }
# the server writes its restart time with a fraction; ${since%.*} keeps the whole seconds the shell can count with
restarting() { read -r since < "$root/runtime/restarting" 2>/dev/null && [ $(( $(date +%s) - ${since%.*} )) -lt $restart_window ]; }
tries=0
sent_to=
while :; do
  if [ -n "$sent_to" ]; then
    reply=$(curl -s -m 10 -w '\n%{http_code}' -H 'Content-Type: application/json' --data-binary @"$body" "$sent_to")
  else
    reply=$(curl -s -m 10 -w '\n%{http_code}' -H 'Content-Type: application/json' \
      --url-query "root=$root" --url-query "pid=$PPID" --url-query "env=$JOURNAL_ENV" --url-query "inbox=$CLAUDE_CODE_MESSAGING_SOCKET" --data-binary @"$body" "${url}api/hook/$1")
    # curl before 7.87 has no --url-query and exits 2: build the address with --data-urlencode instead
    [ $? -ne 2 ] || { sent_to=$(curl -Gso /dev/null -w '%{url_effective}' --data-urlencode "root=$root" --data-urlencode "pid=$PPID" --data-urlencode "env=$JOURNAL_ENV" --data-urlencode "inbox=$CLAUDE_CODE_MESSAGING_SOCKET" "${url}api/hook/$1"); continue; }
  fi
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
  *) { [ -z "$stale" ] || [ "${code:-000}" != 000 ]; } || down
     printf '%s %s %s %s\n' "$(date +%s)" "${code:-000}" "$agent" "$JOURNAL_ENV" >> "$root/runtime/hook-failures.log"; keep ;;
esac
rm -f "$body"
exit 0
