from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.person_check import PersonCheck
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.drivers.commands.resume_agent.resume_agent import ResumeAgent
from core.modules.drivers.models.agent_line import AgentLine

RESUMED_LINE = "the user resumed you: carry on where you stopped"
RESUME_SOURCE = "drivers.resume"


class ResumeAgentHandler(Handler[ResumeAgent, Agent]):
    """Clears a paused agent's pause and types that it may carry on, since a paused agent sends no hook that could
    carry the line; with no terminal to type in, the line waits for its next hook."""

    command = ResumeAgent

    def __init__(self, queries: Queries, repository: Repository, typing: TerminalTyping) -> None:
        self.queries, self.repository, self.typing = queries, repository, typing

    def handle(self, command: ResumeAgent, context: Context) -> Agent:
        PersonCheck.require(context, "only a person resumes an agent")
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.paused_at is None:
            raise Refusal(f"agent {agent.id} is not paused")
        resumed = self.repository.save(replace(agent, paused_at=None), context)
        try:
            self.typing.type_line(agent.terminal_id, RESUMED_LINE)
        except Refusal:
            self.repository.save(AgentLine(agent_id=agent.id, creator_id=context.actor.id, text=RESUMED_LINE, source=RESUME_SOURCE), context)
        return resumed
