from features.awaited.details import AwaitedDetails
from features.awaited.handlers import HandBackTheResults
from features.awaited.listeners import SpotEndedWaits
from framework.base import Feature
from framework.journal import Journal
from events.agents import ClockTicked
from events.awaited import WaitEnded
from expects import Dispatches, Given, Nudged, Updated, nothing
from resources.helpers import Helper
from resources.types import AgentRow, Work

WAITING = {"awaiting": "the suite and Rhea", "awaiting_on": "b2gb9ud45,helper:2"}
RUN = {"id": "toolu_1", "task_id": "b2gb9ud45", "command": "pytest -q", "task": "the suite", "running": False, "ended": 5.0, "status": "completed", "code": 0}


def agent(*runs: dict) -> AgentRow:
    return AgentRow(n=1, data={"shell_rows": list(runs)})


def waiting(**more) -> Work:
    return Work(n=3, data={**WAITING, **more})


def helper(completed: float = 0.0, **more) -> Helper:
    return Helper(n=2, completed=completed, data={"name": "Rhea", **more})


class Awaited(Feature):
    details = AwaitedDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ClockTicked, SpotEndedWaits(), expects=[
            Given(ClockTicked(agent=1), rows=[agent(RUN), waiting(), helper(report="hooks spend 40ms in imports")])
                >> Dispatches(WaitEnded(work=3, awaiting="the suite and Rhea", results="the suite completed, passed; Rhea: hooks spend 40ms in imports", count=0)),
            Given(ClockTicked(agent=1), rows=[agent(RUN), waiting(), helper(completed=9.0)])
                >> Dispatches(WaitEnded(work=3, awaiting="the suite and Rhea", results="the suite completed, passed; Rhea finished", count=0)),
            Given(ClockTicked(agent=1), rows=[agent(RUN), waiting(), helper()]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[agent({**RUN, "running": True}), waiting(), helper(report="done")]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[agent(), waiting(), helper(report="done")]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[agent(RUN), waiting(parked="something else first"), helper(report="done")]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[agent({**RUN, "ended": 0.0, "status": "", "code": None}), Work(n=3, data={"awaiting": "the suite", "awaiting_on": "b2gb9ud45"})])
                >> Dispatches(WaitEnded(work=3, awaiting="the suite", results="the suite ended", count=0)),
            Given(ClockTicked(agent=1), rows=[agent({**RUN, "code": 1}), Work(n=3, data={"awaiting": "the suite", "awaiting_on": "b2gb9ud45"})])
                >> Dispatches(WaitEnded(work=3, awaiting="the suite", results="the suite completed, failed with exit code 1", count=0)),
        ])
        journal.events.handle(WaitEnded, HandBackTheResults(), expects=[
            Given(WaitEnded(work=3, awaiting="the build", results="Zed: built clean", count=0), rows=[AgentRow(n=1), Work(n=3, data={"awaiting": "the build", "awaiting_on": "helper:2"})])
                >> Updated(Work(n=3), awaiting="", awaiting_on="") & Nudged("returned", results="Zed: built clean", n=3),
        ])
