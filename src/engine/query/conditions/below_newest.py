from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class BelowNewest:
    """Matches the rows of a table older than its newest kept rows, by id; with nothing kept it matches every row."""

    table: str
    kept: int

    def statement(self) -> Statement:
        if self.kept < 1:
            return Statement("1 = 1")
        return Statement(f'id < coalesce((SELECT id FROM "{self.table}" ORDER BY id DESC LIMIT 1 OFFSET ?), 0)', [self.kept - 1])
