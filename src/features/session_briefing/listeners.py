from events import Fact
from events.agents import SessionStarted
from events.boards import BoardOrchestrated
from events.resources import AnyEvent
from events.session_briefing import SessionGreeted, StartBlockStale
from receiving import Listener
from resources.types import TYPES
from serving import ReadElsewhere

SHAPING = ("feature", "plugin", "environment")
SPAN = 1.0
REBUILD = "start block"


def stale() -> Fact:
    return StartBlockStale().spaced(REBUILD, SPAN)


class SpotSessionToGreet(Listener[SessionStarted]):
    def listen(self, event: SessionStarted, elsewhere: ReadElsewhere) -> list[Fact]:
        here = elsewhere.here()
        place = here.place()
        if place and place.owner:
            return []
        return [SessionGreeted(agent=event.agent, env=here.record.env).once(f"greeted|ready|{event.agent}")]


class SpotChangeToTheStartBlock(Listener[AnyEvent]):
    def listen(self, event: AnyEvent) -> list[Fact]:
        shaping = event.type in TYPES and (TYPES[event.type].start_heading or event.type in SHAPING)
        return [stale()] if shaping and not event.section and not event.is_read_mark else []


class SpotOrchestrationChange(Listener[BoardOrchestrated]):
    def listen(self, event: BoardOrchestrated) -> list[Fact]:
        return [stale()]

