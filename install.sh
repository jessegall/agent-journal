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
# The journal runs on Python 3.14 and nothing older; the interpreter found is written to .journal/python, which every
# start of the journal runs, so an older python3 first on the PATH is never the one that runs it.
find_python() {
  PY=""
  for candidate in python3.14 python3 /Library/Frameworks/Python.framework/Versions/3.14/bin/python3.14 "$(command -v uv >/dev/null 2>&1 && uv python find 3.14 2>/dev/null)"; do
    [ -n "$candidate" ] && command -v "$candidate" >/dev/null 2>&1 || continue
    "$candidate" -c 'import sys; sys.exit(sys.version_info < (3, 14))' 2>/dev/null && { PY="$(command -v "$candidate")"; return 0; }
  done
  return 1
}
# Python 3.14 from python.org's installer for the Mac, the newest release of 3.14 that has one: it needs no Xcode, where
# Homebrew builds Python from source on a macOS it no longer has packages for, and fails on an old Xcode.
python_org() {
  for version in $(curl -fsSL https://www.python.org/ftp/python/ | grep -o '3\.14\.[0-9]*/' | tr -d / | sort -u -t. -k3,3nr | head -3); do
    package="${TMPDIR:-/tmp}/python-$version-macos11.pkg"
    curl -fsSL -o "$package" "https://www.python.org/ftp/python/$version/python-$version-macos11.pkg" || continue
    sudo installer -pkg "$package" -target / && rm -f "$package" && return 0
  done
  echo "Python 3.14 could not be installed from python.org: install it from https://www.python.org/downloads/, then run this again." >&2
  exit 1
}
# What the journal needs and is missing is offered and, on a yes, installed: Python 3.14 with uv, python.org's installer
# on a Mac or Homebrew elsewhere; git with Homebrew or, on a Mac without it, the command line tools.
offer() {
  what="$1"; way="$2"; said="${3:-$2}"
  [ -n "$way" ] || { echo "agent-journal needs $what, and nothing here can install it: install $what, then run this again." >&2; exit 1; }
  echo "agent-journal needs $what, and none is installed here."
  answer="${AGENT_JOURNAL_YES:+y}"
  if [ -z "$answer" ]; then
    printf 'Install %s now, with: %s? [y/N] ' "$what" "$said"
    { read -r answer < /dev/tty; } 2>/dev/null || true
  fi
  case "$answer" in y|Y|yes|Yes) $way ;; *) echo "Nothing changed. Install $what, then run this again."; exit 0 ;; esac
}
if ! find_python; then
  if command -v uv >/dev/null 2>&1; then offer "Python 3.14" "uv python install 3.14"
  elif [ "$(uname)" = Darwin ]; then offer "Python 3.14" python_org "python.org's installer, which asks for your password"
  elif command -v brew >/dev/null 2>&1; then offer "Python 3.14" "brew install python@3.14"
  else offer "Python 3.14" ""; fi
  find_python || { echo "Python 3.14 is still not found after its install" >&2; exit 1; }
fi
if ! command -v git >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then offer git "brew install git"
  elif [ "$(uname)" = Darwin ]; then offer git "xcode-select --install"
  else offer git ""; fi
  command -v git >/dev/null 2>&1 || { echo "git is not found yet: once its install has finished, run this again." >&2; exit 1; }
fi
HERE="$(cd "$(dirname "$0")" 2>/dev/null && pwd)"
TMP=""
if [ -d "$HERE/src/journal" ]; then
  SRC="$HERE/src"
else
  REPO="${AGENT_JOURNAL_REPO:-https://github.com/jessegall/agent-journal}"
  REF="${AGENT_JOURNAL_REF:-main}"
  TMP="$(mktemp -d)"
  git clone --quiet --depth 1 --branch "$REF" "$REPO" "$TMP/pkg"
  SRC="$TMP/pkg/src"
