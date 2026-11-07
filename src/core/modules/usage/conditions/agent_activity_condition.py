from collections.abc import Mapping

from core.base.database.statement import Statement


class AgentActivityCondition:
    def __init__(self, pending: Mapping[int, str]) -> None:
        self.pending = pending

    def statement(self) -> Statement:
        pending = tuple(self.pending)
        if not pending:
            return Statement("ended_at IS NULL AND retired_at IS NULL")
        placeholders = ", ".join("?" for _ in pending)
        return Statement(f"(ended_at IS NULL OR id IN ({placeholders})) AND retired_at IS NULL", pending)

    def idle(self) -> Statement:
        active = self.statement()
        return Statement(f"(NOT ({active.sql}) AND retired_at IS NULL)", active.parameters)
