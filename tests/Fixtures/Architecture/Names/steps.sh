#!/bin/sh
# A script whose steps report and answer instead of acting.
set -eu

main() {
    report_stop
    architecture_of
}

report_stop() {
    echo stopped
}

architecture_of() {
    uname -m
}

main "$@"
