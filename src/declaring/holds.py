from dataclasses import dataclass
from enum import StrEnum

from declaring.reach import Reach
from resources.fields import Loaded


class Runs(StrEnum):
    """Whether a hook part runs before the hook answers, because it decides the tool call, or after it, because it only tells the agent."""

    SYNC = "sync"
    ASYNC = "async"


class Stops(StrEnum):
    """How far a hold reaches into the agent's work: one on writes lets it read and search while it decides, one on everything stops the next tool call of any kind."""

    WRITES = "writes"
    EVERYTHING = "everything"

    def stops(self, writing: bool) -> bool:
        return self is Stops.EVERYTHING or writing


@dataclass(frozen=True)
class Hold(Loaded):
    why: str = ""
    reach: Reach = Reach.MAIN
    scope: Stops = Stops.WRITES
