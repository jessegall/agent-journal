from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.agents.commands.bind_agent_session.bind_agent_session import BindAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.agent_sessions import AgentSessions
from core.modules.agents.support.single_main_agent import SingleMainAgent
from core.modules.agents.support.agent_label import AgentLabel


class BindAgentSessionHandler(Handler[BindAgentSession, Agent]):
    """Saves the real session on an open agent row, refusing one that has ended; a session that an ended agent
    holds already is that agent resumed, so the dispatcher ends the launch row and reopens that agent on the
    launch's process and terminal, since its program goes on under the reopened row."""

    command = BindAgentSession

    def __init__(self, agents: AgentRows, repository: Repository, dispatcher: AgentDispatcher, single_main: SingleMainAgent, sessions: AgentSessions) -> None:
        self.agents, self.repository, self.dispatcher, self.single_main, self.sessions = agents, repository, dispatcher, single_main, sessions

    def handle(self, command: BindAgentSession, context: Context) -> Agent:
        agent = self.agents.find(command.row_id)
        if agent.ended_at is not None:
            raise Refusal(f"{AgentLabel.from_agent(agent).text} has ended already", f"journal agent show {agent.number}")
        session_agent = self.agents.session(command.session)
        if session_agent is not None and session_agent.id != agent.id:
            reopened = self.dispatcher.move_program(agent, session_agent, context)
            self.single_main.end(reopened, context)
            return reopened
        self.sessions.bound(agent.session, command.session, context)
        return self.repository.update(agent, context, session=command.session, launch_name=agent.original_launch_name)
