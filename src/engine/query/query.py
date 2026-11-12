from collections.abc import Iterator, Sequence
from copy import copy
from typing import Generic, Self, TypeVar
from engine.database.constraint_refusals import ENVIRONMENT_COLUMN
from engine.database.database import Database
from engine.errors.missing_rows_error import MissingRowsError
from engine.model.agent_scoped import AgentScoped
from engine.model.removable import Removable
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.view_model import ViewModel
from engine.model.table import stored
from engine.model.tables import Tables
from engine.query.condition import Condition
from engine.query.conditions.among import Among
from engine.query.conditions.column_equal import ColumnEqual
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.conditions.greater import Greater
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.less import Less
from engine.query.conditions.maximum import Maximum
from engine.query.conditions.minimum import Minimum
from engine.query.conditions.prefix import Prefix
from engine.query.conditions.scoped_select import ScopedSelect
from engine.query.conditions.session_rows import SessionRows
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.row.page import Page
from engine.query.select import Select
from engine.row.row_owner import RowOwner
from engine.query.errors.unknown_column_error import UnknownColumnError
from engine.query.errors.unknown_operator_error import UnknownOperatorError
from engine.query.errors.unnamed_column_error import UnnamedColumnError


M = TypeVar("M", bound=Model | ViewModel, covariant=True)
PAGE_SIZE_ROWS = 25
READ_ALL_BATCH_ROWS = 1000
AGENT_COLUMN = "agent_id"
SESSION_COLUMN = "session_agent_id"
REMOVED_COLUMN = "removed_at"
ROW_KEY = "id"
VERSION_COLUMN = "version"
ALL_COLUMNS = "*"
COMPARISONS: dict[str, type[Condition]] = {">": Greater, "<": Less, ">=": Minimum, "<=": Maximum}
OPERATORS = ("=", "!=", "<", "<=", ">", ">=")


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
        return self.where(**values)

    def where(self, *comparison: object, **values: object) -> Self:
        """Matches rows whose columns equal the given values, or, given a column, an operator and a value, rows
        whose column compares so; a column and a value alone compare by equality."""
        self.checked(*values, *(comparison[:1]))
        select = self.select
        if comparison:
            select = select.matching(self.compared(*comparison))
        for column, value in values.items():
            select = select.matching(Equal(column, stored(value)))
        query = self.with_select(select)
        return query.with_removed() if ROW_KEY in values else query

    def compared(self, *comparison: object) -> Condition:
        column, operator, value = (comparison[0], "=", comparison[1]) if len(comparison) == 2 else comparison
        if operator not in OPERATORS:
            raise UnknownOperatorError(f"unknown operator {operator}; use one of {' '.join(OPERATORS)}")
        if operator in ("=", "!="):
            return Equal(str(column), stored(value), negated=operator == "!=")
        return COMPARISONS[str(operator)](str(column), stored(value))

    def select_columns(self, *columns: str) -> Self:
        """Reads only the named columns, which may name this table's columns as table.column or table.*."""
        self.checked(*(column.split(".", 1)[1] if column.startswith(f"{self.table.name}.") else column for column in columns if not column.endswith(".*")))
        return self.with_select(self.select.column(", ".join(columns)))

    def where_in(self, column: str, values: "Sequence[object] | Query[Model]") -> Self:
        """Matches rows whose column is among the values, or among the column an inner query selects."""
        return self.matching(self.among(column, values, False))

    def where_not_in(self, column: str, values: "Sequence[object] | Query[Model]") -> Self:
        """Matches rows whose column is not among the values, or not among the column an inner query selects."""
        return self.matching(self.among(column, values, True))

    def among(self, column: str, values: "Sequence[object] | Query[Model]", negated: bool) -> Condition:
        self.checked(column)
        if not isinstance(values, Query):
            return Among(column, [stored(value) for value in values], negated=negated)
        inner = values.scoped(values.select)
        if inner.columns == ALL_COLUMNS:
            raise UnnamedColumnError("name the column to match: query.select(column)")
        return SubqueryMatch(column, ScopedSelect(inner), negated=negated)

    def where_null(self, column: str) -> Self:
        """Matches rows whose column has no value."""
        self.checked(column)
        return self.matching(Equal(column, None))

    def where_not_null(self, column: str) -> Self:
        """Matches rows whose column has a value."""
        self.checked(column)
        return self.matching(Equal(column, None, negated=True))

    def where_prefix(self, column: str, text: str) -> Self:
        """Matches rows whose text column opens on the given words, taken literally."""
        self.checked(column)
        return self.matching(Prefix(column, text))

    def where_column(self, column: str, other_column: str) -> Self:
        """Matches rows whose column equals another column, which may name the outer table as table.column."""
        self.checked(column)
        return self.matching(ColumnEqual(column, other_column))

    def where_exists(self, query: "Query[Model]") -> Self:
        """Matches rows for which an inner query finds a row."""
        return self.matching(Exists(query.scoped(query.select)))

    def where_not_exists(self, query: "Query[Model]") -> Self:
        """Matches rows for which an inner query finds no row."""
        return self.matching(Exists(query.scoped(query.select), negated=True))

    def checked(self, *columns: object) -> None:
        unknown = [str(column) for column in columns if not self.table.has_column(str(column))]
        if unknown:
            raise UnknownColumnError(f"{self.model.__name__} has no column {', '.join(unknown)}")

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
