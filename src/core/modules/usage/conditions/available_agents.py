from dataclasses import dataclass

from engine.database.statement import Statement
from core.modules.usage.conditions.agent_activity import AgentActivity
from core.modules.usage.conditions.agent_activity_condition import AgentActivityCondition


@dataclass(frozen=True)
class AvailableAgents:
    activity: AgentActivity | AgentActivityCondition

    def statement(self) -> Statement:
        return self.activity.idle()
