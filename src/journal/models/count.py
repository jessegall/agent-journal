from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Count(Scoped):
    """A number a workflow keeps in one environment between events: started at zero by one node, counted up by another, asked by a check."""

    name: str = ""
    value: int = 0

    def up(self) -> "Count":
        return self.with_(value=self.value + 1)
