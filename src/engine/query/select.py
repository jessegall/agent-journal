from dataclasses import dataclass, replace

from engine.database.statement import Statement
from engine.query.condition import Condition
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

    @property
    def is_empty(self) -> bool:
        return any(condition.statement().is_false for condition in self.conditions)

    def matching(self, condition: Condition) -> "Select":
        return replace(self, conditions=(*self.conditions, condition))

    def ordered(self, column: str, descending: bool) -> "Select":
        return replace(self, orders=(*self.orders, Order(column, descending)))

    def sliced(self, limit: int, offset: int) -> "Select":
        return replace(self, limit=limit, offset=offset)

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
        page = f" LIMIT {self.limit} OFFSET {self.offset}" if self.limit else ""
        statement = self.filtered(Statement(f"SELECT {self.columns} FROM {self.table}")).joined(Statement(order + page), "")
        return replace(statement, full_table_reason=self.full_table_reason)

    def count_statement(self) -> Statement:
        return self.filtered(Statement(f"SELECT count(*) FROM {self.table}"))

    def exists_statement(self) -> Statement:
        return self.filtered(Statement(f"SELECT 1 FROM {self.table}")).joined(Statement(" LIMIT 1"), "")
