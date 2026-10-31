from collections.abc import Iterator, Sequence
from copy import copy
from typing import Generic, Self, TypeVar

from core.base.database.database import Database
from core.base.missing_rows import MissingRows
from core.base.model.model import Model
from core.base.model.view_model import ViewModel
from core.base.model.table import stored
from core.base.model.tables import Tables
from core.base.query.condition import Condition
from core.base.query.conditions.among import Among
from core.base.query.conditions.equal import Equal
from core.base.page import Page
from core.base.query.select import Select

M = TypeVar("M", bound=Model | ViewModel, covariant=True)
PAGE_SIZE_ROWS = 50


class UnknownColumnError(Exception):
    """Raised when a query filters on a column its model does not have."""


class Query(Generic[M]):
    """Reads the rows of one model or view model: by key, by its own columns, in an order, one page at a time."""

    def __init__(self, database: Database, tables: Tables, model: type[M]) -> None:
        self.database, self.model, self.table = database, model, tables.table(model)
        self.select = Select(self.table.name)

    def find(self, row_id: int) -> M:
        return self.find_many([row_id])[0]

    def find_many(self, row_ids: Sequence[int]) -> list[M]:
        row_index = {getattr(row, self.table.key): row for row in self.rows(self.select.matching(Among(self.table.key, row_ids)))}
        missing = tuple(row_id for row_id in row_ids if row_id not in row_index)
        if missing:
            raise MissingRows(self.model.cli_name, missing)
        return [row_index[row_id] for row_id in row_ids]

    def filter(self, **values: object) -> Self:
        unknown = [column for column in values if not self.table.has_column(column)]
        if unknown:
            raise UnknownColumnError(f"{self.model.__name__} has no column {', '.join(unknown)}")
        select = self.select
        for column, value in values.items():
            select = select.matching(Equal(column, stored(value)))
        return self.with_select(select)

    def matching(self, condition: Condition) -> Self:
        return self.with_select(self.select.matching(condition))

    def newest(self) -> Self:
        return self.with_select(self.select.ordered("id", True))

    def oldest(self) -> Self:
        return self.with_select(self.select.ordered("id", False))

    def ordered(self, *columns: str) -> Self:
        select = self.select
        for column in columns:
            select = select.ordered(column, False)
        return self.with_select(select)

    def page(self, number: int = 1, size: int = PAGE_SIZE_ROWS) -> Page[M]:
        return Page(tuple(self.rows(self.select.sliced(size, (number - 1) * size))), number, size, self.count())

    def all_rows(self, size: int = PAGE_SIZE_ROWS) -> Iterator[M]:
        offset = 0
        while rows := self.rows(self.select.sliced(size, offset)):
            yield from rows
            offset += size

    def count(self) -> int:
        return self.database.rows(self.select.count_statement())[0][0]

    def exists(self) -> bool:
        return bool(self.database.rows(self.select.exists_statement()))

    def with_select(self, select: Select) -> Self:
        query = copy(self)
        query.select = select
        return query

    def rows(self, select: Select) -> list[M]:
        return [self.typed(self.table.row_model(row)) for row in self.database.rows(select.statement())]

    def typed(self, row: Model | ViewModel) -> M:
        if isinstance(row, self.model):
            return row
        raise TypeError(f"{self.table.name} gave a {type(row).__name__}, not a {self.model.__name__}")
