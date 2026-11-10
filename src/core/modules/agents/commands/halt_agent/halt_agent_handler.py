from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.agents.commands.halt_agent.halt_agent import HaltAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows


class HaltAgentHandler(Handler[HaltAgent, Agent]):
    """Saves the moment of the agent's first stopped hook; a later stopped hook writes nothing."""

    command = HaltAgent

    def __init__(self, agents: AgentRows, repository: Repository) -> None:
        self.agents, self.repository = agents, repository

    def handle(self, command: HaltAgent, context: Context) -> Agent:
        agent = self.agents.find(command.agent_id)
        if agent.halted_at is not None:
            return agent
        return self.repository.update(agent, context, halted_at=context.timestamp)
