from collections.abc import Callable, Iterator, Sequence
from copy import copy
from dataclasses import replace
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
from engine.query.conditions.condition import Condition
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
from engine.query.enums.comparison_operator import ComparisonOperator
from engine.row.row_owner import RowOwner
from engine.query.errors.unknown_column_error import UnknownColumnError
from engine.query.errors.query_limit_error import QueryLimitError
from engine.model.table import Table
from engine.query.errors.unknown_table_error import UnknownTableError
from engine.query.join import Join
from engine.query.errors.unknown_operator_error import UnknownOperatorError
from engine.query.errors.unnamed_column_error import UnnamedColumnError
from engine.query.errors.column_kind_error import ColumnKindError


M = TypeVar("M", bound=Model | ViewModel, covariant=True)
V = TypeVar("V")
PAGE_SIZE_ROWS = 25
AGENT_COLUMN = "agent_id"
SESSION_COLUMN = "session_agent_id"
REMOVED_COLUMN = "removed_at"
ROW_KEY = "id"
VERSION_COLUMN = "version"
ALL_COLUMNS = "*"
DEFAULT_LIMIT_ROWS = 50
MOST_DECLARED_LIMIT_ROWS = 1000
WALK_ROWS = 50
COMPARISONS: dict[str, Callable[[str, object], Condition]] = {">": Greater, "<": Less, ">=": Minimum, "<=": Maximum}
OPERATORS = ("=", "!=", "<", "<=", ">", ">=")


