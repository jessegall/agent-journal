#!/bin/sh
# Builds the test host the PHP real-host tests start, once per source hash, in the Go image, without the Go tests,
# and removes the builds of older sources.
# Usage: sh scripts/go-test-host.sh
set -eu

main() {
    local root
    root=$(find_root)
    build_test_host "$root"
}

find_root() {
    cd "$(dirname "$0")/.." && pwd
}

build_test_host() {
    mkdir -p "$1/storage/framework/test-host"
    docker run --rm \
        -v "$1/programs/runner:/src" \
        -v "$1/storage/framework/test-host:/out" \
        -v journal-go-cache:/root/.cache \
        -v journal-go-mod:/go/pkg/mod \
        -w /src golang:1.26.4-bookworm \
        sh -c 'hash=$(find . -name "*.go" -o -name go.mod -o -name go.sum | LC_ALL=C sort | xargs cat | sha256sum | cut -c1-16)
            test -x "/out/journal-runner-$hash" || go build -tags mock -o "/out/journal-runner-$hash" ./cmd/journal-runner
            find /out -name "journal-runner-*" ! -name "journal-runner-$hash" -delete
            echo "test host $hash"'
}

main "$@"
