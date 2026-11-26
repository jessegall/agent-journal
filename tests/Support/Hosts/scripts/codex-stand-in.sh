#!/bin/sh
# Stands in for the installed Codex in a real-host test: the pinned build, a ChatGPT sign-in for CODEX_HOME and its
# device-code login, a recorded exec turn, or a terminal recording played by what is typed.
set -eu

main() {
    local installation
    installation=$(find_installation)
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
find_installation() {
    cd "$(dirname "$0")/.." && pwd -P
}

print_build() {
    echo "codex-cli 0.165.0"
}

print_sign_in() {
    echo "Logged in using ChatGPT"
}

# The app-server answers a device-code login and announces it completed a moment later, reads the account, and runs
# an owner's threads and turns; the login's sign-in is kept in CODEX_HOME as Codex keeps it.
serve_app_server() {
    local installation="$1"
    local request id threads=0
    [ -e "$CODEX_HOME/auth.json" ] || : > "$CODEX_HOME/auth.json"
    while IFS= read -r request; do
        id=$(read_request_id "$request")
        case "$request" in
            *'"account/login/start"'*) answer_login "$installation" ;;
            *'"account/read"'*) answer "$installation" account-read "$id" ;;
            *'"initialize"'*) answer "$installation" initialized "$id" ;;
            *'"thread/start"'*) threads=$((threads + 1)); answer "$installation" thread-started "$id" "thread=thread-$threads" ;;
            *'"thread/resume"'*) answer "$installation" thread-started "$id" "thread=$(read_thread "$request")" ;;
            *'"turn/start"'*) run_turn "$installation" "$id" "$(read_thread "$request")" & ;;
        esac
    done
}

# A turn is started at once and completes after its usage and limits, once the hold file is gone.
run_turn() {
    local installation="$1"
    local id="$2"
    local thread="$3"
    answer "$installation" turn-started "$id" "turn=turn-of-$thread"
    wait_while_held "$installation/hold"
    answer "$installation" token-usage "" "thread=$thread"
    answer "$installation" rate-limits ""
    answer "$installation" turn-completed "" "thread=$thread" "turn=turn-of-$thread"
}

# An answer of the exchange folder with its request id and named values filled in.
answer() {
    local installation="$1"
    local name="$2"
    local id="$3"
    shift 3
    local line value
    line=$(sed "s/{id}/$id/" "$installation/codex-app-server/$name.json")
    for value in "$@"; do
        line=$(printf '%s' "$line" | sed "s/{${value%%=*}}/${value#*=}/g")
    done
    printf '%s\n' "$line"
}

# The request's id as it was written, a number or a quoted string.
read_request_id() {
    printf '%s' "$1" | sed -n 's/^{"id":\("[^"]*"\|[0-9]*\),.*/\1/p'
}

read_thread() {
    printf '%s' "$1" | sed -n 's/.*"threadId":"\([^"]*\)".*/\1/p'
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

. "$(dirname "$0")/../lib/hold.sh"

main "$@"
