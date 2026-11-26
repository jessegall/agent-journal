# The hold both program stand-ins wait on: a turn waits while the hold file exists, never longer than a minute, so a
# stand-in of a failed test does not run on. Sourced from the installation folder.
wait_while_held() {
    local hold="$1"
    local waited=0
    while [ -e "$hold" ] && [ "$waited" -lt 1200 ]; do
        sleep 0.05
        waited=$((waited + 1))
    done
}
