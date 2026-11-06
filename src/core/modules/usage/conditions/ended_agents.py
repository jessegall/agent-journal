from dataclasses import dataclass

from core.base.database.statement import Statement
from core.modules.usage.conditions.agent_activity import AgentActivity


@dataclass(frozen=True)
class EndedAgents:
    activity: AgentActivity

    def statement(self) -> Statement:
        return Statement("retired_at IS NOT NULL")
