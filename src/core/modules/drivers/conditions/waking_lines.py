from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class WakingLines:
    """Matches the lines typed to an agent that sits idle: those that say so, and those of the given sources."""

    sources: Sequence[str]

    def statement(self) -> Statement:
        marks = ", ".join("?" for _ in self.sources)
        return Statement(f"(wakes_agent = 1 OR source IN ({marks}))", list(self.sources))
