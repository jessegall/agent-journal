#!/bin/sh
# A restic snapshot of the journal's volume once a day, kept 7 days and 4 weeks.
# It holds the project checkout, the journal's record and the server's home (provider login, the password hash and logins).
# It leaves out the journal's runtime folder: sockets, process ids and logs that mean nothing after a restart,
# and the values of the journal's secrets, which never leave the server.
set -eu
: "${RESTIC_PASSWORD:?set RESTIC_PASSWORD in .env}"
restic cat config >/dev/null 2>&1 || restic init
while true; do
    restic backup /data --exclude /data/project/.journal/runtime --exclude /data/secrets --exclude /data/.restoring --tag journal ${BACKUP_TAG:+--tag $BACKUP_TAG} --host journal
    restic forget --host journal --keep-daily 7 --keep-weekly 4 --keep-tag final --prune
    [ "${BACKUP_ONCE:-}" = "1" ] && exit 0
    sleep "${BACKUP_EVERY:-86400}"
done
