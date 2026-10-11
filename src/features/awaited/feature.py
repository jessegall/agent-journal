from features.awaited.details import AwaitedDetails
from features.awaited.handlers import ReturnWhenAwaitedReport
from features.base import Feature
from features.journal import Journal
from engine.events.engine import ClockTicked
from expects import Given, Nudged, Unchanged, Updated
from features.helpers.resource import Helper
from resources.types import AgentRow, Work


class Awaited(Feature):
    details = AwaitedDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ReturnWhenAwaitedReport(), expects=[
            Given(ClockTicked(agent=1),
                  rows=[AgentRow(n=1), Work(n=3, data={"awaiting": "the build", "awaiting_on": "helper:2"}), Helper(n=2, data={"name": "Zed", "report": "built clean"})])
                >> Updated(Work(n=3), awaiting="", awaiting_on="") & Nudged("returned", awaiting="the build", results="Zed: built clean", n=3),
            Given(ClockTicked(agent=1),
                  rows=[AgentRow(n=1), Work(n=3, data={"awaiting": "the build", "awaiting_on": "helper:2"}), Helper(n=2, data={"name": "Zed"})])
                >> Unchanged(),
            Given(ClockTicked(agent=1),
                  rows=[AgentRow(n=1), Work(n=3, data={"awaiting": "the build", "awaiting_on": "helper:2", "parked": "something else first"}),
                        Helper(n=2, data={"name": "Zed", "report": "built clean"})])
                >> Unchanged(),
        ])
