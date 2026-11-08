from uuid import uuid4

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.agents.commands.renew_agent_session.renew_agent_session import RenewAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows


class RenewAgentSessionHandler(Handler[RenewAgentSession, Agent]):
    """Saves a new session id on an agent; its memories, tasks and number stay with the row."""

    command = RenewAgentSession

    def __init__(self, agents: AgentRows, repository: Repository) -> None:
        self.agents, self.repository = agents, repository

    def handle(self, command: RenewAgentSession, context: Context) -> Agent:
        return self.repository.update(self.agents.find(command.row_id), context, session=str(uuid4()))
