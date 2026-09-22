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
command -v python3 >/dev/null 2>&1 || { echo "python3 is required"; exit 1; }
REPO="${AGENT_JOURNAL_REPO:-https://github.com/jessegall/agent-journal}"
TMP="$(mktemp -d)"
git clone --quiet --depth 1 "$REPO" "$TMP/pkg"
PKG="$TMP/pkg"
[ -f "$PKG/src/install.py" ] && PKG="$PKG/src"
mkdir -p .journal/src
for f in "$PKG"/* "$TMP"/pkg/.gitignore; do
  case "$(basename "$f")" in
    install.sh|tests|__pycache__|.gitignore|README.md|CHANGELOG.md|CLAUDE.md) ;;
    web) mkdir -p .journal/src/web && rm -rf .journal/src/web/dist && cp -R "$f/dist" .journal/src/web/dist ;;
    *) rm -rf ".journal/src/$(basename "$f")" && cp -R "$f" .journal/src/ ;;
  esac
done
rm -rf "$TMP"
AGENT_JOURNAL_BOOTSTRAPPED=1 python3 .journal/src/install.py upgrade .
