from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class NotedTime(Scoped):
    """A moment a workflow noted in one environment, in the engine clock's seconds, asked later how long ago it was."""

    name: str = ""
    at: float = 0.0
