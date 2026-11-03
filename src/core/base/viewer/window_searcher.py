from collections.abc import Sequence
from typing import ClassVar

from core.base.model.model import Model
from core.base.page import Page
from core.base.query.conditions.contains_every import ContainsEvery
from core.base.query.queries import Queries

FOUND_ROWS = 1000


class WindowSearcher:
    """The function a window declares for its search: from the words typed to the rows found."""

    def found(self, words: Sequence[str]) -> Page[Model]:
        raise NotImplementedError


class ModelSearcher(WindowSearcher):
    """Finds the rows of one model that hold every word in its search fields, newest first; with no words it
    finds them all."""

    model: ClassVar[type[Model]]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def found(self, words: Sequence[str]) -> Page[Model]:
        query = self.queries.query(self.model)
        if words:
            query = query.matching(ContainsEvery(self.model.search_fields, words))
        return query.newest().page(1, FOUND_ROWS)
