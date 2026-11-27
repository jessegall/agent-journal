#!/bin/sh
# Downloads Codex and its code-mode host as their native release archives into a folder, each checked against its
# pinned digest in digests.txt.   Usage: sh install.sh <architecture: arm64 or amd64> <version> <folder>
set -eu

RELEASES=https://github.com/openai/codex/releases/download

main() {
    local architecture="$1" version="$2" folder="$3"
    mkdir -p "$folder"
    fetch_program codex "$architecture" "$version" "$folder"
    fetch_program codex-code-mode-host "$architecture" "$version" "$folder"
    chmod 0555 "$folder/codex" "$folder/codex-code-mode-host"
}

# One program of a Codex release, from its own archive, into the folder under its plain name.
fetch_program() {
    local program="$1" architecture="$2" version="$3" folder="$4" triple
    triple="$(name_machine "$architecture")-unknown-linux-musl"
    curl -fsSL -o "$folder/$program.tar.gz" "$RELEASES/rust-v$version/$program-$triple.tar.gz"
    check_digest "$program" "$version" "$architecture" "$folder/$program.tar.gz"
    tar -xzf "$folder/$program.tar.gz" -C "$folder"
    mv "$folder/$program-$triple" "$folder/$program"
    rm -f -- "$folder/$program.tar.gz"
}

name_machine() {
    case "$1" in
        arm64) echo aarch64 ;;
        amd64) echo x86_64 ;;
        *) echo "no Codex build for $1" >&2; return 1 ;;
    esac
}

check_digest() {
    local wanted
    wanted=$(awk -v p="$1" -v v="$2" -v a="$3" '$1 == p && $2 == v && $3 == a { print $4 }' "$(dirname "$0")/digests.txt")
    [ -n "$wanted" ] || { echo "no pinned digest for $1 $2 $3" >&2; return 1; }
    echo "$wanted  $4" | sha256sum -c - >/dev/null
}

main "$@"
