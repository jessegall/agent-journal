from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Count(Scoped):
    """A number a workflow keeps for one agent between events: started at nought by one node, counted up by another, asked by a check."""

    session: str = ""
    name: str = ""
    value: int = 0

    def up(self) -> "Count":
        return self.with_(value=self.value + 1)
