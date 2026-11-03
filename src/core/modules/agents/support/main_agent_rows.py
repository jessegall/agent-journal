from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class MainAgentRows:
    """Matches the rows of a main agent, which leaves out those of a worker or a subagent."""

    def statement(self) -> Statement:
        return Statement("agent_id IN (SELECT id FROM agents WHERE role = 'main')")
