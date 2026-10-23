import re
from argparse import Namespace
from datetime import datetime, timezone
from pathlib import Path

from journal.console.command import Command, HELPER_KINDS, WORKER_KINDS
from journal.support.caller import Caller
from journal.support.outline import Outline
from journal.models.link import Link
from journal.models.support.ref import Ref
from journal.features.reports.support.update_gathering import SECTIONS, UpdateGathering
from journal.models.report import UPDATE, Report
from journal.support.rejection import Rejection
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.reports import Reports

ROW = re.compile(r"^[a-z_]+:\d+$")


class ReportCommand(Command):
    noun = "report"
    callers = {"show": HELPER_KINDS, "create": WORKER_KINDS}

    def __init__(self, reports: Reports, links: Links, gathering: UpdateGathering) -> None:
        self.reports, self.links, self.gathering = reports, links, gathering

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
        self.verb(verbs, "changes", "what an update would cover now, by section, gathered since the last update the user read")
        self.verb(verbs, "recap", "write the update: your summary in one or two sentences over the rows the journal gathers; it is docked at the bottom of the chat").add_argument("summary")
        addition = self.verb(verbs, "item", "add a row to the latest update under a section")
        addition.add_argument("section", choices=SECTIONS)
        addition.add_argument("ref", help="the row, as tasks:12")
        addition.add_argument("title")
        note = self.verb(verbs, "note", "a note on an item of the latest update, by its number")
        note.add_argument("n", type=int)
        note.add_argument("note")
        self.verb(verbs, "drop", "take an item out of the latest update, by its number").add_argument("n", type=int)

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
        print("\n".join([*filter(None, (f"report {report.id}: {report.title}", report.abstract)), *self.item_lines(report.items), *Outline.build(report.body).summary(args)]))
        return 0

    def changes(self, args: Namespace, caller: Caller) -> int:
        end = datetime.now(timezone.utc)
        start = self.gathering.start(end)
        print(f"an update now covers {start:%Y-%m-%d %H:%M} to {end:%H:%M}:")
        print("\n".join(self.item_lines(tuple(item.as_data() for item in self.gathering.items(start, end)))) or "nothing happened in that time")
        print('write it with journal report recap "<one or two sentences>"')
        return 0

    def recap(self, args: Namespace, caller: Caller) -> int:
        end = datetime.now(timezone.utc)
        start = self.gathering.start(end)
        items = tuple(item.as_data() for item in self.gathering.items(start, end))
        report = self.reports.save(Report(kind=UPDATE, title=f"Update {end:%Y-%m-%d} at {end:%H.%M}", abstract=args.summary, items=items, start_at=start, end_at=end), caller.actor)
        counts = ", ".join(f"{section} {sum(1 for item in items if item['section'] == section)}" for section in SECTIONS if any(item["section"] == section for item in items))
        print(f"report {report.id}: the update, docked at the bottom of the chat" + (f"; {counts}" if counts else ""))
        return 0

    def item(self, args: Namespace, caller: Caller) -> int:
        report = self.latest_update()
        self.reports.save(report.item_added(args.section, args.ref, args.title), caller.actor)
        print(f"update {report.id}: {args.ref} added under {args.section}")
        return 0

    def note(self, args: Namespace, caller: Caller) -> int:
        report = self.latest_update()
        self.reports.save(report.noted(args.n, args.note), caller.actor)
        print(f"update {report.id}: item {args.n} noted")
        return 0

    def drop(self, args: Namespace, caller: Caller) -> int:
        report = self.latest_update()
        self.reports.save(report.dropped(args.n), caller.actor)
        print(f"update {report.id}: item {args.n} taken out")
        return 0

    def latest_update(self) -> Report:
        updates = self.reports.latest_update()
        if not updates:
            raise Rejection('there is no update yet: write one with journal report recap "<summary>"')
        return updates[0]

    @staticmethod
    def item_lines(items: tuple[dict, ...]) -> list[str]:
        return [f"{n:>3}  {item['section']:<8} {item['ref']:<14} {item['title']}" + (f" ({item['note']})" if "note" in item else "") for n, item in enumerate(items, start=1)]

    def list(self, args: Namespace, caller: Caller) -> int:
        for report in self.reports.scoped():
            print(f"{report.id:>4}  {report.title}")
        return 0
