#!/bin/sh
# agent-journal — install into the project in the current directory, or upgrade it.
#
#   curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh
#
# The package is copied into ./.journal beside the project's own record; then install.py
# wires the hooks of every agent present, writes the skills, puts the `journal` command in
# ~/.local/bin, and runs the migrations. Running it again upgrades.
set -e
command -v git >/dev/null 2>&1 || { echo "git is required"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "python3 is required"; exit 1; }
REPO="${AGENT_JOURNAL_REPO:-https://github.com/jessegall/agent-journal}"
TMP="$(mktemp -d)"
git clone --quiet --depth 1 "$REPO" "$TMP/pkg"
mkdir -p .journal
for f in "$TMP"/pkg/* "$TMP"/pkg/.gitignore; do
  case "$(basename "$f")" in
    install.sh|tests|__pycache__|.gitignore|README.md|CHANGELOG.md|CLAUDE.md) ;;
    web) mkdir -p .journal/web && rm -rf .journal/web/dist && cp -R "$f/dist" .journal/web/dist ;;
    *) rm -rf ".journal/$(basename "$f")" && cp -R "$f" .journal/ ;;
  esac
done
rm -rf "$TMP"
python3 .journal/install.py upgrade .
