from datetime import timedelta
from typing import ClassVar, Self

from engine.query.conditions.less import Less
from engine.query.query import Query
from engine.time.timestamp import Timestamp


class Prunable:
    """A model whose rows fill the database without end: it keeps them for kept_for, and prunable() names, as a
    query, the rows that may be deleted now. A model narrows that query to the states that may go."""

    kept_for: ClassVar[timedelta]

    @classmethod
    def prunable(cls, query: Query[Self], now: Timestamp) -> Query[Self]:
        return query.matching(Less("created_at", Timestamp(now.value - cls.kept_for).text))
