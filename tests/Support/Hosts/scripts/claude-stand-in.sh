#!/bin/sh
# Stands in for the installed Claude Code in a real-host test: the pinned build, a sign-in in the account's own folder,
# a recorded headless turn held by the installation's hold file, or a terminal recording played by what is typed.
set -eu

main() {
    local installation
    installation=$(installation_folder)
    case "${1:-}" in
        --version) print_build ;;
        auth) print_sign_in ;;
        *) start_session "$installation" "$@" ;;
    esac
}

# A start with --print is a headless turn; any other is an interactive terminal.
start_session() {
    local installation="$1"
    shift
    case " $* " in
        *" --print "*) print_turn "$installation" ;;
        *) play_terminal "$installation" "$@" ;;
    esac
}

play_terminal() {
    local installation="$1"
    shift
    local transcript
    transcript=$(transcript_path "$@")
    exec "$installation/bin/journal-agent" standin recording --recording "$installation/terminal-turn" \
        --started "$installation/started" --transcript "$transcript" -- "$@"
}

# Claude Code keeps the conversation of --session-id or --resume in its configuration folder, by working folder.
transcript_path() {
    local conversation=unnamed
    while [ "$#" -gt 1 ]; do
        case "$1" in
            --session-id|--resume) conversation="$2" ;;
        esac
        shift
    done
    printf '%s/projects/%s/%s.jsonl\n' "$CLAUDE_CONFIG_DIR" "$(pwd | tr / -)" "$conversation"
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
