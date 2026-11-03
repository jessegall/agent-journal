from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class MainAgentRuns:
    """Matches the runs of a main agent, which leaves out what a worker or a subagent ran."""

    def statement(self) -> Statement:
        return Statement("agent_id IN (SELECT id FROM agents WHERE role = 'main')")
