from dataclasses import replace

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.commands.bind_agent_session.bind_agent_session import BindAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.single_main_agent import SingleMainAgent
from core.modules.agents.support.current_agent_policy import CurrentAgentPolicy


class BindAgentSessionHandler(Handler[BindAgentSession, Agent]):
    """Saves the real session on an open agent row, refusing one that has ended; a session that an ended agent
    holds already is that agent resumed, so it is reopened on the launch's process and terminal, and the
    launch row ends itself, since its program goes on under the reopened row."""

    command = BindAgentSession

    def __init__(self, agents: AgentRows, repository: Repository, suites: CurrentAgentPolicy, single_main: SingleMainAgent) -> None:
        self.agents, self.repository, self.suites, self.single_main = agents, repository, suites, single_main

    def handle(self, command: BindAgentSession, context: Context) -> Agent:
        agent = self.agents.find(command.row_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended already", f"journal agent show {agent.id}")
        session_agent = self.agents.session(command.session)
        if session_agent is not None and session_agent.id != agent.id:
            self.repository.save_change(agent, agent.ended(context.timestamp, self.suites.agent_policy()), replace(context, actor=Actor(agent.id, ActorType.AGENT)))
            reopened = self.repository.update(session_agent, context, ended_at=None, pid=agent.pid, process_started_at=agent.process_started_at, launch_agent_id=agent.id, launch_name=agent.original_launch_name)
            self.single_main.end(reopened, context)
            return reopened
        return self.repository.update(agent, context, session=command.session, launch_name=agent.original_launch_name)
