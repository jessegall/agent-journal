#!/bin/sh
# Builds the journal's Go programs for every platform it ships on into the folder given (dist by default), with a
# SHA-256 checksum file beside them. CGO is off, so each binary runs without a C library of the platform.
set -eu
out="${1:-dist}"
mkdir -p "$out"
out=$(cd "$out" && pwd)
for target in darwin/arm64 darwin/amd64 linux/arm64 linux/amd64 windows/amd64; do
    os=${target%/*}
    arch=${target#*/}
    suffix=""
    [ "$os" = "windows" ] && suffix=".exe"
    for program in journal-hook journal; do
        (cd "tools/$program" && CGO_ENABLED=0 GOOS="$os" GOARCH="$arch" go build -trimpath -ldflags="-s -w" -o "$out/$program-$os-$arch$suffix" .)
    done
done
(cd "$out" && shasum -a 256 journal-* > checksums.txt)
ls "$out"