fi
# A journal from before version 4 is moved whole into .journal/version-3 before anything is written, and is never changed after;
# should the install fail before the new journal is up, it is put back where it was.
BACKED=""
restore() {
  [ -n "$BACKED" ] || return 0
  mv .journal/version-3 .journal-version-3 && rm -rf .journal && mv .journal-version-3 .journal
  echo "the install failed: the version 3 journal is back where it was" >&2
}
trap 'code=$?; rm -f .journal/runtime/journal.starting; [ "$code" -eq 0 ] || restore' EXIT
# Whether the journal listening on a port runs from this project, by its command line or its working folder; with no
# lsof to ask, it is taken as this project's, as the port file says.
this_projects() {
  command -v lsof >/dev/null 2>&1 || return 0
  pid=$(lsof -t -nP -iTCP:"$1" -sTCP:LISTEN 2>/dev/null | head -n 1)
  [ -n "$pid" ] || return 1
  ps -o command= -p "$pid" | grep -qF "$PWD/" && return 0
  [ "$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')" = "$PWD" ]
}
# Every journal from before version 4 writes its version in src/VERSION, 2.x as much as 3.x; version 4 writes none.
old_major=$(cut -d. -f1 .journal/src/VERSION 2>/dev/null | tr -cd '0-9')
if [ -n "$old_major" ] && [ "$old_major" -lt 4 ]; then
  echo "This project has a journal from before version 4 ($(cat .journal/src/VERSION)). It will be stopped and kept whole in .journal/version-3, then version 4 is"
  echo "installed, and the viewer offers to bring everything across. Nothing is lost."
  if [ "${AGENT_JOURNAL_YES:-}" != 1 ]; then
    printf 'Go ahead? [y/N] '
    answer=""
    { read -r answer < /dev/tty; } 2>/dev/null || true
    case "$answer" in y|Y|yes|Yes) ;; *) echo "Nothing changed."; exit 0 ;; esac
  fi
  port=$(cat .journal/port 2>/dev/null || true)
  if [ -n "$port" ] && ! this_projects "$port"; then
    echo "the journal on port $port is another project's: left running"
    port=""
  fi
  if [ -n "$port" ]; then
    curl -fsS -m 5 -X POST -H 'Content-Type: application/json' -d '{}' "http://127.0.0.1:$port/api/stop" >/dev/null 2>&1 || true
    for _ in 1 2 3 4 5 6 7 8 9 10; do
      curl -fs -m 1 "http://127.0.0.1:$port/" >/dev/null 2>&1 || break
      sleep 1
    done
  fi
  mv .journal .journal-version-3
  mkdir .journal
  mv .journal-version-3 .journal/version-3
  BACKED=1
  echo "the version 3 journal is kept whole in .journal/version-3"
fi
# Going back a version: the record was written by the newer code, whose models the older code may not read.
installed=$(sed -n 's/^VERSION = "\(.*\)"$/\1/p' .journal/src/journal/version.py 2>/dev/null || true)
bringing=$(sed -n 's/^VERSION = "\(.*\)"$/\1/p' "$SRC/journal/version.py" 2>/dev/null || true)
if [ -n "$installed" ] && [ -n "$bringing" ] && "$PY" -c 'import sys; v = lambda s: tuple(int(n) for n in s.split(".")); sys.exit(0 if v(sys.argv[1]) < v(sys.argv[2]) else 1)' "$bringing" "$installed"; then
  echo "This installs $bringing over $installed: an earlier version. The journal's record was written by $installed, and"
  echo "$bringing's models may not read it, so the journal may fail to start or lose what it cannot read. Staying on"
  echo "$installed or later is advised."
  if [ "${AGENT_JOURNAL_YES:-}" != 1 ]; then
    printf 'Install the earlier version anyway? [y/N] '
    answer=""
    { read -r answer < /dev/tty; } 2>/dev/null || true
    case "$answer" in y|Y|yes|Yes) ;; *) echo "Nothing changed: $installed stays."; exit 0 ;; esac
  fi
fi
mkdir -p .journal/src
printf '%s\n' "$PY" > .journal/python
# While the code is copied and set up, the running journal is told it is starting, so it does not take the copying
# for a slow request of its own; the exit trap above takes the mark away.
mkdir -p .journal/runtime
touch .journal/runtime/journal.starting
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
# The commit installed, so a journal that follows a branch knows whether the branch has moved on.
git -C "$SRC/.." rev-parse HEAD > .journal/src/commit 2>/dev/null || printf '' > .journal/src/commit
[ -z "$TMP" ] || rm -rf "$TMP"
JOURNAL_ROOT="$PWD" "$PY" .journal/src/journal.py setup
