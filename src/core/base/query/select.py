from dataclasses import dataclass, replace

from core.base.database.statement import Statement
from core.base.query.condition import Condition
from core.base.query.order import Order


@dataclass(frozen=True)
class Select:
    """Builds a SELECT query step by step."""

    table: str
    columns: str = "*"
    conditions: tuple[Condition, ...] = ()
    orders: tuple[Order, ...] = ()
    limit: int = 0
    offset: int = 0

    def matching(self, condition: Condition) -> "Select":
        return replace(self, conditions=self.conditions + (condition,))

    def ordered(self, column: str, descending: bool) -> "Select":
        return replace(self, orders=self.orders + (Order(column, descending),))

    def sliced(self, limit: int, offset: int) -> "Select":
        return replace(self, limit=limit, offset=offset)

    def column(self, column: str) -> "Select":
        return replace(self, columns=column)

    def filtered(self, head: Statement) -> Statement:
        if not self.conditions:
            return head
        return head.joined(Statement.all_joined(tuple(condition.statement() for condition in self.conditions), " AND "), " WHERE ")

    def statement(self) -> Statement:
        order = f" ORDER BY {', '.join(order.sql for order in self.orders)}" if self.orders else ""
        page = f" LIMIT {self.limit} OFFSET {self.offset}" if self.limit else ""
        return self.filtered(Statement(f"SELECT {self.columns} FROM {self.table}")).joined(Statement(order + page), "")

    def count_statement(self) -> Statement:
        return self.filtered(Statement(f"SELECT count(*) FROM {self.table}"))

    def exists_statement(self) -> Statement:
        return self.filtered(Statement(f"SELECT 1 FROM {self.table}")).joined(Statement(" LIMIT 1"), "")
