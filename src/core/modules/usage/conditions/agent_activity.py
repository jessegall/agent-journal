from core.base.database.statement import Statement
from engine.agent.agent_work import AgentWork
from core.modules.usage.conditions.agent_activity_condition import AgentActivityCondition


class AgentActivity:
    """An agent whose process runs or whose work still holds its place."""

    def __init__(self, work: AgentWork) -> None:
        self.work = work

    def statement(self) -> Statement:
        return self.current().statement()

    def idle(self) -> Statement:
        return self.current().idle()

    def current(self) -> AgentActivityCondition:
        return AgentActivityCondition(self.work.pending())
