from dataclasses import dataclass

from core.base.database.statement import Statement

AGENT_SCOPE = "(agent_id = ? OR (agent_id IS NULL AND (environment_id IS NULL OR environment_id = ?)))"


@dataclass(frozen=True)
class AgentScope:
    """Matches the memories one agent stands under: the project's, its environment's with no agent, and
    its own."""

    agent_id: int
    environment_id: int

    def statement(self) -> Statement:
        return Statement(AGENT_SCOPE, [self.agent_id, self.environment_id])
