from core.modules.drivers.support.driver_nudges import AGENT_RESUMED
from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.person_check import PersonCheck
from core.modules.drivers.commands.resume_agent.resume_agent import ResumeAgent
from core.modules.drivers.listeners.typed_line_listener import RESUME_SOURCE
from core.modules.drivers.models.agent_line import AgentLine



class ResumeAgentHandler(Handler[ResumeAgent, Agent]):
    """Clears a paused agent's pause and leaves the line that it may carry on, which a listener types once
    this is committed."""

    command = ResumeAgent

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ResumeAgent, context: Context) -> Agent:
        PersonCheck.require(context, "only a person resumes an agent")
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.paused_at is None:
            raise Refusal(f"agent {agent.id} is not paused")
        resumed = self.repository.save(replace(agent, paused_at=None), context)
        self.repository.save(AgentLine(agent_id=agent.id, creator_id=context.actor.id, text=AGENT_RESUMED.nudge().text, source=RESUME_SOURCE), context)
        return resumed
