#!/bin/sh
# The fallback hook of version 5, written into the agent programs' settings when the Go hook cannot start on this
# machine. It decides who is calling as tools/journal-hook/hook.go does: nothing unless AGENT_JOURNAL_ACTIVE is 1, only
# the agent and the workers, verifiers and reviewers it sent, and the environment from JOURNAL_ENV, else the linked
# worktree the hook runs in, else main. The hook body on stdin then goes as it is to the journal's server, which
# prepares it in Python, and the answer is printed for the agent program. No server, or no answer within ten seconds:
# the hook goes on, noted in .journal/runtime/bypass.log. Run as hook.sh <program> <project root>.
[ "${AGENT_JOURNAL_ACTIVE:-}" = 1 ] || exit 0
actor=${JOURNAL_ACTOR:-agent}
case "$actor" in agent | worker:* | verifier:* | reviewer:*) ;; *) exit 0 ;; esac
program=$1
root=$2
journal=$(cd "$root/.journal" 2>/dev/null && pwd -P) || exit 0

local_environment() {
  folder=$(pwd -P)
  while :; do
    if [ -d "$folder/.git" ]; then
      echo main
      return
    fi
    if [ -f "$folder/.git" ]; then
      git_folder=$(sed -n 's/^gitdir: *//p' "$folder/.git")
      case "$git_folder" in /*) ;; *) git_folder="$folder/$git_folder" ;; esac
      if [ -f "$git_folder/commondir" ]; then basename "$folder"; else echo main; fi
      return
    fi
    [ "$folder" = / ] && echo main && return
    folder=$(dirname "$folder")
  done
}

environment=${JOURNAL_ENV:-$(local_environment)}
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
  -H "X-Journal-Actor: $actor" -H "X-Journal-Env: $environment" --data-binary @-) || {
  mkdir -p "$journal/runtime" && printf '%s hook %s\n' "$(date +%s)" "$program" >> "$journal/runtime/bypass.log"
  exit 0
}
printf '%s' "$answer"
