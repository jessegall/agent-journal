#!/bin/sh
# Watches one code-commandments report: passes while the issue waits, and once it is closed or commented on, fails
# with the answer on every run for half an hour, so the journal has time to tell the agent; only then it removes its
# own check. The first answered run is kept in .journal/report-checks/<issue>.
#
#   tools/checks/report-answered.sh <issue number> <check number>
set -eu

issue=$1
check=$2
repository=jessegall/code-commandments
answered_folder=.journal/report-checks
answered_marker=$answered_folder/$issue
keep_failing_seconds=1800

answer=$(gh issue view "$issue" --repo "$repository" --json state,comments \
    --jq 'if .state == "CLOSED" or (.comments | length) > 0 then "\(.state)\n\(.comments | map(.body) | join("\n---\n"))" else "" end')

if [ -z "$answer" ]; then
    echo "Issue $issue waits for an answer."
    exit 0
fi

echo "Issue $issue of $repository is answered:"
echo "$answer"
echo
echo "Act on the answer: upgrade the plugin when it names a release (journal plugin upgrade code-commandments --yes),"
echo "fix the code when the finding is upheld, then drop the report so its lines are judged again:"
echo "  .journal/plugins/code-commandments/bin/commandments-release report forget $issue"

mkdir -p "$answered_folder"
if [ ! -f "$answered_marker" ]; then
    date +%s > "$answered_marker"
fi

answered_at=$(cat "$answered_marker")
if [ $(( $(date +%s) - answered_at )) -ge "$keep_failing_seconds" ]; then
    journal check remove "$check" >/dev/null 2>&1 || echo "Check $check could not remove itself: remove it with journal check remove $check."
    rm -f "$answered_marker"
fi
exit 1
