#!/bin/sh
# The fallback hook of version 5, written into the agent programs' settings when the Go hook cannot start on this
# machine: the hook body on stdin goes as it is to the journal's server, which prepares it in Python, and the answer is
# printed for the agent program. No server, or no answer within ten seconds: the hook goes on, noted in
# .journal/runtime/bypass.log. Run as hook.sh <program> <project root>.
program=$1
root=$2
journal=$(cd "$root/.journal" 2>/dev/null && pwd -P) || exit 0
socket="$journal/server.sock"
if [ "${#socket}" -gt 100 ]; then
  if command -v sha256sum >/dev/null 2>&1; then
    digest=$(printf '%s' "$socket" | sha256sum | cut -c1-16)
  else
    digest=$(printf '%s' "$socket" | shasum -a 256 | cut -c1-16)
  fi
  socket="/tmp/journal-$digest.sock"
fi
fired_at="$(date +%s)000"
answer=$(curl -s -f --max-time 10 --unix-socket "$socket" -X POST "http://journal/hook?program=$program" \
  -H "Content-Type: application/json" -H "X-Journal-Hook-Id: $$-$fired_at" -H "X-Journal-Request-At: $fired_at" \
  -H "X-Journal-Actor: ${JOURNAL_ACTOR:-agent}" -H "X-Journal-Env: ${JOURNAL_ENVIRONMENT:-main}" --data-binary @-) || {
  mkdir -p "$journal/runtime" && printf '%s hook %s\n' "$(date +%s)" "$program" >> "$journal/runtime/bypass.log"
  exit 0
}
printf '%s' "$answer"
