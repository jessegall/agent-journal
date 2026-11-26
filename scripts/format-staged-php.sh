#!/bin/sh
# Formats the staged PHP files with Pint and the code style fixer and stages them again, run by the pre-commit hook.
set -eu

main() {
    local files
    files=$(list_staged_php)
    [ -n "$files" ] || return 0
    run_pint "$files"
    run_fixer "$files"
    stage_again "$files"
}

list_staged_php() {
    git diff --cached --name-only --diff-filter=ACMR -- '*.php'
}

run_pint() {
    local files="$1"
    # shellcheck disable=SC2086
    vendor/bin/pint --quiet $files
}

# intersection keeps the fixer's own folder rules: a staged file it does not judge stays as it is.
run_fixer() {
    local files="$1"
    # shellcheck disable=SC2086
    vendor/bin/php-cs-fixer fix --quiet --config=tools/code-style/php-cs-fixer.php --path-mode=intersection $files
}

stage_again() {
    local files="$1"
    # shellcheck disable=SC2086
    git add -- $files
}

main "$@"
