from typing import Protocol

from engine.database.statement import Statement


class Condition(Protocol):
    """One condition in a query's WHERE clause."""

    def statement(self) -> Statement: ...
