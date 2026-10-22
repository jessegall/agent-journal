#!/bin/sh
# The agent's shell prefix: the launcher sets it, and the agent then runs every shell command, and its MCP servers, as
# run.sh '<line>'. A shell command, which the agent's tool wraps in eval, goes to the journal server with the folder,
# the shell and the environment it runs in: the server runs it part by part in that shell, records each part and streams
# back what the agent sees; this prints that and ends with the chain's exit code, the stream's last line. Anything else,
# or a line with no server up, runs as it is.
here=$(cd "$(dirname "$0")" && pwd)
root=$(cd "$here/../../.." && pwd)
[ $# -eq 1 ] || exec "$@"
case "$1" in *"&& eval '"*"' < /dev/null && pwd -P"* | *"&& eval '"*"' && pwd -P"*) ;; *) exec "${SHELL:-bash}" -c "$1" ;; esac
port=$(cat "$root/port" 2>/dev/null) || exec "${SHELL:-bash}" -c "$1"
. "$here/environment.sh"
{ env -0; printf '\0\0'; printf '%s' "$1"; } | curl -sN --max-time 0 -X POST "http://127.0.0.1:$port/shell/run" -H "Content-Type: application/octet-stream" -H "X-Journal-Env: $(journal_environment)" -H "X-Journal-Cwd: $PWD" -H "X-Journal-Shell: ${SHELL:-bash}" --data-binary @- \
    | awk '{ if (NR > 1) { print prev; fflush() } prev = $0 } END { if (prev !~ /^__journal_exit /) { if (NR) print prev; print "the journal gave no exit code: its server failed on this line" > "/dev/stderr"; exit 1 } split(prev, exit_line, " "); exit exit_line[2] + 0 }'
