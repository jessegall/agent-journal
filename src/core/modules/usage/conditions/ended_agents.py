from dataclasses import dataclass

from core.base.database.statement import Statement
from core.modules.usage.conditions.agent_activity import AgentActivity


@dataclass(frozen=True)
class EndedAgents:
    activity: AgentActivity

    def statement(self) -> Statement:
        active = self.activity.statement()
        idle = self.activity.idle()
        return Statement(f"NOT ({active.sql}) AND NOT ({idle.sql})", active.parameters + idle.parameters)
