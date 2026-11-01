from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.person_check import PersonCheck
from core.modules.drivers.commands.pause_agent.pause_agent import PauseAgent


class PauseAgentHandler(Handler[PauseAgent, Agent]):
    """Marks a running agent paused; an agent that ended or is paused already is refused."""

    command = PauseAgent

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: PauseAgent, context: Context) -> Agent:
        PersonCheck.require(context, "only a person pauses an agent")
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended")
        if agent.paused_at is not None:
            raise Refusal(f"agent {agent.id} is paused already")
        return self.repository.save(replace(agent, paused_at=context.timestamp), context)
