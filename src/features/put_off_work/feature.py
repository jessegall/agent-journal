import json

from events.agents import AgentReported
from events.put_off_work import WorkDeferred
from expects import Dispatches, Given, Nudged, at, nothing
from features.put_off_work.details import PutOffWorkDetails
from features.put_off_work.handlers import NameTheDeferral
from features.put_off_work.listeners import SpotDeferredWork
from resources.work_modes import filing_on
from framework.base import Feature
from framework.journal import Journal
from resources.types import AgentRow, Board, Todo

AGENT_ROW = AgentRow(n=1, title="claude-1", data={"provider": "claude", "at": 1_000.0})
REPORTED = AgentReported(agent=1)
PLAIN_ROW = AgentRow(n=1, title="claude-1")


def said(text: str) -> str:
    asked = {"type": "user", "message": {"content": "go"}}
    answered = {"type": "assistant", "message": {"content": [{"type": "text", "text": text}]}}
    return "".join(json.dumps(row) + "\n" for row in (asked, answered))


def filed(created: float, by: str = "agent") -> Todo:
    return Todo(n=1, title="the footer, after the header", created=created, seen=[by])


class PutOffWork(Feature):
    details = PutOffWorkDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(AgentReported, SpotDeferredWork(), expects=[
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("[!reply] the header is fixed; I'll do that after this."))
                >> Dispatches(WorkDeferred(agent=1, words="I'll do that").due()),
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("Dat doe ik straks.")) >> Dispatches(WorkDeferred(agent=1, words="Dat doe ik straks").due()),
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("Daar kom ik later op terug.")) >> Dispatches(WorkDeferred(agent=1, words="Daar kom ik later op terug").due()),
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("We do it once the build finishes.")) >> Dispatches(WorkDeferred(agent=1, words="once the build finishes").due()),
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("[!reply] all done.")) >> Dispatches(nothing),
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("Ik heb het gedaan.")) >> Dispatches(nothing),
            Given(REPORTED, rows=[AGENT_ROW, filed(created=900.0)], transcript=said("[!reply] parked as to-do 1; I'll come back to it.")) >> Dispatches(nothing),
            Given(REPORTED, rows=[AGENT_ROW, filed(created=100.0)], transcript=said("I'll do that after this."))
                >> Dispatches(WorkDeferred(agent=1, words="I'll do that").due()),
            Given(REPORTED, rows=[AGENT_ROW, filed(created=900.0, by="user")], transcript=said("I'll do that after this."))
                >> Dispatches(WorkDeferred(agent=1, words="I'll do that").due()),
            Given(REPORTED, rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(REPORTED, rows=[AGENT_ROW, filed(created=400.0)], transcript=said("I'll do that after this.")) >> Dispatches(nothing),
            Given(REPORTED, rows=[AGENT_ROW, filed(created=399.0)], transcript=said("I'll do that after this.")) >> Dispatches(WorkDeferred(agent=1, words="I'll do that").due()),
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("Continue after this.")) >> Dispatches(WorkDeferred(agent=1, words="after this").due()),
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("Later on we test it.")) >> Dispatches(WorkDeferred(agent=1, words="Later on").due()),
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("Next, I'll check it.")) >> Dispatches(WorkDeferred(agent=1, words="Next, I'll").due()),
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("Hierna kijk ik verder.")) >> Dispatches(WorkDeferred(agent=1, words="Hierna").due()),
            Given(REPORTED, rows=[AGENT_ROW], transcript=said("Zodra de build klaar is, ga ik door.")) >> Dispatches(WorkDeferred(agent=1, words="Zodra de build klaar is").due()),
        ])
        journal.events.handle(WorkDeferred, NameTheDeferral(), expects=[
            Given(WorkDeferred(agent=1, words="I'll do that"), rows=[PLAIN_ROW]) >> Nudged("deferred", words="I'll do that", filing=filing_on(None)),
            Given(WorkDeferred(agent=1, words="I'll do that"), rows=[PLAIN_ROW, Board(n=3, title="main board")], settings={"work_modes.mode": "orchestrator", "work_modes.board": 3})
                >> Nudged("deferred", words="I'll do that", filing=filing_on(Board(n=3, title="main board"))),
            Given(WorkDeferred(agent=1, words="I'll do that"), rows=[PLAIN_ROW], settings={"work_modes.mode": "orchestrator", "work_modes.board": 3})
                >> Nudged("deferred", words="I'll do that", filing=filing_on(None)),
            Given(WorkDeferred(agent=1, words="I'll do that"), rows=[PLAIN_ROW, Board(n=3, title="main board", data={"finished": 9.0})], settings={"work_modes.mode": "orchestrator", "work_modes.board": 3})
                >> Nudged("deferred", words="I'll do that", filing=filing_on(None)),
            Given(WorkDeferred(agent=1, words="I'll do that"), rows=[PLAIN_ROW, Board(n=3, title="main board")], settings={"work_modes.mode": "builder", "work_modes.board": 3})
                >> Nudged("deferred", words="I'll do that", filing=filing_on(None)),
        ])
