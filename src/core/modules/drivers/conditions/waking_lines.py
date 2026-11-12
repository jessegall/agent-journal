from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.among import Among
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.equal import Equal


@dataclass(frozen=True)
class WakingLines:
    """Matches the lines typed to an agent that sits idle: those that say so, and those of the given sources."""

    sources: Sequence[str]

    def statement(self) -> Statement:
        return AnyOf([Equal("wakes_agent", True), Among("source", list(self.sources))]).statement()
