from uuid import uuid4

from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.agents.commands.replace_agent_session.replace_agent_session import ReplaceAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.agent_sessions import AgentSessions


class ReplaceAgentSessionHandler(Handler[ReplaceAgentSession, Agent]):
    """Saves a new session id on an agent, with the program and model when the command names a program, and
    writes the change in its session history; its memories, tasks and number stay with the row."""

    command = ReplaceAgentSession

    def __init__(self, agents: AgentRows, repository: Repository, sessions: AgentSessions) -> None:
        self.agents, self.repository, self.sessions = agents, repository, sessions

    def handle(self, command: ReplaceAgentSession, context: Context) -> Agent:
        program = {"program": command.program, "program_model": command.program_model} if command.program else {}
        agent = self.repository.update(self.agents.find(command.row_id), context, session=str(uuid4()), **program)
        self.sessions.replaced(agent, command.reason, context)
        return agent
