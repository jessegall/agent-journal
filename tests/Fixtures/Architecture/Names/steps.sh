#!/bin/sh
# A script whose steps report and answer instead of acting.
set -eu

main() {
    report_stop
    ledger_of
}

report_stop() {
    echo stopped
}

ledger_of() {
    uname -m
}

main "$@"
