from controllers.types import Reports
from events.agents import TurnStopped
from expects import WHEN, Answered, Dispatches, Given, Nudged, Refused, Updated, Wrote, nothing
from framework.base import Feature
from framework.journal import Journal
from features.update_reports.commands import AddItem, Changes, Dismiss, Drop, Note, Recap
from features.update_reports.details import UpdateReportsDetails
from features.update_reports.handlers import OFFER, HoldOfferBack, MarkFirstCommit, OfferAnUpdate
from features.update_reports.listeners import SpotCommitToOffer
from events.update_reports import CommitFirstSeen, OfferHeldBack, UpdateOffered
from resources.types import AgentRow, Question, Report, Todo


CLOSED = {"section": "done", "ref": "todo:4", "title": "Close the old to-do", "note": ""}
STUCK = {"section": "need", "ref": "question:2", "title": "Which branch?", "note": ""}
UPDATE = Report(n=1, title="What happened in the last day", data={"kind": "update", "items": [STUCK, CLOSED]})
PLAIN = Report(n=1, title="What the audit found")


class StartsWith:
    def __init__(self, text: str) -> None:
        self.text = text

    def __eq__(self, listed: list) -> bool:
        return len(listed) == 1 and listed[0].startswith(self.text)


class Lists:
    def __init__(self, *parts: str) -> None:
        self.parts = parts

    def __eq__(self, listed: list) -> bool:
        return listed[0].startswith("since ") and all(any(part in line for line in listed) for part in self.parts)


ASKED = {"section": "need", "ref": "question:2", "title": "Should New work pick drafts for you?", "note": ""}
SHIPPED = {"section": "done", "ref": "todo:1", "title": "Settings page made calmer", "note": ""}
NEWLY_SHIPPED = {"section": "done", "ref": "todo:3", "title": "Files page redesign", "note": ""}
LAST_UPDATE = Report(n=1, title="What happened in the last day", seen=["user"], data={"kind": "update", "number": 1, "until": 100.0})


class UpdateReports(Feature):
    details = UpdateReportsDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("report", Changes(), expects=[
            Given((Reports,)) >> Answered(StartsWith("since ")),
            Given((Reports,), rows=[Todo(n=3, title="Wording pass", data={"status": "started"})]) >> Answered(Lists("doing todo:3 Wording pass")),
        ])
        journal.commands.add("report", Recap(), expects=[
            Given((Reports, "Shipped the expectations")) >> Wrote(Report(title="What happened in the last day", abstract="Shipped the expectations")),
            Given((Reports, "The settings page is calmer; one question waits on you."),
                  rows=[Todo(n=1, title="Settings page made calmer", completed=WHEN - 3600, outcome="shipped"), Question(n=2, title="Should New work pick drafts for you?")])
                >> Wrote(Report(title="What happened in the last day", data={"number": 1, "items": [ASKED, SHIPPED]})),
            Given((Reports, "The files page is redesigned."), rows=[LAST_UPDATE, Todo(n=1, title="Settings page made calmer", completed=50.0), Todo(n=3, title="Files page redesign", completed=WHEN - 10)])
                >> Wrote(Report(title="What happened since your last update", data={"number": 2, "since": 100.0, "items": [NEWLY_SHIPPED]})),
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
            Given((Reports, 1), rows=[PLAIN]) >> Updated(Report(n=1), dismissed=True),
        ])
        journal.events.listen(TurnStopped, SpotCommitToOffer(), expects=[
            Given(TurnStopped(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.handle(CommitFirstSeen, MarkFirstCommit(), expects=[
            Given(CommitFirstSeen(commit="aaa"), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.handle(OfferHeldBack, HoldOfferBack(), expects=[
            Given(OfferHeldBack(commit="bbb", at="0"), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.handle(UpdateOffered, OfferAnUpdate(), expects=[
            Given(UpdateOffered(commit="ccc"), rows=[AgentRow(n=1, title="claude-1")]) >> Nudged(OFFER),
        ])
