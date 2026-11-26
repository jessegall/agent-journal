#!/bin/sh
# Downloads Claude Code and Codex as their native release builds into a folder, each checked against its pinned digest.
# Usage: sh install-programs.sh <architecture: arm64 or amd64> <claude-code version> <codex version> <folder>
set -eu

CLAUDE_RELEASES=https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases
CODEX_RELEASES=https://github.com/openai/codex/releases/download

main() {
    local architecture="$1"
    local claude_code="$2"
    local codex="$3"
    local folder="$4"
    mkdir -p "$folder"
    fetch_claude_code "$architecture" "$claude_code" "$folder/claude"
    fetch_codex "$architecture" "$codex" "$folder/codex"
    chmod 0555 "$folder/claude" "$folder/codex"
}

fetch_claude_code() {
    local architecture="$1"
    local version="$2"
    local target="$3"
    local platform
    platform=$(claude_platform "$architecture")
    curl -fsSL -o "$target" "$CLAUDE_RELEASES/$version/$platform/claude"
    check_digest claude-code "$version" "$architecture" "$target"
}

fetch_codex() {
    local architecture="$1"
    local version="$2"
    local target="$3"
    local triple
    triple="$(codex_machine "$architecture")-unknown-linux-musl"
    curl -fsSL -o "$target.tar.gz" "$CODEX_RELEASES/rust-v$version/codex-$triple.tar.gz"
    check_digest codex "$version" "$architecture" "$target.tar.gz"
    tar -xzf "$target.tar.gz" -C "$(dirname "$target")"
    mv "$(dirname "$target")/codex-$triple" "$target"
    rm "$target.tar.gz"
}

claude_platform() {
    case "$1" in
        arm64) echo linux-arm64 ;;
        amd64) echo linux-x64 ;;
        *) echo "no Claude Code build for $1" >&2; return 1 ;;
    esac
}

codex_machine() {
    case "$1" in
        arm64) echo aarch64 ;;
        amd64) echo x86_64 ;;
        *) echo "no Codex build for $1" >&2; return 1 ;;
    esac
}

# The pinned digest of a download, from program-digests.txt beside this script.
check_digest() {
    local program="$1"
    local version="$2"
    local architecture="$3"
    local file="$4"
    local wanted
    wanted=$(awk -v p="$program" -v v="$version" -v a="$architecture" '$1 == p && $2 == v && $3 == a { print $4 }' \
        "$(dirname "$0")/program-digests.txt")
    test -n "$wanted" || { echo "no pinned digest for $program $version $architecture" >&2; return 1; }
    echo "$wanted  $file" | sha256sum -c - >/dev/null
}

main "$@"
