from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.commands.bind_agent_session.bind_agent_session import BindAgentSession
from core.modules.agents.models.agent import Agent


class BindAgentSessionHandler(Handler[BindAgentSession, Agent]):
    """Saves the real session on an open agent row, refusing one that has ended; a session that an ended agent
    holds already is that agent resumed, so it is reopened on the launch's process and the launch row ends."""

    command = BindAgentSession

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: BindAgentSession, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.row_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended already", f"journal agent show {agent.id}")
        session_rows = self.queries.query(Agent).filter(session=command.session).page(1, 1).rows
        if session_rows and session_rows[0].id != agent.id:
            self.repository.save(replace(agent, ended_at=context.timestamp), context)
            return self.repository.save(replace(session_rows[0], ended_at=None, pid=agent.pid, process_started_at=agent.process_started_at), context)
        return self.repository.save(replace(agent, session=command.session), context)
