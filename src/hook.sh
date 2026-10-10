#!/bin/sh
[ "$AGENT_JOURNAL_ACTIVE" = 1 ] || exit 0
agent=$1
root=$2
heartbeat_age=5
# a heartbeat that is late but not old is a server too busy to beat on time, as on a machine under load: the hook asks it once,
# long enough to answer, and spools the event when it does not
late_age=60
late_wait=2
# a server that is not beating for longer is down, restarting or hung: the hook gives it this long, once, and never waits for it
unhealthy_wait=0.05
healthy_wait=2
wait_for=$healthy_wait
# the event is read once into a variable and written from there, so the hook starts no process to keep it in a file
body=$(cat)
# an event that decides nothing is kept in the spool, with who sent it, and the server replays it in order when it next reads;
# one that decides something (a refusal, a context, a nudge at the stop) is answered now or not at all
spool() {
  mkdir -p "$root/runtime/unsent" || return
  name="$root/runtime/unsent/$(date +%s)-$$"
  { printf '{"agent":"%s","env":"%s","pid":%s,"body":' "$agent" "$JOURNAL_ENV" "${PPID:-0}"; printf '%s' "$body"; printf '}'; } > "$name.tmp" && mv "$name.tmp" "$name.json"
}
# an event that decides something and could not be delivered in time is spooled like the others: the call goes ahead unchecked,
# the server reads the event late, and the agent is told so
keep() {
  event=$(printf '%s' "$body" | grep -o '"hook_event_name" *: *"[A-Za-z]*"' | head -1)
  spool
  case $event in
    *PreToolUse*|*PermissionRequest*|*UserPromptSubmit*|*Stop\"|*SessionStart*)
      printf '{"systemMessage": "The journal did not answer within %s seconds, so this call went ahead unchecked and the journal reads it late."}\n' "$wait_for" ;;
  esac
  exit 0
}
load() { uptime | sed 's/.*averages*: *//; s/,/ /g' | cut -d' ' -f1; }
down() {
  mkdir -p "$root/runtime" && printf '%s down %s %s %s\n' "$(date +%s)" "$agent" "$JOURNAL_ENV" "$(load)" >> "$root/runtime/hook-failures.log"
  keep
}
read -r at url < "$root/runtime/heartbeat" 2>/dev/null || down
# a late heartbeat is a busy server as often as a dead one: ask it once, briefly, before giving up
stale=
wait_for=$healthy_wait
age=$(( $(date +%s) - at ))
if [ $age -gt $late_age ]; then stale=1; wait_for=$unhealthy_wait
elif [ $age -gt $heartbeat_age ]; then wait_for=$late_wait
fi
sent_to=
while :; do
  if [ -n "$sent_to" ]; then
    reply=$(printf '%s' "$body" | curl -s -m $wait_for --connect-timeout $unhealthy_wait -w '\n%{http_code}' -H 'Content-Type: application/json' --data-binary @- "$sent_to")
  else
    reply=$(printf '%s' "$body" | curl -s -m $wait_for --connect-timeout $unhealthy_wait -w '\n%{http_code}' -H 'Content-Type: application/json' \
      --url-query "root=$root" --url-query "pid=$PPID" --url-query "env=$JOURNAL_ENV" --url-query "inbox=$CLAUDE_CODE_MESSAGING_SOCKET" --data-binary @- "${url}api/hook/$1")
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
     printf '%s %s %s %s %s\n' "$(date +%s)" "${code:-000}" "$agent" "$JOURNAL_ENV" "$(load)" >> "$root/runtime/hook-failures.log"; keep ;;
esac
exit 0
