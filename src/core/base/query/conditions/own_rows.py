from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class OwnRows:
    """Matches the rows of one agent and the rows of no agent."""

    agent_id: int

    def statement(self) -> Statement:
        return Statement("(agent_id = ? OR agent_id IS NULL)", [self.agent_id])
