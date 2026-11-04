from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.run_counts import RunCounts
from core.base.query.queries import Queries
from core.base.agent_role import AgentRole
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest


class RunAdmission:
    """Decides which runs wait for capacity and readers, and which start immediately."""

    def __init__(self, queries: Queries, listings: RunCounts, folder: OutputFolder, suites: SuiteChoice, settings: ProcessSettings) -> None:
        self.queries, self.listings, self.folder = queries, listings, folder
        self.suites, self.settings = suites, settings

    def needs_slot(self, process: Process, agent: Agent) -> bool:
        return process.is_queue_run and agent.role in self.suites.agent_policy(process.environment_id).queued_run_roles

    def uses_slot(self, process: Process) -> bool:
        if process.slot_assigned:
            return True
        agent = self.queries.query(Agent).find(process.agent_id)
        return (process.is_queue_run and agent.role == AgentRole.MAIN
                and self.settings.flag(ProcessSetting.MAIN_RUNS_USE_SLOTS, process.environment_id))

    def may_start(self, process: Process, agent: Agent, current_time: Timestamp) -> bool:
        parts = tuple(self.queries.query(ProcessPart).filter(process_id=process.id).all_rows())
        if not parts:
            return False
        if not self.needs_slot(process, agent):
            return True
        if self.listings.has_listing(process) and self.folder.count_status(process.id) is None:
            return False
        for part in parts:
            if part.reader_request_id is None:
                continue
            request = self.queries.query(ReaderRequest).find(part.reader_request_id)
            if request.completed_at is None and request.expires_at > current_time and request.sample_process_id != process.id:
                return False
        return True
