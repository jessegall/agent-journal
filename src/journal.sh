#!/bin/sh
# The journal command. With a server up it posts the argv there and prints the outcome, so no Python starts;
# without one it runs the package directly. Inside an agent's shell (CLAUDECODE or CODEX_SANDBOX set) the
# server attributes the command to the environment's live agent; a plugin's program names itself with JOURNAL_PLUGIN and
# JOURNAL_PLUGIN_TOKEN, and the server stamps the plugin.
here=$(cd "$(dirname "$0")" && pwd)
root=${JOURNAL_ROOT:-$PWD}
case "$1" in
    claude|codex|serve|setup) cd "$root" && exec python3 "$here/journal.py" "$@" ;;
esac
port=$(cat "$root/.journal/port" 2>/dev/null)
if [ -n "$port" ]; then
    agent=false; [ -n "$CLAUDECODE$CODEX_SANDBOX$JOURNAL_AGENT_SHELL" ] && agent=true
    body=$(python3 -c 'import json,os,sys; print(json.dumps({"argv": sys.argv[2:], "env": os.environ.get("JOURNAL_ENV","main"), "session": os.environ.get("JOURNAL_SESSION",""), "agent": sys.argv[1] == "true", "plugin": os.environ.get("JOURNAL_PLUGIN",""), "token": os.environ.get("JOURNAL_PLUGIN_TOKEN","")}))' "$agent" "$@") &&
    reply=$(curl -s --max-time 30 -X POST "http://127.0.0.1:$port/cli" -H "Content-Type: application/json" --data-binary "$body") &&
    { printf '%s' "$reply" | python3 -c 'import json,sys; o=json.load(sys.stdin); sys.stdout.write(o.get("out", "")); sys.stderr.write(o.get("err", "the journal failed: " + str(o.get("error", o)) + "\n")); sys.exit(o.get("code", 1))'; exit $?; }
fi
# No server answered (none up, or a port file left by one that died): the package runs the command itself.
cd "$root" && exec python3 "$here/journal.py" "$@"
