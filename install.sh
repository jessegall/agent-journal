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
# A version 3 journal is moved whole into .journal/version-3 before anything is written, and is never changed after;
# should the install fail before the new journal is up, it is put back where it was.
BACKED=""
restore() {
  [ -n "$BACKED" ] || return 0
  mv .journal/version-3 .journal-version-3 && rm -rf .journal && mv .journal-version-3 .journal
  echo "the install failed: the version 3 journal is back where it was" >&2
}
trap 'code=$?; [ "$code" -eq 0 ] || restore' EXIT
if [ -f .journal/src/VERSION ] && [ "$(cut -c1 .journal/src/VERSION)" = 3 ]; then
  mv .journal .journal-version-3
  mkdir .journal
  mv .journal-version-3 .journal/version-3
  BACKED=1
  echo "the version 3 journal is kept whole in .journal/version-3"
fi
mkdir -p .journal/src
# Each part is copied beside the one in use and renamed into place, so the running hooks and shell runner never find it gone.
swap() {
  rm -rf "$2.new" "$2.old"
  cp -R "$1" "$2.new"
  find "$2.new" -name __pycache__ -type d -prune -exec rm -rf {} + 2>/dev/null || true
  [ -e "$2" ] && mv "$2" "$2.old"
  mv "$2.new" "$2"
  rm -rf "$2.old"
}
for name in journal supervisor journal.py journal.sh; do
  swap "$SRC/$name" ".journal/src/$name"
done
mkdir -p .journal/src/web && swap "$SRC/web/dist" .journal/src/web/dist
[ -z "$TMP" ] || rm -rf "$TMP"
JOURNAL_ROOT="$PWD" "$PY" .journal/src/journal.py setup
