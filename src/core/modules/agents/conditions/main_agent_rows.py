from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class MainAgentRows:
    """Matches rows owned by main agents."""

    def statement(self) -> Statement:
        return Statement("session_agent_id IN (SELECT id FROM agents WHERE role = 'main')")
