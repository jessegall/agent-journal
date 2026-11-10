from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from engine.time.clock import Clock
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.agent_session import AgentSession
from core.modules.agents.models.enums.end_reason import EndReason


class AgentSessions:
    """Writes and reads the history of the sessions an agent ran under. An agent has one row for each time a
    session started; the newest row is its current session, and every older row has an end and the reason it
    ended. A session a person resumes later gets a new row."""

    def __init__(self, queries: Queries, repository: Repository, scopes: Scopes, clock: Clock) -> None:
        self.queries, self.repository, self.scopes, self.clock = queries, repository, scopes, clock

    def started(self, agent: Agent, context: Context) -> AgentSession:
        return self.repository.save(AgentSession(session_agent_id=agent.id, session=agent.session, program=agent.program,
                                                 program_model=agent.program_model, started_at=self.clock.timestamp()), context)

    def replaced(self, agent: Agent, reason: EndReason, context: Context) -> AgentSession:
        self.ended(agent.id, reason, context)
        return self.started(agent, context)

    def ended(self, session_agent_id: int, reason: EndReason, context: Context) -> None:
        current = self.current(session_agent_id)
        if current is not None and current.ended_at is None:
            self.repository.update(current, context, ended_at=self.clock.timestamp(), end_reason=reason.value)

    def reopened(self, session_agent_id: int, context: Context) -> None:
        current = self.current(session_agent_id)
        if current is not None and current.ended_at is not None:
            self.repository.update(current, context, ended_at=None, end_reason="")

    def bound(self, placeholder_session: str, real_session: str, context: Context) -> None:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            row = self.queries.query(AgentSession).filter(session=placeholder_session).descending("id").first()
        if row is not None:
            self.repository.update(row, context, session=real_session)

    def current(self, session_agent_id: int) -> AgentSession | None:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return self.queries.query(AgentSession).filter(session_agent_id=session_agent_id).descending("id").first()

    def history(self, session_agent_id: int, limit: int) -> list[AgentSession]:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return list(self.queries.query(AgentSession).filter(session_agent_id=session_agent_id).oldest().page(1, limit).rows)

    def has(self, session: str) -> bool:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            row = self.queries.query(AgentSession).filter(session=session).descending("id").first()
        if row is None:
            return False
        current = self.current(row.session_agent_id)
        return current is not None and current.id != row.id
