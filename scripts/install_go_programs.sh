#!/bin/sh
# Builds the four Go programs of this checkout into .journal/bin, each replaced only once it has built.
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)
for program in journal journal-hook journal-run journal-shared; do
  go -C "$ROOT/tools/$program" build -o "$ROOT/.journal/bin/$program.new" .
  mv "$ROOT/.journal/bin/$program.new" "$ROOT/.journal/bin/$program"
  echo "built $program"
done
