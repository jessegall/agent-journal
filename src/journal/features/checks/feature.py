from journal.features.checks.commands.check_command import CheckCommand
from journal.features.checks.listeners.run_due_checks import RunDueChecks
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.features.skill import Skill


class Checks(Feature):
    name = "checks"
    title = "Checks"
    help = "Scripts that pass or fail, run by hand or on a schedule; a failure is told to the agent."
    commands = (CheckCommand,)
    listeners = (RunDueChecks,)

    FAILED = Nudge(name, "failed", "check {{n}}, {{title}}, failed", "{{tail}}", repeat_after=0)
    FAILING = Nudge(name, "failing", "check {{n}}, {{title}}, is still failing", "{{tail}}", repeat_after=900)
    nudges = (FAILED, FAILING)

    skill = Skill("checks", "Scripts that pass or fail about the project; load it when a check is created, run or fails", """
# Checks

A check is a script that passes or fails, run by hand or every so many minutes. A failure is told to you;
the next pass clears it.

- `journal check create "<title>" --command "<shell>" --every <minutes> --brief "<what it checks and what a failure means>"`;
  `--every 0` runs by hand only.
- `journal check run <n>` runs it now and prints the tail on failure. `journal check list` shows how each last went.
- When a check fails, fix what it found before anything else, then run it again.
""", keywords=("check", "checks", "ci", "suite"))
