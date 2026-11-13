from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.expressions.sql_name import SqlName


@dataclass(frozen=True)
class BelowNewestPer:
    """Matches the rows of a table older than the newest kept rows of their own group, the group being the
    value of one column, by id."""

    table: str
    column: str
    kept: int

    def __post_init__(self) -> None:
        SqlName(self.table)
        SqlName(self.column)

    def statement(self) -> Statement:
        return Statement(f'id IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY "{self.column}" ORDER BY id DESC) AS place'
                         f' FROM "{self.table}") WHERE place > ?)', [self.kept])
