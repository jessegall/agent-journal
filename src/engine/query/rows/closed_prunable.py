from typing import Self

from engine.query.conditions.excluding import Excluding
from engine.query.conditions.is_null import IsNull
from engine.query.query import Query
from engine.query.rows.prunable import Prunable


class ClosedPrunable(Prunable):
    """A rolling log whose rows may go once they are closed: an open row stays however old it is."""

    @classmethod
    def prunable(cls, query: Query[Self], table: str) -> Query[Self]:
        return super().prunable(query, table).matching(Excluding(IsNull("closed_at")))
