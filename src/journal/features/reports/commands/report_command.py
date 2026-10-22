import re
from argparse import Namespace
from pathlib import Path

from journal.console.command import HELPER_KINDS, Command
from journal.support.caller import Caller
from journal.support.outline import Outline
from journal.models.link import Link
from journal.models.support.ref import Ref
from journal.models.report import Report
from journal.support.rejection import Rejection
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.reports import Reports

ROW = re.compile(r"^[a-z_]+:\d+$")


class ReportCommand(Command):
    noun = "report"
    callers = {"show": HELPER_KINDS}

    def __init__(self, reports: Reports, links: Links) -> None:
        self.reports, self.links = reports, links

    def arguments(self, verbs) -> None:
        creation = self.verb(verbs, "create", "write a report: what was checked or researched now")
        creation.add_argument("title")
        creation.add_argument("--body", default="", help="the report, as markdown; ## headings are its sections")
        creation.add_argument("--file", default="", help="a file holding the body instead")
        creation.add_argument("--about", default=[], nargs="*", help="the rows it is about, as plans:1 or tasks:12, apart by spaces or commas")
        display = self.verb(verbs, "show", "a report: its outline, then one section at a time")
        display.add_argument("n", type=int)
        Outline.arguments(display)
        self.verb(verbs, "list", "every report here")

    def create(self, args: Namespace, caller: Caller) -> int:
        body = Path(args.file).read_text() if args.file else args.body
        rows = self.mentioned_rows(args.about)
        report = self.reports.save(Report(title=args.title, body=body), caller.actor)
        for row in rows:
            self.links.save(Link(source=Ref.build(report), target=row, kind=Messages.SUBJECT_LINK), caller.actor)
        print(f"report {report.id}: {report.title}" + (f", about {', '.join(map(str, rows))}" if rows else ""))
        return 0

    @staticmethod
    def mentioned_rows(value: list[str]) -> list[Ref]:
        matched = [part.strip() for word in value for part in word.split(",") if part.strip()]
        wrong = [n for n in matched if not ROW.match(n)]
        if wrong:
            raise Rejection(f"not a row: {', '.join(wrong)}; write each as plans:8 or tasks:12")
        return [Ref.parse(n) for n in matched]

    def show(self, args: Namespace, caller: Caller) -> int:
        report = self.reports.find(args.n)
        print("\n".join([*filter(None, (f"report {report.id}: {report.title}", report.abstract)), *Outline.build(report.body).summary(args)]))
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for report in self.reports.scoped():
            print(f"{report.id:>4}  {report.title}")
        return 0
