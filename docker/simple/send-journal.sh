#!/bin/sh
# Sends this project's journal record to a hosted journal, which takes it in on the restart this starts. Run it in the
# project on your own machine:
#   sh send-journal.sh <user@server> [folder of docker/simple on the server]   a journal on a server, over ssh
#   sh send-journal.sh --container <name>                                      a journal container on this machine
set -eu
USAGE="sh send-journal.sh <user@server> [folder of docker/simple on the server], or sh send-journal.sh --container <name>"
TARGET="${1:?$USAGE}"
[ -f .journal/journal.db ] || { echo "run this in the project, where .journal/journal.db is" >&2; exit 1; }
PYTHON="$(cat .journal/python 2>/dev/null || echo python3)"
PACK="$(mktemp -d)"
trap 'rm -rf "$PACK"' EXIT
# A copy made through sqlite's backup is whole even while the journal here is running and writing.
"$PYTHON" -c 'import sqlite3, sys; source, copy = sqlite3.connect(sys.argv[1]), sqlite3.connect(sys.argv[2]); source.backup(copy); copy.close(); source.close()' \
    .journal/journal.db "$PACK/journal.db"
[ ! -f .journal/project-id ] || cp .journal/project-id "$PACK/"
[ ! -d .journal/readers ] || cp -R .journal/readers "$PACK/"
UNPACK="rm -rf /data/import && mkdir -p /data/import && tar -xzf - -C /data/import"
if [ "$TARGET" = "--container" ]; then
    CONTAINER="${2:?$USAGE}"
    COPYFILE_DISABLE=1 tar -C "$PACK" --no-xattrs -czf - . | docker exec -i "$CONTAINER" sh -c "$UNPACK"
    docker restart "$CONTAINER" >/dev/null
    echo "sent: the journal in container $CONTAINER takes the record in as it starts again"
else
    FOLDER="${2:-agent-journal/docker/simple}"
    COPYFILE_DISABLE=1 tar -C "$PACK" --no-xattrs -czf - . | ssh "$TARGET" "cd '$FOLDER' && docker compose exec -T journal sh -c '$UNPACK' && docker compose restart journal"
    echo "sent: the journal on $TARGET takes the record in as it starts again"
fi
