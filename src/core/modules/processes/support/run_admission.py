from collections.abc import Sequence

from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from engine.enums.agent_role import AgentRole
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.support.run_visibility import RunVisibility


class RunAdmission:
    """Decides which runs wait for capacity and readers, and which start immediately; a run is never held for its
    count, which it takes while it runs."""

    def __init__(self, queries: Queries, suites: SuiteChoice, settings: ProcessSettings, visibility: RunVisibility) -> None:
        self.queries, self.suites, self.settings, self.visibility = queries, suites, settings, visibility

    def needs_slot(self, process: Process, agent: Agent) -> bool:
        if process.plugin:
            return process.category is not CommandCategory.BACKGROUND_JOB
        return process.is_queue_run and agent.role in self.suites.agent_policy().queued_run_roles

    def uses_slot(self, process: Process) -> bool:
        if process.slot_assigned:
            return True
        return (process.is_queue_run and self.settings.flag(ProcessSetting.MAIN_RUNS_USE_SLOTS)
                and self.queries.query(Agent).find(process.session_agent_id).role == AgentRole.MAIN)

    def waiting_parts(self, waiting: Sequence[Process]) -> dict[int, tuple[ProcessPart, ...]]:
        return self.visibility.processes_parts(tuple(process.id for process in waiting))

    def may_start(self, process: Process, agent: Agent, parts: Sequence[ProcessPart], current_time: Timestamp) -> bool:
        if not parts:
            return False
        if not self.needs_slot(process, agent):
            return True
        requests = self.queries.query(ReaderRequest).find_many([part.reader_request_id for part in parts if part.reader_request_id is not None])
        return not any(request.completed_at is None and request.expires_at > current_time and request.sample_process_id != process.id for request in requests)
