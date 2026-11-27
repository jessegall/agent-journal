#!/bin/sh
# Downloads Claude Code's native release build into a folder, checked against its pinned digest in digests.txt.
# Usage: sh install.sh <architecture: arm64 or amd64> <version> <folder>
set -eu

RELEASES=https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases

main() {
    local architecture="$1" version="$2" folder="$3" platform
    mkdir -p "$folder"
    platform=$(platform_of "$architecture")
    curl -fsSL -o "$folder/claude" "$RELEASES/$version/$platform/claude"
    check_digest "$version" "$architecture" "$folder/claude"
    chmod 0555 "$folder/claude"
}

platform_of() {
    case "$1" in
        arm64) echo linux-arm64 ;;
        amd64) echo linux-x64 ;;
        *) echo "no Claude Code build for $1" >&2; return 1 ;;
    esac
}

check_digest() {
    local wanted
    wanted=$(awk -v v="$1" -v a="$2" '$1 == "claude-code" && $2 == v && $3 == a { print $4 }' \
        "$(dirname "$0")/digests.txt")
    [ -n "$wanted" ] || { echo "no pinned digest for claude-code $1 $2" >&2; return 1; }
    echo "$wanted  $3" | sha256sum -c - >/dev/null
}

main "$@"
