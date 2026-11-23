#!/bin/sh
# Builds and signs the journal-agent release of one version into /releases, inside a Go container, and keeps the
# three newest so an install line issued just before an install still downloads.
#   sh build-release.sh <version> <signing key>
set -eu

main() {
    version=$1
    key=$2
    trust_checkout
    build_release
    prune_releases
}

trust_checkout() {
    git config --global --add safe.directory '*'
}

build_release() {
    [ -d "/releases/$version" ] ||
        go run ./cmd/journal-release --version "$version" --signing-key "$key" --out "/releases/$version" --module .
}

prune_releases() {
    ls -1t /releases | tail -n +4 | sed 's|^|/releases/|' | xargs -r rm -rf
}

main "$@"
