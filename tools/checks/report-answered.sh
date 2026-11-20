#!/bin/sh
# Watches one code-commandments report: passes while the issue waits, and once it is closed or commented on, prints
# the answer, removes its own check and fails, so the agent hears of the answer once.
#
#   tools/checks/report-answered.sh <issue number> <check number>
set -eu

issue=$1
check=$2
repository=jessegall/code-commandments

answer=$(gh issue view "$issue" --repo "$repository" --json state,comments \
    --jq 'if .state == "CLOSED" or (.comments | length) > 0 then "\(.state)\n\(.comments | map(.body) | join("\n---\n"))" else "" end')

if [ -z "$answer" ]; then
    echo "Issue $issue waits for an answer."
    exit 0
fi

echo "Issue $issue of $repository is answered:"
echo "$answer"
journal check remove "$check" >/dev/null 2>&1 || echo "Check $check could not remove itself: remove it with journal check remove $check."
exit 1
