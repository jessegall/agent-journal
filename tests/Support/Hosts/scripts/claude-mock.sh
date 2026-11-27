#!/bin/sh
# The installed Claude Code's mock in a real-host test: its recorded build and sign-in, its login as the test's script
# says, a recorded headless turn held by the hold file, or a terminal recording played by what is typed.
set -eu

main() {
    local installation
    installation=$(find_installation)
    case "${1:-}" in
        --version) play "$installation" version ;;
        auth) answer_auth "$installation" "${2:-}" ;;
        *) start_session "$installation" "$@" ;;
    esac
}

# A start with --print is a headless turn; any other is an interactive terminal.
start_session() {
    local installation="$1"
    shift
    assert_model_and_effort "$@"
    case " $* " in
        *" --print "*) print_turn "$installation" ;;
        *) play_terminal "$installation" "$@" ;;
    esac
}

# A start names its model with --model and its effort in the settings file --settings names, never the driver's own.
assert_model_and_effort() {
    local settings=""
    case " $* " in *" --model "*) ;; *) refuse_start "a start without --model" ;; esac
    while [ "$#" -gt 1 ]; do
        [ "$1" = "--settings" ] && settings="$2"
        shift
    done
    grep -q '"effortLevel"' "$settings" 2>/dev/null || refuse_start "a start whose settings name no effortLevel"
}

refuse_start() {
    printf 'claude mock: %s\n' "$1" >&2
    exit 1
}

play_terminal() {
    local installation="$1"
    shift
    local transcript
    transcript=$(transcript_path "$@")
    exec "$installation/bin/journal-agent" mock recording --recording "$installation/terminal-turn" \
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

# The mock lives at <installation>/bin/claude.
find_installation() {
    cd "$(dirname "$0")/.." && pwd -P
}

play() {
    exec "$1/bin/journal-agent" mock print --recording "$1/exchanges/claude-code/$2"
}

# auth login plays the test's script for it, an address and the code typed for it; auth status plays the recorded
# sign-in.
answer_auth() {
    case "$2" in
        login) exec "$1/bin/journal-agent" mock script --script "$1/mocks/claude-login.json" \
            --failures "$1/mocks/failures.jsonl" --steps-ran "$1/mocks/steps" ;;
        *) play "$1" auth-status ;;
    esac
}

print_turn() {
    local installation="$1"
    head -n 3 "$installation/turn.jsonl"
    wait_while_held "$installation/hold"
    tail -n +4 "$installation/turn.jsonl"
}

. "$(dirname "$0")/../lib/hold.sh"

main "$@"
