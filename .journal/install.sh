#!/bin/sh
# agent-journal — install into the project in the current directory.
#
#   curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh
#
# Clones the package into ./.journal (a plain folder, not a nested git repository), then
# runs .journal/install.py --alias, which wires the hooks into .claude/settings.json,
# installs the skill, and puts a `journal` command in ~/.local/bin. Re-running upgrades.
set -e
if ! command -v git >/dev/null 2>&1; then echo "git is required"; exit 1; fi
if ! command -v python3 >/dev/null 2>&1; then echo "python3 is required"; exit 1; fi
REPO="${AGENT_JOURNAL_REPO:-https://github.com/jessegall/agent-journal}"
TMP="$(mktemp -d)"
git clone --quiet --depth 1 "$REPO" "$TMP/pkg"
if [ -f .journal/install.py ]; then
  python3 .journal/install.py --from "$TMP/pkg" --alias
else
  mkdir -p .journal
  for f in "$TMP"/pkg/* "$TMP"/pkg/.gitignore; do
    case "$(basename "$f")" in
      record.json|settings.json|todo|runtime|__pycache__|install.sh) ;;
      *) cp -R "$f" .journal/ ;;
    esac
  done
  python3 .journal/install.py --alias
fi
rm -rf "$TMP"
