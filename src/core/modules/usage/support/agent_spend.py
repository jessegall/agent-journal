from core.modules.agents.support.agent_sessions import AgentSessions
from core.modules.usage.support.session_cost import SessionCost
from core.modules.usage.support.status_files import StatusFiles

SESSIONS_READ = 50


class AgentSpend:
    """Reads what each of the newest sessions in one agent's history cost, newest first, from that session's
    own status file, so the spend of two programs is never mixed. A session with no status file reports no
    cost."""

    def __init__(self, sessions: AgentSessions, files: StatusFiles) -> None:
        self.sessions, self.files = sessions, files

    def session_costs(self, agent_id: int) -> tuple[SessionCost, ...]:
        sessions = self.sessions.newest_sessions(agent_id, SESSIONS_READ)
        return tuple(SessionCost(session.session, session.program, self.files.status(session.session).cost_dollars) for session in sessions)
