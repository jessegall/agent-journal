from journal.support.card_family import CardFamily
from journal.support.card_type_entry import CardTypeEntry
from journal.support.card_type_catalogue import WORK
from journal.support.card_type import CardType
from journal.support.card_colouring import CardColouring
from journal.events.rows.check_failed import CheckFailed
from journal.features.checks.commands.check_command import CheckCommand
from journal.features.checks.listeners.run_due_checks import RunDueChecks
from journal.features.checks.checks_conduct import ChecksConduct
from journal.features.feature import Feature
from journal.features.checks.listeners.check_failure_record import CheckFailureRecord
from journal.features.checks.listeners.check_run_card import CheckRunCard
from journal.features.checks.support.check_run_process_card import CheckRunProcessCard
from journal.support.skill import Skill
from journal.features.checks.checks_nudges import ChecksNudges
from journal.features.checks.checks_options import ChecksOptions


class Checks(Feature):
    name = "checks"
    card_families = (CardFamily("checks", "Checks", "check", WORK, CardColouring.OUTCOME),)
    card_types = (CardTypeEntry(CardType.CHECKS, "Checks passing and failing", "checks"),)
    title = "Checks"
    help = "Scripts that pass or fail, run by hand or on a schedule; a failure is told to the agent."
    commands = (CheckCommand,)
    listeners = (RunDueChecks, CheckFailureRecord, CheckRunCard)
    process_cards = (CheckRunProcessCard,)
    conduct = (ChecksConduct,)

    options = (ChecksOptions.REPEAT,)
    nudges = (ChecksNudges.CHECK_FAILED, ChecksNudges.CHECK_FAILURE_REPEAT, ChecksNudges.CHECK_COULD_NOT_RUN)

    skill = Skill("checks", 'Write and run scripts that pass or fail about the project; load it when a check is created, run or fails', """
# Checks

A check is a script that passes or fails, run by hand or every so many minutes. A failure is reported to you;
the next pass clears it.

- `journal check create "<title>" --command "<shell>" --every <minutes> --brief "<what it checks and what a failure means>"`;
  `--every 0` runs by hand only.
- Exit 0 passes and any other code fails, save exit 2: the check could not run (a missing tool or right), reported once
  and apart from a failure.
- `journal check run <n>` runs it now and prints the tail on failure. `journal check list` shows how each last went.
- `journal check stop <n>` force stops a running check: its command ends at once, and the run is recorded as stopped,
  neither passed nor failed, so nothing is reported and it can be run again.
- `journal check edit <n> [--title] [--command] [--brief] [--every]` changes the fields you name on a check and leaves the rest.
- `journal check remove <n>` retires a check: it runs no more and leaves the list, and a task or plan that waited on it
  alone opens again.
- When a check fails, fix what it found before anything else, then run it again.
- A check shows its progress from what it prints: a count such as `120/983`, test dots, or a percent. It may write
  a report to the file named by `$JOURNAL_REPORT`: `{"title", "summary", "findings": [{"name", "file", "line", "where",
  "text", "group"}]}`; the page lists its findings under the check, grouped, each opening its file at its line.
""", keywords=("check", "checks", "ci", "suite"), commands=('check',), events=(CheckFailed,))
