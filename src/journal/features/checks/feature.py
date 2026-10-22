from journal.features.checks.commands.check_command import CheckCommand
from journal.features.checks.listeners.run_due_checks import RunDueChecks
from journal.features.checks.checks_conduct import ChecksConduct
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.features.checks.listeners.check_failure_record import CheckFailureRecord
from journal.support.option import Option
from journal.support.skill import Skill


class Checks(Feature):
    name = "checks"
    title = "Checks"
    help = "Scripts that pass or fail, run by hand or on a schedule; a failure is told to the agent."
    commands = (CheckCommand,)
    listeners = (RunDueChecks, CheckFailureRecord)
    conduct = (ChecksConduct,)

    CHECK_FAILED = Nudge(name, "check_failed", "check {{n}}, {{title}}, failed", "{{tail}}", repeat_interval=0)
    CHECK_FAILURE_REPEAT = Nudge(name, "check_still_failing", "check {{n}}, {{title}}, is still failing", "{{tail}}", repeat_interval=0)
    REPEAT = Option("checks.repeat_minutes", "Tell a failing check again after", "Minutes a check goes on failing before the agent is told again; 0 tells it once, when it starts failing", 60, unit="minutes")
    options = (REPEAT,)
    nudges = (CHECK_FAILED, CHECK_FAILURE_REPEAT)

    skill = Skill("checks", "Scripts that pass or fail about the project; load it when a check is created, run or fails", """
# Checks

A check is a script that passes or fails, run by hand or every so many minutes. A failure is told to you;
the next pass clears it.

- `journal check create "<title>" --command "<shell>" --every <minutes> --brief "<what it checks and what a failure means>"`;
  `--every 0` runs by hand only.
- `journal check run <n>` runs it now and prints the tail on failure. `journal check list` shows how each last went.
- `journal check edit <n> [--title] [--command] [--brief] [--every]` changes what it names on a check and keeps the rest.
- `journal check remove <n>` retires a check: it runs no more and leaves the list, and a task or plan that waited on it
  alone opens again.
- When a check fails, fix what it found before anything else, then run it again.
- A check shows how far it is from what it prints: a count such as `120/983`, test dots, or a percent. It may write
  a report to the file named by `$JOURNAL_REPORT`: `{"title", "summary", "findings": [{"name", "file", "line", "where",
  "text", "group"}]}`; the page lists its findings under the check, grouped, each opening its file at its line.
""", keywords=("check", "checks", "ci", "suite"))
