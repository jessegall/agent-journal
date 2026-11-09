from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.agents.commands.set_agent_usage_limit.set_agent_usage_limit import SetAgentUsageLimit
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows


class SetAgentUsageLimitHandler(Handler[SetAgentUsageLimit, Agent]):
    """Saves the agent with its usage limit mark set or cleared."""

    command = SetAgentUsageLimit

    def __init__(self, agents: AgentRows, repository: Repository) -> None:
        self.agents, self.repository = agents, repository

    def handle(self, command: SetAgentUsageLimit, context: Context) -> Agent:
        return self.repository.update(self.agents.find(command.agent_id), context, usage_limit_ends_at=command.usage_limit_ends_at)
