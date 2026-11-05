import fcntl
import hashlib
import time
from collections.abc import Generator
from contextlib import contextmanager

from core.base.actor import Actor
from core.base.caller.process_table import ProcessTable
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from core.base.leftover_process import LeftoverProcess
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.commands.recover_silent_agents.report_silent_agent import ReportSilentAgent
from suites.coding.modules.workers.support.worker_session_state import WorkerSessionState
from suites.coding.modules.workers.support.worker_settings import SILENT_AGENT_MINUTES

STOP_WAIT_SECONDS = 5
STOP_POLL_SECONDS = 0.05


class WorkerSessions:
    """Serializes session launches and confirms its previous process tree has ended before a resume."""

    def __init__(self, home: JournalHome, queries: Queries, processes: ProcessQuery, settings: SettingValues,
                 clock: Clock, providers: Providers, process_table: ProcessTable, bus: Bus) -> None:
        self.home, self.queries, self.processes, self.settings = home, queries, processes, settings
        self.clock, self.providers, self.process_table, self.bus = clock, providers, process_table, bus

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

    def prepare(self, worker: Agent) -> WorkerSessionState:
        current = self.queries.query(Agent).find(worker.id)
        if current.pid is None:
            return WorkerSessionState.READY
        program = self.providers.provider(current.program).executable
        command = LeftoverProcess.command_line(current.pid)
        if program not in command or current.session not in command:
            return WorkerSessionState.READY
        span = self.settings.minutes(SILENT_AGENT_MINUTES, current.environment_id)
        activity = self.queries.query(AgentActivity).find(current.id)
        if not activity.is_inactive(self.clock.timestamp(), span.count) or self.processes.agent(current.id).running().exists():
            return WorkerSessionState.RUNNING
        if self.stop_tree(current.pid, program):
            return WorkerSessionState.READY
        self.bus.run(ReportSilentAgent(current.id, "its process could not be stopped", activity.last_hook_at if activity.last_hook_at is not None else activity.created_at), Actor.core(), environment_id=current.environment_id)
        return WorkerSessionState.BLOCKED

    def stop_tree(self, pid: int, program: str) -> bool:
        children = self.descendants(pid)
        commands = {child: LeftoverProcess.command_line(child) for child in children}
        for child in reversed(children):
            if commands[child]:
                LeftoverProcess.stop(child, commands[child])
        LeftoverProcess.stop(pid, program)
        commands[pid] = program
        deadline = time.monotonic() + STOP_WAIT_SECONDS
        while self.running(commands) and time.monotonic() < deadline:
            time.sleep(STOP_POLL_SECONDS)
        return not self.running(commands)

    def descendants(self, pid: int) -> list[int]:
        rows = self.process_table.rows()
        parents = {pid}
        descendants: list[int] = []
        while parents:
            children = [row.pid for row in rows if row.parent_pid in parents and row.pid not in parents]
            descendants.extend(children)
            parents = set(children)
        return descendants

    @staticmethod
    def running(commands: dict[int, str]) -> bool:
        return any(command and command in LeftoverProcess.command_line(pid) for pid, command in commands.items())
