from events import Fact
from events.resources import ResourceCreated
from events.source_links import SourceUncited
from receiving import Listener
from resources.base import AGENT
from resources.types import AgentRow, Doc, Plan, Report
from serving import Clock, ReadRows, Settings

BUILT_ON = ("plan", "doc", "report")
NAMED = 3


class SpotUncitedSource(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, plans: ReadRows[Plan], docs: ReadRows[Doc], reports: ReadRows[Report],
               agents: ReadRows[AgentRow], settings: Settings, clock: Clock) -> list[Fact]:
        if event.actor != AGENT or event.type not in BUILT_ON or not agents.has_primary():
            return []
        made = {"plan": plans, "doc": docs, "report": reports}[event.type].peek(event.n)
        since = clock.now() - settings.within * 60
        uncited = [row for source in (reports, docs) for row in reversed(source.lately(since)) if AGENT in row.seen and row.ref != made.ref and row.ref not in made.refs]
        if not uncited:
            return []
        return [SourceUncited(type=event.type, n=event.n, read=", ".join(row.ref for row in uncited[-NAMED:]))]
