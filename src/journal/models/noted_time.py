from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class NotedTime(Scoped):
    """A moment a workflow noted in one environment, in the engine clock's seconds, asked later how long ago it was."""

    in_timeline: ClassVar[bool] = False
    """It changes on nearly every tool use and is read where it is kept."""

    name: str = ""
    at: float = 0.0

    @property
    def kept(self) -> float:
        return self.at
