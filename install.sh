#!/bin/sh
# agent-journal, version 5: install the journal's hook into the project in the current directory.
#
#   sh /path/to/agent-journal/install.sh
#
# The hook program built for this machine is downloaded from the release into .journal/bin/journal-hook, its
# checksum is checked against the release's checksums.txt, and it is run once to see that it starts. The hooks of
# Claude Code (.claude/settings.local.json) and Codex (.codex/hooks.json) then call it by its full path; the rest of
# those files stays as it was. When no binary is built for this machine, the release has none, or it does not start,
# the hooks call .journal/hooks/hook.sh instead, which hands the server the raw hook body, and the install says so.
# A checksum that does not match stops the install: that file is not the release's.
#
# JOURNAL_RELEASE_URL names another place to download from, a file:// folder among them; JOURNAL_PLATFORM names the
# platform as os/arch instead of the one uname reports.
set -eu

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(pwd)"
RELEASE="${JOURNAL_RELEASE_URL:-https://github.com/jessegall/agent-journal/releases/latest/download}"
BIN="$ROOT/.journal/bin"

fail() {
  echo "$1" >&2
  exit 1
}

platform() {
  if [ -n "${JOURNAL_PLATFORM:-}" ]; then
    echo "$JOURNAL_PLATFORM"
    return
  fi
  os=$(uname -s | tr '[:upper:]' '[:lower:]')
  case "$(uname -m)" in
    x86_64 | amd64) arch=amd64 ;;
    arm64 | aarch64) arch=arm64 ;;
    *) arch=$(uname -m) ;;
  esac
  echo "$os/$arch"
}

checksum() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | cut -d' ' -f1
  else
    shasum -a 256 "$1" | cut -d' ' -f1
  fi
}

fall_back() {
  mkdir -p "$ROOT/.journal/hooks"
  cp "$HERE/src/install/hook.sh" "$ROOT/.journal/hooks/hook.sh"
  PYTHONPATH="$HERE/src" python3 -m install.hook_writer "$ROOT" "sh \"$ROOT/.journal/hooks/hook.sh\""
  echo "$1, so the hooks of Claude Code and Codex call $ROOT/.journal/hooks/hook.sh, which the server answers more slowly"
  exit 0
}

target=$(platform)
case "$target" in
  darwin/arm64 | darwin/amd64 | linux/arm64 | linux/amd64) ;;
  *) fall_back "no journal-hook is built for $target (build one with go build ./tools/journal-hook)" ;;
esac
name="journal-hook-${target%/*}-${target#*/}"

download=$(mktemp -d)
trap 'rm -rf "$download"' EXIT
curl -fsSL "$RELEASE/$name" -o "$download/$name" || fall_back "the release has no $name"
curl -fsSL "$RELEASE/checksums.txt" -o "$download/checksums.txt" || fall_back "the release has no checksums.txt"
expected=$(awk -v name="$name" '$2 == name {print $1}' "$download/checksums.txt")
[ -n "$expected" ] || fall_back "the release's checksums.txt names no $name"
[ "$(checksum "$download/$name")" = "$expected" ] || fail "the checksum of $name does not match the release's, so it is not installed"

mkdir -p "$BIN"
chmod +x "$download/$name"
mv "$download/$name" "$BIN/journal-hook"
"$BIN/journal-hook" --version >/dev/null 2>&1 || fall_back "$BIN/journal-hook does not start on this machine"

PYTHONPATH="$HERE/src" python3 -m install.hook_writer "$ROOT" "\"$BIN/journal-hook\""
echo "the hooks of Claude Code and Codex call $BIN/journal-hook"
