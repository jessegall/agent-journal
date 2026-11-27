#!/bin/sh
# Prints the digest of what the agent image runs besides the drivers: its Dockerfile, the drivers' installer and pins,
# and every Go file of the programs the image builds, with the packages they import. Usage: sh scripts/agent-image-programs.sh
set -eu

main() {
    local root packages files
    root=$(find_root)
    packages=$(list_packages "$root")
    files=$(list_files "$root" "$packages")
    print_digest "$root" "$files"
}

find_root() {
    cd "$(dirname "$0")/.." && pwd
}

# The programs are the ones the image's Dockerfile builds; each package is followed to the module's packages it imports.
list_packages() {
    local root queue seen package
    root=$1
    queue=$(grep -o '\./cmd/journal-[a-z-]*' "$root/.docker/helper/Dockerfile" | sed 's#^\./##' | sort -u)
    seen=""
    while [ -n "$queue" ]; do
        package=$(printf '%s\n' "$queue" | head -n 1)
        queue=$(printf '%s\n' "$queue" | sed '1d')
        case " $seen " in *" $package "*) continue ;; esac
        seen="$seen $package"
        queue=$(printf '%s\n%s\n' "$queue" "$(read_imports "$root/programs/runner/$package")" | sed '/^$/d')
    done
    printf '%s\n' $seen | sort
}

# The module's own packages the package's files import, its tests left out.
read_imports() {
    local file
    for file in "$1"/*.go; do
        case "$file" in *_test.go) continue ;; esac
        grep -o '"journal-runner/[^"]*"' "$file" || true
    done | tr -d '"' | sed 's#^journal-runner/##' | sort -u
}

list_files() {
    local root package file
    root=$1
    printf '%s\n' .docker/helper/Dockerfile .docker/helper/install-drivers.sh .docker/helper/driver-digests.txt
    for package in $2; do
        for file in "$root/programs/runner/$package"/*.go; do
            case "$file" in *_test.go) continue ;; esac
            [ -f "$file" ] || continue
            printf '%s\n' "${file#"$root"/}"
        done
    done
}

print_digest() {
    local root
    root=$1
    cd "$root"
    printf '%s\n' "$2" | sort | while read -r file; do shasum -a 256 "$file"; done | shasum -a 256 | cut -d' ' -f1
}

main "$@"
