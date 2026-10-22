# The environment a hook or a journal command works: JOURNAL_ENV when it is set; else, run inside a linked worktree of
# the project, the environment named after the worktree's folder; else main. On a shared journal a name worked out here
# carries this machine's person before it, as in jesse-main, from .journal/team-prefix, which the join writes.
journal_environment() {
    if [ -n "$JOURNAL_ENV" ]; then
        printf '%s' "$JOURNAL_ENV"
        return
    fi
    name=$(journal_local_environment)
    prefix=$(cat "${JOURNAL_ROOT:-$PWD}/.journal/team-prefix" 2>/dev/null)
    case "$name" in
        "$prefix"-*|"") printf '%s' "$name" ;;
        *) printf '%s' "${prefix:+$prefix-}$name" ;;
    esac
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
