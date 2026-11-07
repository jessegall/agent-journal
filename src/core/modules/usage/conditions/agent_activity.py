from core.base.database.statement import Statement
from core.base.agent_work import AgentWork


class AgentActivity:
    """An agent whose process runs or whose work still holds its place."""

    def __init__(self, work: AgentWork) -> None:
        self.work = work

    def statement(self) -> Statement:
        held = tuple(self.work.held())
        if not held:
            return Statement("ended_at IS NULL AND retired_at IS NULL")
        placeholders = ", ".join("?" for _ in held)
        return Statement(f"(ended_at IS NULL OR id IN ({placeholders})) AND retired_at IS NULL", held)

    def idle(self) -> Statement:
        active = self.statement()
        return Statement(f"(NOT ({active.sql}) AND retired_at IS NULL)", active.parameters)
