from controllers.types import Reports
from engine.events.agents import TurnStopped
from expects import Given, Refused, Unchanged, Updated, Wrote
from features.base import Feature
from features.journal import Journal
from features.update_reports.commands import AddItem, Changes, Dismiss, Drop, Note, Recap
from features.update_reports.details import UpdateReportsDetails
from features.update_reports.handlers import OfferAnUpdate
from resources.types import AgentRow, Report


CLOSED = {"section": "done", "ref": "todo:4", "title": "Close the old to-do", "note": ""}
STUCK = {"section": "need", "ref": "question:2", "title": "Which branch?", "note": ""}
UPDATE = Report(n=1, title="What happened in the last day", data={"kind": "update", "items": [STUCK, CLOSED]})
PLAIN = Report(n=1, title="What the audit found")


class UpdateReports(Feature):
    details = UpdateReportsDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("report", Changes())
        journal.commands.add("report", Recap(), expects=[
            Given((Reports, "Shipped the expectations")) >> Wrote(Report(title="What happened in the last day", abstract="Shipped the expectations")),
            Given((Reports, "Shipped more"), rows=[Report(n=1, title="What happened in the last day", seen=["user"], data={"kind": "update", "number": 1, "until": 100.0})])
                >> Wrote(Report(title="What happened since your last update", abstract="Shipped more")),
        ])
        journal.commands.add("report", Note(), expects=[
            Given((Reports, 1, "todo:4", "Done in an hour"), rows=[UPDATE]) >> Updated(Report(n=1), items=[STUCK, {**CLOSED, "note": "Done in an hour"}]),
            Given((Reports, 1, "todo:9", "Done"), rows=[UPDATE]) >> Refused("update report 1 has no row todo:9; its rows are question:2, todo:4"),
            Given((Reports, 1, "todo:4", "Done"), rows=[PLAIN]) >> Refused("report 1 is not an update; journal report recap writes one"),
        ])
        journal.commands.add("report", AddItem(), expects=[
            Given((Reports, 1, "done", "todo:6", "File the audit"), rows=[UPDATE]) >> Updated(Report(n=1), items=[STUCK, CLOSED, {"section": "done", "ref": "todo:6", "title": "File the audit", "note": ""}]),
            Given((Reports, 1, "later", "todo:6", "File the audit"), rows=[UPDATE]) >> Refused("an update's sections are need, done, doing, plans, commits, also, not 'later'"),
            Given((Reports, 1, "done", "todo:6", "File the audit"), rows=[PLAIN]) >> Refused("report 1 is not an update; journal report recap writes one"),
        ])
        journal.commands.add("report", Drop(), expects=[
            Given((Reports, 1, "todo:4"), rows=[UPDATE]) >> Updated(Report(n=1), items=[STUCK]),
            Given((Reports, 1, "todo:9"), rows=[UPDATE]) >> Refused("update report 1 has no row todo:9; its rows are question:2, todo:4"),
        ])
        journal.commands.add("report", Dismiss(), expects=[
            Given((Reports, 1), rows=[UPDATE]) >> Updated(Report(n=1), dismissed=True),
        ])
        journal.events.handler(OfferAnUpdate(), expects=[
            Given(TurnStopped(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
