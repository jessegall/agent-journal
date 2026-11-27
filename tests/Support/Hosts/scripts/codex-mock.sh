#!/bin/sh
# The installed Codex's mock in a real-host test: a call that only prints plays what the real Codex recorded, the
# app-server answers as the test's script says, and a terminal plays its recording by what is typed.
set -eu

main() {
    local installation
    installation=$(find_installation)
    case "${1:-}" in
        --version) play "$installation" version ;;
        login) play "$installation" login-status ;;
        app-server) serve_app_server "$installation" ;;
        *) play_terminal "$installation" "$@" ;;
    esac
}

play_terminal() {
    local installation="$1"
    shift
    exec "$installation/bin/journal-agent" mock recording --recording "$installation/codex-terminal-turn" \
        --started "$installation/codex-started" --transcript "$CODEX_HOME/prompt-sent" -- "$@"
}

# The mock lives at <installation>/bin/codex and is found by name on the host's path.
find_installation() {
    cd "$(dirname "$0")/.." && pwd -P
}

play() {
    exec "$1/bin/journal-agent" mock print --recording "$1/exchanges/codex/$2"
}

# The app-server plays the test's script for it in order; Codex keeps the sign-in in CODEX_HOME.
serve_app_server() {
    local installation="$1"
    [ -e "$CODEX_HOME/auth.json" ] || : > "$CODEX_HOME/auth.json"
    exec "$installation/bin/journal-agent" mock script --script "$installation/mocks/codex-app-server.json" \
        --failures "$installation/mocks/failures.jsonl" --heard "$installation/codex-heard.jsonl" \
        --steps-ran "$installation/mocks/steps"
}

main "$@"
