#!/bin/sh
# agent-journal, version 4: install into the project in the current directory, or upgrade it.
#
#   curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh
#
# From a checkout on this machine, the same, run from the project root:
#
#   sh /path/to/agent-journal/install.sh
#
# The package is copied into ./.journal/src, apart from the project's own record; then journal setup
# wires the hooks of every agent present, writes the skills and the law, and puts the journal
# dispatcher in ~/.local/bin, which runs whichever version each project holds. Running it again upgrades.
set -e
PY=""
for candidate in python3.14 python3.13 python3.12 python3.11 python3; do
  command -v "$candidate" >/dev/null 2>&1 || continue
  "$candidate" -c 'import sys; sys.exit(sys.version_info < (3, 11))' 2>/dev/null && { PY="$candidate"; break; }
done
[ -n "$PY" ] || { echo "agent-journal needs Python 3.11 or newer: brew install python@3.13, then run this again." >&2; exit 1; }
HERE="$(cd "$(dirname "$0")" 2>/dev/null && pwd)"
TMP=""
if [ -d "$HERE/src/journal" ]; then
  SRC="$HERE/src"
else
  command -v git >/dev/null 2>&1 || { echo "git is required" >&2; exit 1; }
  REPO="${AGENT_JOURNAL_REPO:-https://github.com/jessegall/agent-journal}"
  REF="${AGENT_JOURNAL_REF:-main}"
  TMP="$(mktemp -d)"
  git clone --quiet --depth 1 --branch "$REF" "$REPO" "$TMP/pkg"
  SRC="$TMP/pkg/src"
fi
mkdir -p .journal/src
for name in journal supervisor journal.py journal.sh; do
  rm -rf ".journal/src/$name"
  cp -R "$SRC/$name" ".journal/src/$name"
done
mkdir -p .journal/src/web && rm -rf .journal/src/web/dist && cp -R "$SRC/web/dist" .journal/src/web/dist
find .journal/src -name __pycache__ -type d -prune -exec rm -rf {} +
[ -z "$TMP" ] || rm -rf "$TMP"
JOURNAL_ROOT="$PWD" exec "$PY" .journal/src/journal.py setup here
