#!/bin/sh
# Makes the accounts root root's and readable by all, so only the agent host makes or removes an account's folder.
#   sh /settle-root.sh   (in the accounts-volume service)
set -eu

main() {
    chown 0:0 /srv/journal/accounts
    chmod 0755 /srv/journal/accounts
}

main "$@"
