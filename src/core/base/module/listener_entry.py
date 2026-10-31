from dataclasses import dataclass
from enum import StrEnum

from core.base.change.event_pattern import EventPattern
from core.base.module.dotted_path import DottedPath


class ListenerTiming(StrEnum):
    """When a listener runs: before a deletion is written, after a save is written, or after the commit."""

    DELETION = "deletion"
    SAVE = "save"
    COMMIT = "commit"


@dataclass(frozen=True)
class ListenerEntry:
    """A registered listener as the registry lists it: its full name, the event it hears, when it runs, where
    its class lives, and its place in the order."""

    name: str
    event: EventPattern
    timing: ListenerTiming
    path: DottedPath
    position: int
