#!/bin/sh
# Passes while a code-commandments issue waits; once answered it fails with the answer for half an hour, then removes
# its own check.   tools/checks/report-answered.sh <issue number> <check number>
set -eu

main() {
    local issue=$1 check=$2 marker answer
    marker=.journal/report-checks/$issue
    answer=$(read_answer "$issue")
    if [ -z "$answer" ]; then
        echo "Issue $issue waits for an answer."
        exit 0
    fi
    show_answer "$issue" "$answer"
    mark_answered "$marker"
    remove_check_after_grace "$marker" "$check"
    exit 1
}

read_answer() {
    gh issue view "$1" --repo jessegall/code-commandments --json state,comments \
        --jq "$(cat tools/checks/answer-of-issue.jq)"
}

show_answer() {
    echo "Issue $1 of jessegall/code-commandments is answered:"
    echo "$2"
    echo
    echo "Act on the answer: upgrade the plugin when it names a release (journal plugin upgrade code-commandments --yes),"
    echo "fix the code when the finding is upheld, then drop the report so its lines are judged again:"
    echo "  .journal/plugins/code-commandments/bin/commandments-release report forget $1"
}

# The first answered run is kept, so the check fails for half an hour and the journal can tell the agent.
mark_answered() {
    mkdir -p "$(dirname "$1")"
    [ -f "$1" ] || date +%s > "$1"
}

remove_check_after_grace() {
    local answered_at
    answered_at=$(cat "$1")
    [ $(( $(date +%s) - answered_at )) -ge 1800 ] || return 0
    journal check remove "$2" >/dev/null 2>&1 || echo "Check $2 could not remove itself: remove it with journal check remove $2."
    rm -f "$1"
}

main "$@"
