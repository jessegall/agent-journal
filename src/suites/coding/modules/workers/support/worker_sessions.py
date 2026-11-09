import fcntl
import hashlib
from collections.abc import Generator
from contextlib import contextmanager

from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from core.base.leftover_process import LeftoverProcess
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.base.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launch_guard import AgentLaunchGuard
from core.modules.agents.support.agent_program import AgentProgram
from core.modules.agents.support.agent_session_state import AgentSessionState
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_recovery_reports import WorkerRecoveryReports
from suites.coding.modules.workers.support.worker_settings import SILENT_AGENT_MINUTES


class WorkerSessions(AgentLaunchGuard):
    """Serializes session launches and confirms its previous process tree has ended before a resume."""

    def __init__(self, home: JournalHome, queries: Queries, processes: ProcessQuery, settings: SettingValues,
                 clock: Clock, providers: Providers, program: AgentProgram, bus: Bus, rows: EventRows, reports: WorkerRecoveryReports) -> None:
        self.home, self.queries, self.processes, self.settings = home, queries, processes, settings
        self.clock, self.providers, self.program, self.bus, self.rows, self.reports = clock, providers, program, bus, rows, reports

    @contextmanager
    def lock(self, session: str) -> Generator[bool]:
        name = hashlib.sha256(session.encode()).hexdigest()
        path = self.home.folder / "runtime" / "session-locks" / name
        path.parent.mkdir(parents=True, exist_ok=True)
        with FileAccess.shared().writer(path, "a") as opened:
            try:
                fcntl.flock(opened, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                yield False
                return
            try:
                yield True
            finally:
                fcntl.flock(opened, fcntl.LOCK_UN)

    def prepare(self, agent: Agent) -> AgentSessionState:
        current = self.rows.required(Agent, agent.id)
        if current.pid is None:
            return AgentSessionState.READY
        program = self.providers.provider(current.program).executable
        command = LeftoverProcess.command_line(current.pid)
        if program not in command or current.session not in command:
            return AgentSessionState.READY
        with self.bus.scopes.read_scope((), None, current.environment_id):
            span = self.settings.minutes(SILENT_AGENT_MINUTES)
        activity = self.rows.required(AgentActivity, current.id)
        if not activity.is_inactive(self.clock.timestamp(), span.count) or self.processes.agent(current.id).running().exists():
            return AgentSessionState.RUNNING
        if self.program.stop_tree(current.pid, program):
            return AgentSessionState.READY
        self.reports.report(current, "its process could not be stopped", activity.last_hook_at if activity.last_hook_at is not None else activity.created_at)
        return AgentSessionState.BLOCKED
