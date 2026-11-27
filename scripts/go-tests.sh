#!/bin/sh
# Runs the Go tests of programs/agent in the Go image, as Linux, with the module and build caches kept, then
# builds the host the PHP suite's real-host tests start, once per source hash. Usage: sh scripts/go-tests.sh [packages]
set -eu

main() {
    root=$(find_root)
    packages=${*:-./...}
    run_tests "$root" "$packages"
    build_test_host "$root"
}

find_root() {
    cd "$(dirname "$0")/.." && pwd
}

run_tests() {
    local root="$1"
    local packages="$2"
    run_in_go "$root" "go test -tags mock -count=1 $packages"
}

# The harness finds the binary by the same hash of the Go sources (tests/Support/Hosts/TestHost.php).
build_test_host() {
    sh "$1/scripts/go-test-host.sh"
}

run_in_go() {
    local root="$1"
    local command="$2"
    mkdir -p "$root/storage/framework/test-host"
    docker run --rm \
        -v "$root/programs/agent:/src" \
        -v "$root/resources/recordings:/resources/recordings:ro" \
        -v "$root/storage/framework/test-host:/out" \
        -v journal-go-cache:/root/.cache \
        -v journal-go-mod:/go/pkg/mod \
        -w /src golang:1.26.4-bookworm \
        sh -c "$command"
}

main "$@"
