from typing import ClassVar, Self

from engine.query.conditions.below_newest import BelowNewest
from engine.query.query import Query


class Prunable:
    """A model whose rows fill the database without end: a rolling log that keeps its newest kept_rows, and
    prunable() names, as a query, the rows that may be deleted now. A model narrows that query to the states
    that may go."""

    kept_rows: ClassVar[int]

    @classmethod
    def prunable(cls, query: Query[Self], table: str) -> Query[Self]:
        return query.matching(BelowNewest(table, cls.kept_rows))