class Query(Generic[M]):
    """Reads the rows of one model or view model: by key, by its own columns, in an order, one page at a time.
    """

    def __init__(self, database: Database, tables: Tables, model: type[M]) -> None:
        self.database, self.model, self.tables, self.table = database, model, tables, tables.table(model)
        self.joined_tables: tuple[Table[Model], ...] = ()
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
        return kept.read_newest(self.with_removed().matching(Equal(self.table.key, row_id)), lambda: self.find_many([row_id])[0], name=f"query.find:{statement}")

    def kept_first(self, *, name: str) -> M | None:
        """The first row, kept until the rows of this query change."""
        kept = self.database.kept_rows
        return self.first() if kept is None else kept.read(self, self.first, name=name)

    def kept_exists(self, *, name: str) -> bool:
        """Whether a row matches, kept until the rows of this query change."""
        kept = self.database.kept_rows
        return self.exists() if kept is None else kept.read(self, self.exists, name=name)

    def find_many(self, row_ids: Sequence[int]) -> list[M]:
        row_index = {getattr(row, self.table.key): row for row in self.with_removed().rows(self.select.matching(Among(self.table.key, row_ids)))}
        missing = tuple(row_id for row_id in row_ids if row_id not in row_index)
        if missing:
            raise MissingRowsError(self.model.cli_name, missing)
        return [row_index[row_id] for row_id in row_ids]

    def filter(self, **values: object) -> Self:
        """The old name of where for columns that equal values; new code writes where."""
        return self.where(**values)

    def where(self, *comparison: object, **values: object) -> Self:
        self.checked(*values, *(comparison[:1]))
        select = self.select
        if comparison:
            select = select.matching(self.compared(*comparison))
        for column, value in values.items():
            select = select.matching(Equal(column, stored(value)))
        query = self.with_select(select)
        return query.with_removed() if ROW_KEY in values else query

    def compared(self, *comparison: object) -> Condition:
        if len(comparison) not in (2, 3):
            raise UnknownOperatorError(f"where takes a column and a value, or a column, an operator and a value; operators: {' '.join(OPERATORS)}")
        column, written, value = (comparison[0], "=", comparison[1]) if len(comparison) == 2 else comparison
        if written not in OPERATORS:
            raise UnknownOperatorError(f"unknown operator {written}; use one of {' '.join(OPERATORS)}")
        operator = ComparisonOperator(written)
        if operator.is_equality():
            return Equal(str(column), stored(value), negated=operator is ComparisonOperator.UNEQUAL)
        return COMPARISONS[operator](str(column), stored(value))

    def select_columns(self, *columns: str) -> Self:
        """Reads only the named columns: this table's by name, and this table's or a joined table's as table.column or
        table.*."""
        self.checked_qualified(*(column for column in columns if "." in column))
        self.checked(*(column for column in columns if "." not in column))
        return self.with_select(self.select.column(", ".join(columns)))

    def where_in(self, column: str, values: "Sequence[object] | Query[Model]") -> Self:
        return self.matching(self.among(column, values, False))

    def where_not_in(self, column: str, values: "Sequence[object] | Query[Model]") -> Self:
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
        self.checked(column)
        return self.matching(Equal(column, None))

    def where_not_null(self, column: str) -> Self:
        self.checked(column)
        return self.matching(Equal(column, None, negated=True))

    def where_prefix(self, column: str, text: str) -> Self:
        self.checked(column)
        return self.matching(Prefix(column, text))

    def where_column(self, column: str, other_column: str) -> Self:
        self.checked(column)
        return self.matching(ColumnEqual(column, other_column))

    def where_exists(self, query: "Query[Model]") -> Self:
        return self.matching(Exists(query.scoped(query.select)))

    def where_not_exists(self, query: "Query[Model]") -> Self:
        return self.matching(Exists(query.scoped(query.select), negated=True))

    def checked(self, *columns: object) -> None:
        unknown = [str(column) for column in columns if not self.table.has_column(str(column))]
        if unknown:
            raise UnknownColumnError(f"{self.model.__name__} has no column {', '.join(unknown)}")

    def matching(self, condition: Condition) -> Self:
        return self.with_select(self.select.matching(condition))

    def newest(self) -> Self:
        return self.order_by("id", "desc")

    def oldest(self) -> Self:
        return self.order_by("id")

    def ordered(self, *columns: str) -> Self:
        query = self
        for column in columns:
            query = query.order_by(column)
        return query

    def descending(self, *columns: str) -> Self:
        query = self
        for column in columns:
            query = query.order_by(column, "desc")
        return query

    def order_by(self, column: str, direction: str = "asc") -> Self:
        if direction not in ("asc", "desc"):
            raise UnknownOperatorError("a direction is asc or desc")
        if "." in column:
            self.checked_qualified(column)
        else:
            self.checked(column)
        return self.with_select(self.select.ordered(column, direction == "desc"))

    def join(self, model: type[Model], first: str, operator: str, second: str) -> Self:
        return self.joining(model, first, operator, second, False)

    def left_join(self, model: type[Model], first: str, operator: str, second: str) -> Self:
        return self.joining(model, first, operator, second, True)

    def joining(self, model: type[Model], first: str, operator: str, second: str, left: bool) -> Self:
        if operator not in OPERATORS:
            raise UnknownOperatorError(f"unknown operator {operator}; use one of {' '.join(OPERATORS)}")
        table = self.tables.table(model)
        query = self.with_select(self.select.joined(Join(table.name, left, first, operator, second)))
        query.joined_tables = (*self.joined_tables, table)
        query.checked_qualified(first, second)
        if owner := self.database.row_owner:
            if issubclass(model, EnvironmentScoped) and owner.environment_id is not None:
                query = query.matching(Equal(f"{table.name}.{ENVIRONMENT_COLUMN}", owner.environment_id))
        if issubclass(model, Removable):
            query = query.matching(IsNull(f"{table.name}.{REMOVED_COLUMN}"))
        return query

    def checked_qualified(self, *names: str) -> None:
        tables = {self.table.name: self.table, **{table.name: table for table in self.joined_tables}}
        for name in names:
            table_name, _, column = name.partition(".")
            if table_name not in tables:
                raise UnknownTableError(f"{table_name} is not a table of this read")
            if column != "*" and not tables[table_name].has_column(column):
                raise UnknownColumnError(f"{table_name} has no column {column}")

    def group_by(self, *columns: str) -> Self:
        self.checked(*columns)
        return self.with_select(self.select.grouped(*columns))

    def count_by(self) -> dict[object, int]:
        select = self.scoped(self.select)
        if select.is_empty:
            return {}
        width = len(select.group_columns)
        return {(tuple(row[:width]) if width > 1 else row[0]): row[width] for row in self.database.rows(select.group_count_statement())}

    def pluck(self, column: str, kind: type[V]) -> list[V]:
        """The values of one column of the rows, at most the limit of the read, each of the kind named; a value of
        another kind is refused, since the column's type names what it holds."""
        self.checked(column)
        limit = self.select.limit or DEFAULT_LIMIT_ROWS
        select = self.scoped(self.select.column(column).sliced(limit + 1, 0).named(limit + 1))
        if select.is_empty:
            return []
        values = [Query.of_kind(row[0], kind, column) for row in self.database.rows(select.statement())]
        if len(values) > limit:
            self.database.report_cut(select.statement().sql, limit)
        return values[:limit]

    @staticmethod
    def of_kind(value: object, kind: type[V], column: str) -> V:
        if not isinstance(value, kind):
            raise ColumnKindError(f"{column} holds {type(value).__name__} {value!r}, not {kind.__name__}")
        return value

    def page(self, number: int = 1, size: int = PAGE_SIZE_ROWS) -> Page[M]:
        select = self.select.sliced(size, (number - 1) * size)
        if size > DEFAULT_LIMIT_ROWS:
            select = select.named(Query.checked_limit(size))
        return Page(tuple(self.rows(select)), number, size, self.count())

    def limit(self, rows: int, reason: str) -> Self:
        if not reason.strip():
            raise QueryLimitError("say why the read needs that many rows")
        return self.with_select(self.select.sliced(Query.checked_limit(rows), 0))

    # The rows of the query up to its limit, 50 unless it names one, by key unless it names an order; a read that finds
    # more is cut there and reported, never silent.
    def get(self) -> list[M]:
        limit = self.select.limit or DEFAULT_LIMIT_ROWS
        select = self.select.sliced(limit + 1, 0).named(limit + 1)
        if not select.orders and self.table.has_key_column():
            select = select.ordered(self.table.key, False)
        rows = self.rows(select)
        if len(rows) > limit:
            self.database.report_cut(self.scoped(select).statement().sql, limit)
        return rows[:limit]

    def take(self, rows: int) -> list[M]:
        """The first rows in the order of the query, as many as named; more rows past them are left on purpose and
        never reported as a cut."""
        size = Query.checked_limit(rows)
        return self.rows(self.select.sliced(size, 0).named(size))

    @staticmethod
    def checked_limit(rows: int) -> int:
        if rows < 1:
            raise QueryLimitError("a limit is at least 1")
        if rows > MOST_DECLARED_LIMIT_ROWS:
            raise QueryLimitError(f"a read names at most {MOST_DECLARED_LIMIT_ROWS} rows; walk the rows with every_row(reason) if you need them all")
        return rows

    def first(self) -> M | None:
        rows = self.rows(self.select.sliced(1, 0))
        return rows[0] if rows else None

    def every_row(self, reason: str) -> Iterator[M]:
        if not reason.strip():
            raise QueryLimitError("say why every row is needed")
        if not self.table.key or not self.table.has_column(self.table.key):
            raise QueryLimitError("every_row needs a key column to read in order")
        return self.walked(self.table.key)

    def walked(self, key: str) -> Iterator[M]:
        start = replace(self.select, orders=(), limit=0, offset=0).ordered(key, False)
        last: object = None
        while True:
            select = start if last is None else start.matching(Greater(key, last))
            rows = self.rows(select.sliced(WALK_ROWS, 0).named(WALK_ROWS))
            yield from rows
            if len(rows) < WALK_ROWS:
                return
            last = getattr(rows[-1], key)

    # The select with the scope of the read applied, as a kept read compares it.
    def kept_select(self) -> Select:
        return self.scoped(self.select)

    def count(self) -> int:
        select = self.scoped(self.select)
        if select.is_empty:
            return 0
        return self.database.rows(select.count_statement())[0][0]

    def counts_after(self, column: str, starts: Sequence[str]) -> list[int]:
        """For each start, how many rows have the column past it, in the order of the starts, read in one statement
        that reads no row before the earliest start."""
        self.checked(column)
        if not starts:
            return []
        select = self.scoped(self.select.matching(Greater(column, min(starts))))
        if select.is_empty:
            return [0 for _ in starts]
        return [int(count) for count in self.database.rows(select.counts_after_statement(column, tuple(starts)))[0]]

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
