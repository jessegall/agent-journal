#!/bin/sh
[ "$AGENT_JOURNAL_ACTIVE" = 1 ] || exit 0
agent=$1
root=$2
heartbeat_age=5
# a server that is not beating is down, restarting or hung: the hook gives it this long, once, and never waits for it
unhealthy_wait=0.05
healthy_wait=10
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
# a late heartbeat is a busy server as often as a dead one: ask it once, briefly, before giving up
stale=
wait_for=$healthy_wait
[ $(( $(date +%s) - at )) -le $heartbeat_age ] || { stale=1; wait_for=$unhealthy_wait; }
sent_to=
while :; do
  if [ -n "$sent_to" ]; then
    reply=$(curl -s -m $wait_for --connect-timeout $unhealthy_wait -w '\n%{http_code}' -H 'Content-Type: application/json' --data-binary @"$body" "$sent_to")
  else
    reply=$(curl -s -m $wait_for --connect-timeout $unhealthy_wait -w '\n%{http_code}' -H 'Content-Type: application/json' \
      --url-query "root=$root" --url-query "pid=$PPID" --url-query "env=$JOURNAL_ENV" --url-query "inbox=$CLAUDE_CODE_MESSAGING_SOCKET" --data-binary @"$body" "${url}api/hook/$1")
    # curl before 7.87 has no --url-query and exits 2: build the address with --data-urlencode instead
    [ $? -ne 2 ] || { sent_to=$(curl -Gso /dev/null -w '%{url_effective}' --data-urlencode "root=$root" --data-urlencode "pid=$PPID" --data-urlencode "env=$JOURNAL_ENV" --data-urlencode "inbox=$CLAUDE_CODE_MESSAGING_SOCKET" "${url}api/hook/$1"); continue; }
  fi
  code=${reply##*
}
  break
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
