from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class PriorRowValue:
    """Matches rows whose columns, compared in order, come before the given values: a cursor over a sort on several
    columns."""

    columns: Sequence[str]
    values: Sequence[object]

    def statement(self) -> Statement:
        marks = ", ".join("?" for _ in self.values)
        return Statement(f"({', '.join(self.columns)}) < ({marks})", self.values)
