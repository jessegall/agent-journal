from collections.abc import Iterator, Sequence
from copy import copy
from typing import Generic, Self, TypeVar
from core.base.database.constraint_refusals import ENVIRONMENT_COLUMN
from core.base.database.database import Database
from engine.errors.missing_rows_error import MissingRowsError
from core.base.model.agent_scoped import AgentScoped
from core.base.model.removable import Removable
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from core.base.model.view_model import ViewModel
from core.base.model.table import stored
from core.base.model.tables import Tables
from engine.query.condition import Condition
from engine.query.conditions.among import Among
from engine.query.conditions.equal import Equal
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.session_rows import SessionRows
from engine.row.page import Page
from engine.query.select import Select
from engine.row.row_owner import RowOwner
from engine.query.unknown_column_error import UnknownColumnError


M = TypeVar("M", bound=Model | ViewModel, covariant=True)
PAGE_SIZE_ROWS = 25
READ_ALL_BATCH_ROWS = 1000
AGENT_COLUMN = "agent_id"
SESSION_COLUMN = "session_agent_id"
REMOVED_COLUMN = "removed_at"
ROW_KEY = "id"
VERSION_COLUMN = "version"


class Query(Generic[M]):
    """Reads the rows of one model or view model: by key, by its own columns, in an order, one page at a time.
    """

    def __init__(self, database: Database, tables: Tables, model: type[M]) -> None:
        self.database, self.model, self.table = database, model, tables.table(model)
        self.select = Select(self.table.name)
        self.shows_removed = False

    def with_removed(self) -> Self:
        query = copy(self)
        query.shows_removed = True
        return query

    def find(self, row_id: int) -> M:
        kept = self.database.kept_rows
        if kept is None or self.table.key != ROW_KEY or not self.table.has_column(VERSION_COLUMN):
            return self.find_many([row_id])[0]
        statement = self.with_removed().scoped(self.select).conditions
        return kept.read_newest(self.table.name, lambda: self.find_many([row_id])[0], f"{self.table.key} = ?", [row_id], name=f"query.find:{statement}")

    def find_many(self, row_ids: Sequence[int]) -> list[M]:
        row_index = {getattr(row, self.table.key): row for row in self.with_removed().rows(self.select.matching(Among(self.table.key, row_ids)))}
        missing = tuple(row_id for row_id in row_ids if row_id not in row_index)
        if missing:
            raise MissingRowsError(self.model.cli_name, missing)
        return [row_index[row_id] for row_id in row_ids]

    def filter(self, **values: object) -> Self:
        unknown = [column for column in values if not self.table.has_column(column)]
        if unknown:
            raise UnknownColumnError(f"{self.model.__name__} has no column {', '.join(unknown)}")
        select = self.select
        for column, value in values.items():
            select = select.matching(Equal(column, stored(value)))
        query = self.with_select(select)
        return query.with_removed() if ROW_KEY in values else query

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

    def descending(self, *columns: str) -> Self:
        select = self.select
        for column in columns:
            select = select.ordered(column, True)
        return self.with_select(select)

    def full_table(self, reason: str) -> Self:
        return self.with_select(self.select.full_table(reason))

    def page(self, number: int = 1, size: int = PAGE_SIZE_ROWS) -> Page[M]:
        return Page(tuple(self.rows(self.select.sliced(size, (number - 1) * size))), number, size, self.count())

    def limited(self, size: int) -> list[M]:
        return self.rows(self.select.sliced(size, 0))

    def rows_without(self, column: str) -> list[M]:
        return list(self.matching(IsNull(column)).oldest().all_rows())

    def first(self) -> M | None:
        rows = self.limited(1)
        return rows[0] if rows else None

    def all_rows(self, size: int = READ_ALL_BATCH_ROWS) -> Iterator[M]:
        offset = 0
        while rows := self.rows(self.select.sliced(size, offset)):
            yield from rows
            if len(rows) < size:
                return
            offset += size

    def count(self) -> int:
        select = self.scoped(self.select)
        if select.is_empty:
            return 0
        return self.database.rows(select.count_statement())[0][0]

    def exists(self) -> bool:
        select = self.scoped(self.select)
        if select.is_empty:
            return False
        return bool(self.database.rows(select.exists_statement()))

    def with_select(self, select: Select) -> Self:
        query = copy(self)
        query.select = select
        return query

    def rows(self, select: Select) -> list[M]:
        select = self.scoped(select)
        if select.is_empty:
            return []
        return [self.typed(self.table.row_model(row)) for row in self.database.rows(select.statement())]

    def scoped(self, select: Select) -> Select:
        owner = self.database.row_owner
        if issubclass(self.model, Removable) and not self.shows_removed:
            select = select.matching(IsNull(REMOVED_COLUMN))
        if owner is not None and issubclass(self.model, EnvironmentScoped):
            select = self.environment_rows(select, owner)
        if issubclass(self.model, AgentScoped):
            return self.owner_rows(select, owner)
        return self.session_rows(select, owner)

    def session_rows(self, select: Select, owner: RowOwner | None) -> Select:
        if owner is None or self.database.read_actor_id is None or self.model.shared_rows or not self.table.has_column(SESSION_COLUMN):
            return select
        return select.matching(SessionRows(owner, self.table.has_nullable_column(SESSION_COLUMN)))

    def environment_rows(self, select: Select, owner: RowOwner) -> Select:
        return select if owner.environment_id is None else select.matching(Equal(ENVIRONMENT_COLUMN, owner.environment_id))

    def owner_rows(self, select: Select, owner: RowOwner | None) -> Select:
        if owner is None or owner.agent is None:
            return select
        return select.matching(IsNull(AGENT_COLUMN)) if owner.is_main else select.matching(Equal(AGENT_COLUMN, owner.agent))

    def typed(self, row: Model | ViewModel) -> M:
        if isinstance(row, self.model):
            return row
        raise TypeError(f"{self.table.name} gave a {type(row).__name__}, not a {self.model.__name__}")
