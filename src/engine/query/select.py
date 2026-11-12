from dataclasses import dataclass, replace

from engine.database.statement import Statement
from engine.query.condition import Condition
from engine.query.condition_join import ConditionJoin
from engine.query.expressions.expression import Expression
from engine.query.expressions.inlined import Inlined
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
    named_limit: int = 0
    joins: tuple[Join | ConditionJoin, ...] = ()
    group_columns: tuple[str, ...] = ()
    expressions: tuple[Expression, ...] = ()
    alias: str = ""
    derived: Expression | None = None
    unions: tuple[tuple[bool, "Select"], ...] = ()

    @property
    def is_empty(self) -> bool:
        return any(condition.statement().is_false for condition in self.conditions)

    def matching(self, condition: Condition) -> "Select":
        return replace(self, conditions=(*self.conditions, condition))

    def ordered(self, column: str, descending: bool) -> "Select":
        return replace(self, orders=(*self.orders, Order(column, descending)))

    def sliced(self, limit: int, offset: int) -> "Select":
        return replace(self, limit=limit, offset=offset)

    def joined(self, join: Join | ConditionJoin) -> "Select":
        return replace(self, joins=(*self.joins, join))

    def grouped(self, *columns: str) -> "Select":
        return replace(self, group_columns=(*self.group_columns, *columns))

    def selecting(self, *expressions: Expression) -> "Select":
        """Reads these expressions as its columns, in place of the column text."""
        return replace(self, expressions=expressions)

    def named_as(self, alias: str) -> "Select":
        """Reads its table, or the subselect it reads from, under another name."""
        return replace(self, alias=alias)

    def reading(self, derived: Expression) -> "Select":
        """Reads the rows of a subselect, named by the alias of the select, in place of a table."""
        return replace(self, derived=derived)

    def union(self, other: "Select", every: bool = True) -> "Select":
        """Adds the rows of another select; every keeps rows both give twice (UNION ALL), else each once (UNION)."""
        return replace(self, unions=(*self.unions, (every, other)))

    @property
    def source(self) -> str:
        """The table of the read with the tables it joins."""
        table = self.derived.sql() if self.derived is not None else self.table
        named = f"{table} AS {self.alias}" if self.alias else table
        return " ".join((named, *(join.sql for join in self.joins)))

    def named(self, rows: int) -> "Select":
        """The select names how many rows it may load, which the read limit accepts up to that number."""
        return replace(self, named_limit=rows)

    def column(self, column: str) -> "Select":
        return replace(self, columns=column)

    def filtered(self, statement: Statement) -> Statement:
        if not self.conditions:
            return statement
        return statement.joined(Statement.all_joined(tuple(condition.statement() for condition in self.conditions), " AND "), " WHERE ")

    def statement(self) -> Statement:
        order = f" ORDER BY {', '.join(order.sql for order in self.orders)}" if self.orders else ""
        page = (f" LIMIT {self.limit}" + (f" OFFSET {self.offset}" if self.offset else "")) if self.limit else ""
        statement = self.core_statement()
        for every, other in self.unions:
            statement = statement.joined(other.core_statement(), " UNION ALL " if every else " UNION ")
        statement = statement.joined(Statement(order + page), "")
        return replace(statement, named_limit_rows=self.named_limit or None)

    def core_statement(self) -> Statement:
        """The SELECT without the selects it adds and without its order and page."""
        columns = ", ".join(expression.sql() for expression in self.expressions) if self.expressions else self.columns
        statement = self.filtered(Statement(f"SELECT {columns} FROM {self.source}"))
        if self.group_columns:
            statement = statement.joined(Statement(f" GROUP BY {', '.join(self.group_columns)}"), "")
        return statement

    def view_sql(self) -> str:
        """The SELECT with its values written into the text, as CREATE VIEW needs it."""
        return Inlined(self).text()

    def count_statement(self) -> Statement:
        return self.filtered(Statement(f"SELECT count(*) FROM {self.source}"))

    def counts_after_statement(self, column: str, starts: tuple[object, ...]) -> Statement:
        """For each start, how many rows have the column past it: one count per start, in one statement."""
        sums = ", ".join(f"coalesce(sum({column} > ?), 0)" for _ in starts)
        return self.filtered(Statement(f"SELECT {sums} FROM {self.source}", starts))

    def group_count_statement(self) -> Statement:
        """Counts the rows of each value of the group columns."""
        columns = ", ".join(self.group_columns)
        return self.filtered(Statement(f"SELECT {columns}, count(*) FROM {self.source}")).joined(Statement(f" GROUP BY {columns}"), "")

    def signature_statement(self) -> Statement:
        """How many rows match, and for the table and each table it joins the sums of their ids and versions and
        their newest change: what a kept read compares to know its rows changed."""
        sums = ", ".join(f"coalesce(sum({table}.id), 0), coalesce(sum({table}.version), 0), max({table}.updated_at)" for table in self.read_tables)
        return self.filtered(Statement(f"SELECT count(*), {sums} FROM {self.source}"))

    @property
    def read_tables(self) -> tuple[str, ...]:
        return (self.table, *(join.table for join in self.joins))

    def newest_signature_statement(self) -> Statement:
        """The key, version and change time of the newest matching row: what a kept read of the newest row compares."""
        table = self.table
        return self.filtered(Statement(f"SELECT {table}.id, {table}.version, {table}.updated_at FROM {self.source}")).joined(Statement(f" ORDER BY {table}.id DESC LIMIT 1"), "")

    def conditions_statement(self) -> Statement:
        """The tables and conditions of the read, which name a kept read apart from every other."""
        return self.filtered(Statement(self.source))

    def exists_statement(self) -> Statement:
        return self.filtered(Statement(f"SELECT 1 FROM {self.source}")).joined(Statement(" LIMIT 1"), "")
