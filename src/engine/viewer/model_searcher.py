from collections.abc import Sequence
from typing import ClassVar

from engine.model.model import Model
from engine.row.page import Page
from engine.query.conditions.contains_every import ContainsEvery
from engine.query.queries import Queries
from engine.query.query import Query
from engine.viewer.window_searcher import WindowSearcher

MAX_ROWS = 1000


class ModelSearcher(WindowSearcher):
    """Finds the rows of one model that hold every term in its search fields, newest first; with no terms it
    finds them all."""

    model: ClassVar[type[Model]]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def found(self, terms: Sequence[str]) -> Page[Model]:
        query = self.query()
        if terms:
            query = query.matching(ContainsEvery(self.model.search_fields, terms))
        return query.newest().page(1, MAX_ROWS)

    def query(self) -> Query[Model]:
        return self.queries.query(self.model)
