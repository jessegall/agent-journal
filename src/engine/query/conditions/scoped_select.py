from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.select import Select


@dataclass(frozen=True)
class ScopedSelect:
    """An inner query's select with its scope already applied, used where a condition needs a whole select."""

    select: Select

    def statement(self) -> Statement:
        return self.select.statement()
