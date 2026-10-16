from argparse import Namespace
from pathlib import Path

from journal.console.command import Command
from journal.console.where import Where
from journal.models.link import Link
from journal.models.ref import Ref
from journal.models.report import Report
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.reports import Reports


class ReportCommand(Command):
    noun = "report"

    def __init__(self, reports: Reports, links: Links) -> None:
        self.reports, self.links = reports, links

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "write a report: what was checked or researched now")
        create.add_argument("title")
        create.add_argument("--body", default="", help="the report, as markdown; ## headings are its sections")
        create.add_argument("--file", default="", help="a file holding the body instead")
        create.add_argument("--about", default=[], nargs="*", help="the rows it is about, as plans:1 or tasks:12")
        self.verb(verbs, "show", "a report").add_argument("n", type=int)
        self.verb(verbs, "list", "every report here")

    def create(self, args: Namespace, where: Where) -> int:
        body = Path(args.file).read_text() if args.file else args.body
        report = self.reports.save(Report(title=args.title, body=body), where.actor)
        for about in args.about:
            self.links.save(Link(source=Ref.to(report), target=Ref.parse(about), kind=Messages.ABOUT), where.actor)
        print(f"report {report.id}: {report.title}" + (f", about {', '.join(args.about)}" if args.about else ""))
        return 0

    def show(self, args: Namespace, where: Where) -> int:
        report = self.reports.find(args.n)
        print(f"report {report.id}: {report.title}")
        print(report.body)
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for report in self.reports.in_():
            print(f"{report.id:>4}  {report.title}")
        return 0
