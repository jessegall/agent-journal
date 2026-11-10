from engine.enums.agent_role import AgentRole
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.agents.commands.record_agent_interrupt.record_agent_interrupt import RecordAgentInterrupt
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows


class RecordAgentInterruptHandler(Handler[RecordAgentInterrupt, Agent]):
    """Saves the moment of an interrupt on an open main agent, or clears it; any other agent is left as it is."""

    command = RecordAgentInterrupt

    def __init__(self, agents: AgentRows, repository: Repository) -> None:
        self.agents, self.repository = agents, repository

    def handle(self, command: RecordAgentInterrupt, context: Context) -> Agent:
        agent = self.agents.find(command.agent_id)
        if agent.role != AgentRole.MAIN or agent.ended_at is not None:
            return agent
        return self.repository.update(agent, context, interrupted_at=context.timestamp if command.interrupted else None)
