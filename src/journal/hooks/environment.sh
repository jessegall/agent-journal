# The environment a hook or a journal command works: JOURNAL_ENV when it is set; else, run inside a linked worktree of
# the project, the environment named after the worktree's folder; else main.
journal_environment() {
    if [ -n "$JOURNAL_ENV" ]; then
        printf '%s' "$JOURNAL_ENV"
        return
    fi
    top=$(git rev-parse --show-toplevel 2>/dev/null) || { printf main; return; }
    own=$(cd "$(git rev-parse --git-dir)" && pwd -P)
    common=$(cd "$(git rev-parse --git-common-dir)" && pwd -P)
    if [ "$own" != "$common" ]; then
        printf '%s' "${top##*/}"
        return
    fi
    printf main
}
