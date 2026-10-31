from dataclasses import dataclass
from enum import StrEnum

from core.base.actor import CORE_ACTOR_ID
from core.base.change.event_pattern import EventPattern
from core.base.registry.dotted_path import DottedPath


class ListenerTiming(StrEnum):
    """When a listener runs: before a deletion is written, after a save is written, or after the commit."""

    DELETION = "deletion"
    SAVE = "save"
    COMMIT = "commit"


@dataclass(frozen=True)
class ListenerEntry:
    """A registered listener as the registry lists it: its full name, the event it handles, when it runs, where
    its class lives, its place in the order, and the actor it acts as: its module's, or the core's."""

    name: str
    event: EventPattern
    timing: ListenerTiming
    path: DottedPath
    position: int
    actor_id: int = CORE_ACTOR_ID
