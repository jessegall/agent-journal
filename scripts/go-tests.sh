#!/bin/sh
# Runs the Go tests of tools/journal-agent in the Go image, as Linux, with the module and build caches kept.
# Usage: sh scripts/go-tests.sh [go test arguments, ./... by default]
set -eu

main() {
    root=$(find_root)
    packages=${*:-./...}
    run_tests "$root" "$packages"
}

find_root() {
    cd "$(dirname "$0")/.." && pwd
}

run_tests() {
    local root="$1"
    local packages="$2"
    docker run --rm \
        -v "$root/tools/journal-agent:/src" \
        -v journal-go-cache:/root/.cache \
        -v journal-go-mod:/go/pkg/mod \
        -w /src golang:1.26.4-bookworm \
        sh -c "go test -count=1 $packages"
}

main "$@"
