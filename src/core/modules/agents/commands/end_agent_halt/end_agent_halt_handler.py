from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.agents.commands.end_agent_halt.end_agent_halt import EndAgentHalt
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows


class EndAgentHaltHandler(Handler[EndAgentHalt, Agent]):
    """Saves the agent with its halt cleared."""

    command = EndAgentHalt

    def __init__(self, agents: AgentRows, repository: Repository) -> None:
        self.agents, self.repository = agents, repository

    def handle(self, command: EndAgentHalt, context: Context) -> Agent:
        return self.repository.update(self.agents.find(command.agent_id), context, halted_at=None)
