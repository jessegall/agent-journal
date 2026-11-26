#!/bin/sh
# Stands in for the installed Claude Code in a real-host test: prints the pinned build, a sign-in in the account's own
# folder, or a recorded headless turn whose second half waits while the installation's hold file exists.
set -eu

main() {
    local installation
    installation=$(installation_folder)
    case "${1:-}" in
        --version) print_build ;;
        auth) print_sign_in ;;
        *) print_turn "$installation" ;;
    esac
}

# The stand-in lives at <installation>/bin/claude.
installation_folder() {
    cd "$(dirname "$0")/.." && pwd -P
}

print_build() {
    echo "2.1.323 (Claude Code)"
}

print_sign_in() {
    printf '{"loggedIn":true,"authMethod":"claude.ai","configDirectory":"%s"}\n' "$CLAUDE_CONFIG_DIR"
}

print_turn() {
    local installation="$1"
    head -n 3 "$installation/turn.jsonl"
    wait_while_held "$installation/hold"
    tail -n +4 "$installation/turn.jsonl"
}

# A hold never outlasts a minute, so a stand-in of a failed test does not run on.
wait_while_held() {
    local hold="$1"
    local waited=0
    while [ -e "$hold" ] && [ "$waited" -lt 1200 ]; do
        sleep 0.05
        waited=$((waited + 1))
    done
}

main "$@"
