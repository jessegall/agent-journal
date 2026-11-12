from dataclasses import dataclass, replace

from engine.database.statement import Statement
from engine.query.condition import Condition
from engine.query.join import Join
from engine.query.order import Order


@dataclass(frozen=True)
class Select:
    """Builds a SELECT query step by step."""

    table: str
    columns: str = "*"
    conditions: tuple[Condition, ...] = ()
    orders: tuple[Order, ...] = ()
    limit: int = 0
    offset: int = 0
    full_table_reason: str | None = None
    named_limit: int = 0
    joins: tuple[Join, ...] = ()
    group_columns: tuple[str, ...] = ()

    @property
    def is_empty(self) -> bool:
        return any(condition.statement().is_false for condition in self.conditions)

    def matching(self, condition: Condition) -> "Select":
        return replace(self, conditions=(*self.conditions, condition))

    def ordered(self, column: str, descending: bool) -> "Select":
        return replace(self, orders=(*self.orders, Order(column, descending)))

    def sliced(self, limit: int, offset: int) -> "Select":
        return replace(self, limit=limit, offset=offset)

    def joined(self, join: Join) -> "Select":
        return replace(self, joins=(*self.joins, join))

    def grouped(self, *columns: str) -> "Select":
        return replace(self, group_columns=(*self.group_columns, *columns))

    @property
    def source(self) -> str:
        """The table of the read with the tables it joins."""
        return " ".join((self.table, *(join.sql for join in self.joins)))

    def named(self, rows: int) -> "Select":
        """The select names how many rows it may load, which the read limit accepts up to that number."""
        return replace(self, named_limit=rows)

    def full_table(self, reason: str) -> "Select":
        return replace(self, full_table_reason=reason)

    def column(self, column: str) -> "Select":
        return replace(self, columns=column)

    def filtered(self, statement: Statement) -> Statement:
        if not self.conditions:
            return statement
        return statement.joined(Statement.all_joined(tuple(condition.statement() for condition in self.conditions), " AND "), " WHERE ")

    def statement(self) -> Statement:
        order = f" ORDER BY {', '.join(order.sql for order in self.orders)}" if self.orders else ""
        page = (f" LIMIT {self.limit}" + (f" OFFSET {self.offset}" if self.offset else "")) if self.limit else ""
        statement = self.filtered(Statement(f"SELECT {self.columns} FROM {self.source}")).joined(Statement(order + page), "")
        return replace(statement, full_table_reason=self.full_table_reason, named_limit_rows=self.named_limit or None)

    def count_statement(self) -> Statement:
        return self.filtered(Statement(f"SELECT count(*) FROM {self.source}"))

    def group_count_statement(self) -> Statement:
        """Counts the rows of each value of the group columns."""
        columns = ", ".join(self.group_columns)
        return self.filtered(Statement(f"SELECT {columns}, count(*) FROM {self.source}")).joined(Statement(f" GROUP BY {columns}"), "")

    def signature_statement(self) -> Statement:
        """How many rows match, the sums of their ids and versions and their newest change: what a kept read
        compares to know its rows changed."""
        table = self.table
        return self.filtered(Statement(f"SELECT count(*), coalesce(sum({table}.id), 0), coalesce(sum({table}.version), 0), max({table}.updated_at) FROM {self.source}"))

    def newest_signature_statement(self) -> Statement:
        """The key, version and change time of the newest matching row: what a kept read of the newest row compares."""
        table = self.table
        return self.filtered(Statement(f"SELECT {table}.id, {table}.version, {table}.updated_at FROM {self.source}")).joined(Statement(f" ORDER BY {table}.id DESC LIMIT 1"), "")

    def conditions_statement(self) -> Statement:
        """The tables and conditions of the read, which name a kept read apart from every other."""
        return self.filtered(Statement(self.source))

    def exists_statement(self) -> Statement:
        return self.filtered(Statement(f"SELECT 1 FROM {self.source}")).joined(Statement(" LIMIT 1"), "")
