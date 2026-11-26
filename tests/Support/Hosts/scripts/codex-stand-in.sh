#!/bin/sh
# Stands in for the installed Codex in a real-host test: the pinned build, a ChatGPT sign-in for CODEX_HOME and its
# device-code login, a recorded exec turn, or a terminal recording played by what is typed.
set -eu

main() {
    local installation
    installation=$(installation_folder)
    case "${1:-}" in
        --version) print_build ;;
        login) print_sign_in ;;
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
installation_folder() {
    cd "$(dirname "$0")/.." && pwd -P
}

print_build() {
    echo "codex-cli 0.165.0"
}

print_sign_in() {
    echo "Logged in using ChatGPT"
}

# The app-server answers a device-code login, announces it completed a moment later, and reads the account; the
# login's sign-in is kept in CODEX_HOME as Codex keeps it.
serve_app_server() {
    local installation="$1"
    local request
    : > "$CODEX_HOME/auth.json"
    while IFS= read -r request; do
        case "$request" in
            *'"account/login/start"'*) answer_login "$installation" ;;
            *'"account/read"'*) cat "$installation/codex-app-server/account.json" ;;
        esac
    done
}

answer_login() {
    local installation="$1"
    cat "$installation/codex-app-server/login-started.json"
    sleep 1
    cat "$installation/codex-app-server/login-completed.json"
}

print_turn() {
    local installation="$1"
    cat "$installation/codex-turn.jsonl"
}

main "$@"
