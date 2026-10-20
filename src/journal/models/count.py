from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Count(Scoped):
    """A number a workflow keeps in one environment between events: started at zero by one node, counted up by another, asked by a check."""

    kind: ClassVar[str] = "count"
    in_timeline: ClassVar[bool] = False
    """It changes on nearly every tool use and is read where it is kept."""

    name: str = ""
    value: int = 0

    @property
    def kept(self) -> int:
        return self.value

    def shown(self, now: float) -> int:
        """What the canvas shows of it: the number."""
        return self.value

    def said(self, now: float) -> str:
        return str(self.value)

    def up(self) -> "Count":
        return self.with_(value=self.value + 1)
