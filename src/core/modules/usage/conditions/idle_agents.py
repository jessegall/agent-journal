from dataclasses import dataclass

from core.base.database.statement import Statement
from core.modules.usage.conditions.agent_activity import AgentActivity


@dataclass(frozen=True)
class AvailableAgents:
    activity: AgentActivity

    def statement(self) -> Statement:
        return self.activity.idle()
