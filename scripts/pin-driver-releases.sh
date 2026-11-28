#!/bin/sh
# Pins each driver image to the newest release of its program: writes the version into the driver's VERSION file
# and the sha256 of every archive its install.sh downloads into its digests.txt.   Usage: sh scripts/pin-driver-releases.sh
set -eu

DRIVERS=.docker/drivers
CODEX_RELEASES=https://github.com/openai/codex/releases
CLAUDE_RELEASES=https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases

main() {
    local folder codex claude
    folder=$(mktemp -d)
    codex=$(find_codex_version)
    claude=$(find_claude_version)
    pin_codex "$codex" "$folder"
    pin_claude "$claude" "$folder"
    rm -rf -- "$folder"
    echo "Codex $codex, Claude Code $claude"
}

# The newest Codex release, from the tag the latest release redirects to.
find_codex_version() {
    curl -fsSI "$CODEX_RELEASES/latest" | tr -d '\r' | sed -n 's#^[Ll]ocation: .*/tag/rust-v##p'
}

find_claude_version() {
    curl -fsSL "$CLAUDE_RELEASES/latest"
}

pin_codex() {
    local version="$1" folder="$2" program architecture
    write_header codex "Codex's native release archives this image installs" "of the archive" >"$folder/codex.txt"
    for program in codex codex-code-mode-host; do
        for architecture in arm64 amd64; do
            curl -fsSL -o "$folder/archive" "$CODEX_RELEASES/download/rust-v$version/$program-$(name_machine "$architecture")-unknown-linux-musl.tar.gz"
            echo "$program $version $architecture $(hash_file "$folder/archive")" >>"$folder/codex.txt"
        done
    done
    write_pin codex "$version" "$folder/codex.txt"
}

pin_claude() {
    local version="$1" folder="$2" architecture
    write_header claude-code "Claude Code's native release builds this image installs" "of the binary" >"$folder/claude.txt"
    for architecture in arm64 amd64; do
        curl -fsSL -o "$folder/binary" "$CLAUDE_RELEASES/$version/$(name_platform "$architecture")/claude"
        echo "claude-code $version $architecture $(hash_file "$folder/binary")" >>"$folder/claude.txt"
    done
    write_pin claude-code "$version" "$folder/claude.txt"
}

write_header() {
    echo "# $2: program, version, architecture, sha256 $3"
    echo "# downloaded. install.sh refuses any other file."
}

write_pin() {
    echo "$2" >"$DRIVERS/$1/VERSION"
    mv -- "$3" "$DRIVERS/$1/digests.txt"
}

# The sha256 of the file, by whichever of the two tools the machine has.
hash_file() {
    if command -v sha256sum >/dev/null; then
        sha256sum "$1" | cut -d' ' -f1
        return
    fi
    shasum -a 256 "$1" | cut -d' ' -f1
}

name_machine() {
    case "$1" in
        arm64) echo aarch64 ;;
        amd64) echo x86_64 ;;
    esac
}

name_platform() {
    case "$1" in
        arm64) echo linux-arm64 ;;
        amd64) echo linux-x64 ;;
    esac
}

main "$@"
