#!/bin/sh
# The journal command. With a server up it posts the argv there; without one it runs the package directly.
# A command is posted as the shell's environment, a double NUL and each word ended by a NUL; the server finds who runs it
# from the environment, as it does for a shell line, and answers what it printed with the exit code on its last line.
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
    { env -0; printf '\0\0'; for word in "$@"; do printf '%s\0' "$word"; done; } \
        | curl -s --max-time 30 -X POST "http://127.0.0.1:$port/cli/run" -H "Content-Type: application/octet-stream" -H "X-Journal-Env: $JOURNAL_ENV" -H "X-Journal-Actor: ${JOURNAL_ACTOR:-agent}" -H "X-Journal-Thread: ${CODEX_THREAD_ID:-}" --data-binary @- \
        | awk '{ if (NR > 1) print prev; prev = $0 } END { if (NR == 0) exit 255; split(prev, exit_line, " "); exit exit_line[2] + 0 }'
    status=$?
    [ "$status" -ne 255 ] && exit "$status"
fi
# No server answered (none up, or a port file left by one that died): the package runs the command itself, unless a sub-agent runs it.
[ "${JOURNAL_ACTOR:-agent}" = sub-agent ] && exit 0
cd "$root" && exec "$py" "$here/journal.py" "$@"
