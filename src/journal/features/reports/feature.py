from journal.engine.nudge import Nudge
from journal.features.feature import Feature
from journal.features.reports.commands.report_command import ReportCommand
from journal.features.reports.listeners.report_card import ReportCard
from journal.features.reports.reports_conduct import ReportsConduct
from journal.features.reports.support.reports_data import ReportsData
from journal.features.reports.support.reports_data_reader import ReportsDataReader
from journal.support.option import Option
from journal.support.skill import Skill


class ReportsFeature(Feature[ReportsData]):
    UPDATE_INTERVAL = Option("reports.update_every", "Offer to write an update at most every", "Minutes between two offers to the agent, after a commit, to write you an update; the first commit after the last offer or update starts the count, and none is offered while an update you have not read waits; 0 offers none", 60, unit="minutes")
    UPDATE_SUGGESTION = Nudge("reports", "write_an_update", "you committed work: if a meaningful piece landed, write the user an update", "journal report changes shows what it covers, then journal report recap \"<one or two sentences>\" writes it, docked at the bottom of the chat; skip it when the work is small", repeat_interval=0)
    name = "reports"
    title = "Reports"
    help = "What was checked or researched now, written up and linked to what it is about."
    commands = (ReportCommand,)
    listeners = (ReportCard,)
    data = (ReportsDataReader,)
    conduct = (ReportsConduct,)
    options = (UPDATE_INTERVAL,)
    nudges = (UPDATE_SUGGESTION,)

    skill = Skill("reports", 'Put what was checked or researched now in a report linked to what it is about; load it when the user asks for a critique, a review, an update or a write-up', """
# Reports

A report holds what was checked or researched now; lasting knowledge goes in a doc, ordered work in a plan.

- `journal report create "<title>" --file <path> --about plans:1` writes one from a markdown file, its `##`
  headings as sections, linked to the rows it is about; `--body "<text>"` for a short one.
- `journal report show <n>` prints its outline, numbered headings with their length; read one section with
  `--section <n or heading>` (`--bullets` for its bullets alone), or find lines with `--grep "<words>"`. Read it whole with
  `--all` only when every section matters to the job; the outline and one section are the default. `journal report list` names them.
- In the chat say in one or two plain lines what it concludes, then its reference on a line of its own, like report 3.
- An update for the user: `journal report changes` lists what it covers since the last update the user read, by section;
  `journal report recap "<one or two sentences>"` writes it, your summary over the rows the journal gathered, docked at the
  bottom of the chat. `journal report item <section> <row> "<title>"`, `note <n> "<text>"` and `drop <n>` change the latest.
""", keywords=('report', 'reports', 'critique', 'review', 'write-up'))
