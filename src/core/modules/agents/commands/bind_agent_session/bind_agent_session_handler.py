from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.commands.bind_agent_session.bind_agent_session import BindAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.suite_choice import SuiteChoice


class BindAgentSessionHandler(Handler[BindAgentSession, Agent]):
    """Saves the real session on an open agent row, refusing one that has ended; a session that an ended agent
    holds already is that agent resumed, so it is reopened on the launch's process and terminal, and the
    launch row ends."""

    command = BindAgentSession

    def __init__(self, agents: AgentRows, repository: Repository, suites: SuiteChoice) -> None:
        self.agents, self.repository, self.suites = agents, repository, suites

    def handle(self, command: BindAgentSession, context: Context) -> Agent:
        agent = self.agents.find(command.row_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended already", f"journal agent show {agent.id}")
        session_agent = self.agents.session(command.session)
        if session_agent is not None and session_agent.id != agent.id:
            self.repository.save_change(agent, agent.ended(context.timestamp, self.suites.agent_policy(agent.environment_id)), context)
            return self.repository.update(session_agent, context, ended_at=None, pid=agent.pid, process_started_at=agent.process_started_at, launch_agent_id=agent.id)
        return self.repository.update(agent, context, session=command.session)
