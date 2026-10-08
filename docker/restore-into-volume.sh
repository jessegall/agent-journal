#!/bin/sh
# Runs inside the restore service: unpacks the snapshot beside the journal's files first, and only once it is
# whole replaces them, so a snapshot that cannot be read leaves the volume as it was.
set -eu
STAGED=/data/.restoring
rm -rf "$STAGED"
restic restore "$SNAPSHOT" --target "$STAGED" --host journal
[ -d "$STAGED/data" ] || { echo "snapshot $SNAPSHOT holds no journal volume" >&2; rm -rf "$STAGED"; exit 1; }
find /data -mindepth 1 -maxdepth 1 ! -name .restoring -exec rm -rf {} +
for kept in "$STAGED"/data/* "$STAGED"/data/.[!.]*; do
    [ -e "$kept" ] && mv "$kept" /data/
done
rm -rf "$STAGED"
# A restored journal is a journal to bring back: the updater starts it once this folder no longer says it was taken down.
rm -rf /data/updater
