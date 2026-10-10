#!/bin/sh
# agent-journal — install into the project in the current directory, or upgrade it.
#
#   curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh
#
# The package is copied into ./.journal/src, apart from the project's own record; then install.py
# wires the hooks of every agent present, writes the skills, puts the `journal` command in
# ~/.local/bin, and runs the migrations. Running it again upgrades.
set -e
command -v git >/dev/null 2>&1 || { echo "git is required"; exit 1; }
PY=""
for candidate in python3.14 python3.13 python3.12 python3.11 python3; do
  command -v "$candidate" >/dev/null 2>&1 || continue
  "$candidate" -c 'import sys; sys.exit(sys.version_info < (3, 11))' 2>/dev/null && { PY="$candidate"; break; }
done
if [ -z "$PY" ]; then
  echo "No Python 3.11 or newer here (a Mac's own python3 is 3.9); fetching Python 3.13 with uv."
  command -v uv >/dev/null 2>&1 || curl -LsSf https://astral.sh/uv/install.sh | sh >/dev/null
  UV="$(command -v uv 2>/dev/null || echo "$HOME/.local/bin/uv")"
  "$UV" python install 3.13 >/dev/null && PY="$("$UV" python find 3.13)"
fi
[ -n "$PY" ] || { echo "Python 3.11 or newer is needed and could not be fetched. Install one, such as: brew install python@3.13"; exit 1; }
REPO="${AGENT_JOURNAL_REPO:-https://github.com/jessegall/agent-journal}"
TMP="$(mktemp -d)"
git clone --quiet --depth 1 "$REPO" "$TMP/pkg"
PKG="$TMP/pkg"
[ -f "$PKG/src/install.py" ] && PKG="$PKG/src"
mkdir -p .journal/src
[ ! -f "$TMP/pkg/VERSION" ] || cp "$TMP/pkg/VERSION" .journal/src/VERSION
for f in "$PKG"/* "$TMP"/pkg/.gitignore; do
  case "$(basename "$f")" in
    install.sh|tests|__pycache__|.gitignore|README.md|CHANGELOG.md|CLAUDE.md) ;;
    web) mkdir -p .journal/src/web && rm -rf .journal/src/web/dist && cp -R "$f/dist" .journal/src/web/dist ;;
    *) rm -rf ".journal/src/$(basename "$f")" && cp -R "$f" .journal/src/ ;;
  esac
done
rm -rf "$TMP"
AGENT_JOURNAL_BOOTSTRAPPED=1 "$PY" .journal/src/install.py upgrade .
