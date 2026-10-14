#!/bin/sh
# The journal command. With a server up it posts the argv there and prints the outcome, so no Python starts;
# without one it runs the package directly. Inside an agent's shell (CLAUDECODE or CODEX_SANDBOX set) the
# server attributes the command to the environment's live agent.
here=$(cd "$(dirname "$0")" && pwd)
root=${JOURNAL_ROOT:-$PWD}
case "$1" in
    claude|codex|serve|setup) cd "$root" && exec python3 "$here/journal.py" "$@" ;;
esac
port=$(cat "$root/.journal/port" 2>/dev/null)
if [ -n "$port" ]; then
    agent=false; [ -n "$CLAUDECODE$CODEX_SANDBOX" ] && agent=true
    body=$(python3 -c 'import json,os,sys; print(json.dumps({"argv": sys.argv[2:], "env": os.environ.get("JOURNAL_ENV","main"), "session": os.environ.get("JOURNAL_SESSION",""), "agent": sys.argv[1] == "true"}))' "$agent" "$@") &&
    reply=$(curl -sS --max-time 30 -X POST "http://127.0.0.1:$port/cli" -H "Content-Type: application/json" --data-binary "$body") &&
    printf '%s' "$reply" | python3 -c 'import json,sys; o=json.load(sys.stdin); sys.stdout.write(o["out"]); sys.stderr.write(o["err"]); sys.exit(o["code"])'
    exit $?
fi
cd "$root" && exec python3 "$here/journal.py" "$@"
