from collections.abc import Sequence

from core.modules.agents.support.agent_sessions import AgentSessions
from core.modules.usage.support.session_cost import SessionCost
from core.modules.usage.support.status_files import StatusFiles


class AgentSpend:
    """Reads what each session in an agent's history cost, newest first, from that session's own status file,
    so the spend of two programs is never mixed. A session with no status file cost nothing."""

    def __init__(self, sessions: AgentSessions, files: StatusFiles) -> None:
        self.sessions, self.files = sessions, files

    def session_costs(self, agent_ids: Sequence[int]) -> dict[int, tuple[SessionCost, ...]]:
        return {agent_id: tuple(SessionCost(session.session, session.program, self.files.status(session.session).cost_dollars or 0.0) for session in sessions)
                for agent_id, sessions in self.sessions.sessions_by_agent(agent_ids).items()}
