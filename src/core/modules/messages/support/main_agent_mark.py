from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class MainAgentMark:
    """Matches marks of no agent or of a main agent: what a worker or a subagent does stays out of the main chat."""

    def statement(self) -> Statement:
        return Statement("(agent_id IS NULL OR agent_id IN (SELECT id FROM agents WHERE role = 'main'))")
