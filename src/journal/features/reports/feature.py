from journal.features.feature import Feature
from journal.features.reports.commands.report_command import ReportCommand
from journal.features.reports.listeners.report_made_card import ReportMadeCard
from journal.support.skill import Skill


class ReportsFeature(Feature):
    name = "reports"
    title = "Reports"
    help = "What was checked or researched now, written up and linked to what it is about."
    commands = (ReportCommand,)
    listeners = (ReportMadeCard,)

    skill = Skill("reports", 'Put what was checked or researched now in a report linked to what it is about; load it when the user asks for a critique, a review, an update or a write-up', """
# Reports

A report holds what was checked or researched now; lasting knowledge goes in a doc, ordered work in a plan.

- `journal report create "<title>" --file <path> --about plans:1` writes one from a markdown file, its `##`
  headings as sections, linked to the rows it is about; `--body "<text>"` for a short one.
- `journal report show <n>` prints its outline, numbered headings with their length; read one section with
  `--section <n or heading>` (`--bullets` for its bullets alone), or find lines with `--grep "<words>"`. It is never read whole.
  `journal report list` names them.
- In the chat say in one or two plain lines what it concludes, then its reference on a line of its own, like report 3.
""", keywords=('report', 'reports', 'critique', 'review', 'write-up'))
