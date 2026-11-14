#!/bin/sh
# Packs the release's code, the src folder, into agent-journal.tar.gz in the folder given (dist by default) and adds its
# SHA-256 line to the checksums.txt beside it, which install.sh checks before it unpacks anything. Only what the
# release runs goes in: no compiled Python, no installed packages, no viewer tests, no editor or backup leftovers.
set -eu
out="${1:-dist}"
mkdir -p "$out"
out=$(cd "$out" && pwd)
COPYFILE_DISABLE=1 tar -czf "$out/agent-journal.tar.gz" \
    --exclude='__pycache__' --exclude='*.pyc' --exclude='node_modules' --exclude='.venv' --exclude='.DS_Store' \
    --exclude='*.bak' --exclude='*.orig' --exclude='*.rej' --exclude='*.swp' --exclude='*~' --exclude='src/viewer/tests' \
    src
touch "$out/checksums.txt"
grep -v ' agent-journal.tar.gz$' "$out/checksums.txt" > "$out/checksums.txt.new" || true
(cd "$out" && shasum -a 256 agent-journal.tar.gz >> checksums.txt.new)
mv "$out/checksums.txt.new" "$out/checksums.txt"
