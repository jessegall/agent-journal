import re
from argparse import Namespace
from pathlib import Path

from journal.console.command import Command
from journal.console.where import Where
from journal.models.link import Link
from journal.models.ref import Ref
from journal.models.report import Report
from journal.refused import Refused
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.reports import Reports

ROW = re.compile(r"^[a-z_]+:\d+$")
"""A row as a report names it: its table and its number."""


class ReportCommand(Command):
    noun = "report"

    def __init__(self, reports: Reports, links: Links) -> None:
        self.reports, self.links = reports, links

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "write a report: what was checked or researched now")
        create.add_argument("title")
        create.add_argument("--body", default="", help="the report, as markdown; ## headings are its sections")
        create.add_argument("--file", default="", help="a file holding the body instead")
        create.add_argument("--about", default=[], nargs="*", help="the rows it is about, as plans:1 or tasks:12, apart by spaces or commas")
        self.verb(verbs, "show", "a report").add_argument("n", type=int)
        self.verb(verbs, "list", "every report here")

    def create(self, args: Namespace, where: Where) -> int:
        body = Path(args.file).read_text() if args.file else args.body
        rows = self.rows_named(args.about)
        report = self.reports.save(Report(title=args.title, body=body), where.actor)
        for row in rows:
            self.links.save(Link(source=Ref.to(report), target=row, kind=Messages.ABOUT), where.actor)
        print(f"report {report.id}: {report.title}" + (f", about {', '.join(map(str, rows))}" if rows else ""))
        return 0

    @staticmethod
    def rows_named(given: list[str]) -> list[Ref]:
        """The rows a report is about, given apart by spaces or commas; one not written as kind:number is refused by name."""
        named = [part.strip() for word in given for part in word.split(",") if part.strip()]
        wrong = [n for n in named if not ROW.match(n)]
        if wrong:
            raise Refused(f"not a row: {', '.join(wrong)}; write each as plans:8 or tasks:12")
        return [Ref.parse(n) for n in named]

    def show(self, args: Namespace, where: Where) -> int:
        report = self.reports.find(args.n)
        print(f"report {report.id}: {report.title}")
        print(report.body)
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for report in self.reports.in_():
            print(f"{report.id:>4}  {report.title}")
        return 0
