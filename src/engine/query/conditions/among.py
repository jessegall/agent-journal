from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class Among:
    """Matches rows whose column has one of the given values, or, with negated, none of them."""

    column: str
    values: Sequence[object]
    negated: bool = False

    def statement(self) -> Statement:
        if not self.values:
            return Statement("1" if self.negated else "0")
        return Statement(f"{self.column} {'NOT IN' if self.negated else 'IN'} ({', '.join('?' for _ in self.values)})", self.values)
