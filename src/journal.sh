#!/bin/sh
# The journal command. With a server up it posts the argv there and prints the outcome, so no Python starts;
# without one it runs the package directly.
here=$(cd "$(dirname "$0")" && pwd)
root=${JOURNAL_ROOT:-$PWD}
port=$(cat "$root/.journal/port" 2>/dev/null)
if [ -n "$port" ] && command -v python3 >/dev/null; then
    body=$(python3 -c 'import json,os,sys; print(json.dumps({"argv": sys.argv[1:], "env": os.environ.get("JOURNAL_ENV","main"), "session": os.environ.get("JOURNAL_SESSION","")}))' "$@") &&
    reply=$(curl -sS --max-time 30 -X POST "http://127.0.0.1:$port/cli" -H "Content-Type: application/json" --data-binary "$body") &&
    printf '%s' "$reply" | python3 -c 'import json,sys; o=json.load(sys.stdin); sys.stdout.write(o["out"]); sys.stderr.write(o["err"]); sys.exit(o["code"])' &&
    exit 0
fi
exec python3 "$here/journal.py" "$@"
