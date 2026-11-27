#!/bin/sh
# Stands in for the installed Codex in a real-host test: each call plays what the real Codex recorded for it, its
# exchanges on pipes or a terminal recording by what is typed.
set -eu

main() {
    local installation
    installation=$(find_installation)
    case "${1:-}" in
        --version) play "$installation" version ;;
        login) play "$installation" login-status ;;
        exec) print_turn "$installation" ;;
        app-server) serve_app_server "$installation" ;;
        *) play_terminal "$installation" "$@" ;;
    esac
}

play_terminal() {
    local installation="$1"
    shift
    exec "$installation/bin/journal-agent" standin recording --recording "$installation/codex-terminal-turn" \
        --started "$installation/codex-started" --transcript "$CODEX_HOME/prompt-sent" -- "$@"
}

# The stand-in lives at <installation>/bin/codex and is found by name on the host's path.
find_installation() {
    cd "$(dirname "$0")/.." && pwd -P
}

play() {
    exec "$1/bin/journal-agent" standin exchange --recording "$1/exchanges/codex/$2"
}

# The app-server answers its device login and its turns as recorded: a turn's end is held by the hold file, a login
# completes once the user signed in in the browser; Codex keeps the sign-in in CODEX_HOME.
serve_app_server() {
    local installation="$1"
    [ -e "$CODEX_HOME/auth.json" ] || : > "$CODEX_HOME/auth.json"
    exec "$installation/bin/journal-agent" standin exchange --recording "$installation/exchanges/codex/app-server" \
        --recording "$installation/exchanges/codex/device-login" \
        --recording "$installation/exchanges/codex/resume-and-interrupt" --hold "$installation/hold" --hold-before turn/completed \
        --release-before "account/login/completed=$installation/browser-signed-in" --heard "$installation/codex-heard.jsonl"
}

print_turn() {
    local installation="$1"
    cat "$installation/codex-turn.jsonl"
}

main "$@"
