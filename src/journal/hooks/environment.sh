# The environment a hook or a journal command works: JOURNAL_ENV when it is set; else, run inside a linked worktree of
# the project, the environment named after the worktree's folder; else main. A name is this machine's own, on a shared
# journal too: the team knows the environment by its key, never by the name here.
journal_environment() {
    if [ -n "$JOURNAL_ENV" ]; then
        printf '%s' "$JOURNAL_ENV"
        return
    fi
    journal_local_environment
}

# The project's main checkout: run inside a linked worktree, the folder that holds the repository git shares with it, as
# version 3 found it; else the folder it runs in. A launch from inside a worktree so uses the main checkout's journal.
journal_main_root() {
    own=$(cd "$(git rev-parse --git-dir 2>/dev/null)" 2>/dev/null && pwd -P) || { pwd -P; return; }
    common=$(cd "$(git rev-parse --git-common-dir)" && pwd -P)
    if [ "$own" != "$common" ]; then
        dirname "$common"
        return
    fi
    pwd -P
}

# The seconds a hook or a shell line waits for the journal at $1 (its .journal folder) to answer its health, from the file the
# journal writes from its setting; 3 when the journal has written none yet.
journal_health_seconds() {
    cat "$1/runtime/hook-health-seconds" 2>/dev/null || printf 3
}

journal_local_environment() {
    top=$(git rev-parse --show-toplevel 2>/dev/null) || { printf main; return; }
    own=$(cd "$(git rev-parse --git-dir)" && pwd -P)
    common=$(cd "$(git rev-parse --git-common-dir)" && pwd -P)
    if [ "$own" != "$common" ]; then
        printf '%s' "${top##*/}"
        return
    fi
    printf main
}

# While the journal at $1 (its .journal folder) boots or restarts, as its runtime/journal.booting file says, waits for it, at most
# BOOT_WAIT_TENTHS tenths of a second, and prints how many milliseconds it waited, 0 when it was up. The file holds the booting
# server's process id, and the wait ends once that process is gone, so a boot that died leaves nothing waiting: its booting file and the port file beside it are stale and are removed. A restart writes
# "restart" and the old server's id: while the old server still answers nothing waits, and once it is gone the wait for the next one
# lasts RESTART_WAIT_TENTHS at most.
BOOT_WAIT_TENTHS=600
RESTART_WAIT_TENTHS=100
journal_boot_wait() {
    tenths=0
    while [ -f "$1/runtime/journal.booting" ] && [ "$tenths" -lt "$BOOT_WAIT_TENTHS" ]; do
        booting=$(cat "$1/runtime/journal.booting" 2>/dev/null)
        case "$booting" in
            restart\ *) ! kill -0 "${booting#restart }" 2>/dev/null && [ "$tenths" -lt "$RESTART_WAIT_TENTHS" ] || break ;;
            *) kill -0 "$booting" 2>/dev/null || { [ -z "$booting" ] || rm -f "$1/runtime/journal.booting" "$1/port"; break; } ;;
        esac
        sleep 0.1
        tenths=$((tenths + 1))
    done
    printf '%s' "$((tenths * 100))"
}
