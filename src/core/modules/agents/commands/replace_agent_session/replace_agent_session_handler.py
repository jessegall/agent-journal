from uuid import uuid4

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.agents.commands.replace_agent_session.replace_agent_session import ReplaceAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows


class ReplaceAgentSessionHandler(Handler[ReplaceAgentSession, Agent]):
    """Saves a new session id on an agent; its memories, tasks and number stay with the row."""

    command = ReplaceAgentSession

    def __init__(self, agents: AgentRows, repository: Repository) -> None:
        self.agents, self.repository = agents, repository

    def handle(self, command: ReplaceAgentSession, context: Context) -> Agent:
        return self.repository.update(self.agents.find(command.row_id), context, session=str(uuid4()))
