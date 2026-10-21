#!/bin/sh
# Runs the supervisor with the Python $1 on the launch file $2, starts it again whenever it exits, and exits when it exits 0.
# It never changes and loads no code, so a supervisor restarted under it runs whatever code is on disk.
while true; do
    PYTHONPATH="$(dirname "$0")/.." "$1" -m supervisor "$2" && exit 0
    sleep 1
done
