from dataclasses import dataclass

from engine.actor.actor import CORE_ACTOR_ID
from engine.change.event_pattern import EventPattern
from engine.dotted_path.dotted_path import DottedPath
from engine.registry.listener_timing import ListenerTiming


@dataclass(frozen=True)
class ListenerEntry:
    """A registered listener as the registry lists it: its full name, the event it handles, when it runs, the
    dotted path of its class, its place in the order, and the actor it runs as: its module's, or the core's.
    """

    name: str
    event: EventPattern
    timing: ListenerTiming
    path: DottedPath
    position: int
    actor_id: int = CORE_ACTOR_ID
