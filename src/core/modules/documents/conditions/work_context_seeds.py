from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.query.condition import Condition


@dataclass(frozen=True)
class WorkContextSeeds:
    """Combines the existing source and comment queries for an authorized resource."""

    selects: tuple[Condition, ...]

    def statement(self) -> Statement:
        parts = tuple(select.statement() for select in self.selects)
        return Statement(" UNION ".join(part.sql for part in parts), tuple(value for part in parts for value in part.parameters))
