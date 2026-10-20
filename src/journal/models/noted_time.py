from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class NotedTime(Scoped):
    """A moment a workflow noted in one environment, in the engine clock's seconds, asked later how long ago it was."""

    kind: ClassVar[str] = "time"
    in_timeline: ClassVar[bool] = False
    """It changes on nearly every tool use and is read where it is kept."""

    name: str = ""
    at: float = 0.0

    @property
    def kept(self) -> float:
        return self.at

    def said(self, now: float) -> str:
        return f"{self.shown(now)} s ago"

    def shown(self, now: float) -> int:
        """What the canvas shows of it: the seconds since it was noted."""
        return int(now - self.at)
