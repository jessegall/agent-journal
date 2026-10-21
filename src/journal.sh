#!/bin/sh
# The journal command. With a server up it posts the argv there; without one it runs the package directly.
# Commands carry the agent's own session, or name its shell so the server can find the live agent.
# A plugin names itself with JOURNAL_PLUGIN and JOURNAL_PLUGIN_TOKEN, and the server stamps the plugin.
here=$(cd "$(dirname "$0")" && pwd)
root=${JOURNAL_ROOT:-$PWD}
# The Python 3.14 the install found, kept beside the package; python3 only where an install from before it left none.
py=$(cat "$here/../python" 2>/dev/null)
[ -x "$py" ] || py=python3
case "$1" in
    claude|codex|serve|setup) cd "$root" && exec "$py" "$here/journal.py" "$@" ;;
esac
# Who runs the command: JOURNAL_ACTOR is agent, sub-agent or worker-agent, sent to the server as a header, with a Codex thread's id.
# A subagent of Claude Code inherits the agent's shell whole, so nothing in its environment tells it apart here; the server pairs the command with the Bash PreToolUse hook a subagent announced it in (the only subagent hook it keeps).
. "$here/journal/hooks/environment.sh"
JOURNAL_ENV=$(journal_environment)
export JOURNAL_ENV
port=$(cat "$root/.journal/port" 2>/dev/null)
if [ -n "$port" ]; then
    body=$("$py" -c '
import json, os, sys
sys.path.insert(0, sys.argv[1])
from journal.support.caller import Caller
caller = Caller.from_environ(os.environ)
print(json.dumps({"argv": sys.argv[2:], "env": where.environment, "session": where.session, "agent": where.from_agent_shell, "plugin": where.plugin, "token": os.environ.get("JOURNAL_PLUGIN_TOKEN", "")}))
' "$here" "$@") &&
    reply=$(curl -s --max-time 30 -X POST "http://127.0.0.1:$port/cli" -H "Content-Type: application/json" -H "X-Journal-Actor: ${JOURNAL_ACTOR:-agent}" -H "X-Journal-Thread: ${CODEX_THREAD_ID:-}" --data-binary "$body") &&
    { printf '%s' "$reply" | "$py" -c 'import json,sys; o=json.load(sys.stdin); sys.stdout.write(o.get("out", "")); sys.stderr.write(o.get("err", "the journal failed: " + str(o.get("error", o)) + "\n")); sys.exit(o.get("code", 1))'; exit $?; }
fi
# No server answered (none up, or a port file left by one that died): the package runs the command itself, unless a sub-agent runs it.
[ "${JOURNAL_ACTOR:-agent}" = sub-agent ] && exit 0
cd "$root" && exec "$py" "$here/journal.py" "$@"
