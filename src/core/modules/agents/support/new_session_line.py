from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.end_reason import EndReason
from core.modules.agents.support.agent_label import AGENT_WORD, AgentLabel
from core.modules.agents.support.agent_report_reads import AgentReportReads
from core.modules.agents.support.agent_sessions import AgentSessions
from core.modules.agents.support.agent_task_reads import AgentTaskReads
from core.modules.agents.support.new_session import NewSession

NONE_WORD = "none"
SESSION_PAIR_ROWS = 2


class NewSessionLine:
    """Reads what a new session of an agent is told at its start. The first session of an agent is told
    nothing, because nothing came before it."""

    def __init__(self, sessions: AgentSessions, tasks: AgentTaskReads, reports: AgentReportReads, scopes: Scopes) -> None:
        self.sessions, self.tasks, self.reports, self.scopes = sessions, tasks, reports, scopes

    def new_session(self, agent: Agent) -> NewSession | None:
        newest = self.sessions.newest_sessions(agent.id, SESSION_PAIR_ROWS)
        if len(newest) < SESSION_PAIR_ROWS:
            return None
        with self.scopes.row_scope(agent):
            task_ids, report_id = self.tasks.open_task_ids(agent.id), self.reports.newest_report_id(agent.id)
        return NewSession(AgentLabel(AGENT_WORD, agent.number).text, ", ".join(f"task {task_id}" for task_id in task_ids) or NONE_WORD,
                          NONE_WORD if report_id is None else f"report {report_id}", newest[1].end_reason == EndReason.CONVERSATION_MISSING)

    def line(self, agent: Agent) -> str | None:
        new_session = self.new_session(agent)
        return None if new_session is None else new_session.line
