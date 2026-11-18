from engine.database.database import Database
from engine.request.request_values import RequestValues
from engine.listener.rows.event_rows import EventRows
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.blocked_run import BlockedRun
from core.modules.processes.support.output_folder import CPU_FILE, OutputFolder
from core.modules.processes.support.cadence.run_silences import RunSilences
from core.modules.processes.support.process_settings import ProcessSettings

BLOCKED_RUNS_REASON = "every old running run of the agent is checked for the silence that holds it"


class BlockedRuns:
    """Finds the run of an agent that printed nothing for the hang time since its last output or the
    last time the agent read it; a run still waiting in the queue and an agent whose session ended are held by nothing. The processor time
    is told from the file the hang watch keeps in the run's folder."""

    def __init__(self, processes: ProcessQuery, folder: OutputFolder, settings: ProcessSettings, silences: RunSilences, rows: EventRows, request_values: RequestValues,
                 database: Database) -> None:
        self.processes, self.folder, self.settings, self.silences, self.rows = processes, folder, settings, silences, rows
        self.request_values, self.database = request_values, database

    # read once a request until a write changes it: the hold, its condition and its line ask the same question
    def found(self, agent_id: int, timestamp: Timestamp) -> BlockedRun | None:
        return self.request_values.read(f"processes.held-run:{agent_id}:{timestamp.text}", self.database.change_mark, lambda: self.current_run(agent_id, timestamp))

    def current_run(self, agent_id: int, timestamp: Timestamp) -> BlockedRun | None:
        agent = self.rows.find(Agent, agent_id)
        if agent is None or agent.ended_at is not None:
            return None
        limit = self.settings.integer(ProcessSetting.HANG_SECONDS)
        for process in self.processes.agent(agent_id).running().minimum_age(timestamp, limit).every_row(BLOCKED_RUNS_REASON):
            # a run waiting in the queue for a spot has not started, so its silence says nothing
            if process.queued_at is not None:
                continue
            seconds = self.silent_seconds(process, timestamp)
            if seconds >= limit:
                return BlockedRun(process, seconds, self.processor(process, timestamp, seconds))
        return None

    def silent_seconds(self, process: Process, timestamp: Timestamp) -> int:
        return self.silences.unread_seconds(process, timestamp)

    def processor(self, process: Process, timestamp: Timestamp, silent: int) -> str:
        recorded = self.folder.text(process.id, CPU_FILE).split()
        if len(recorded) != 2:
            return "not known"
        return "rising" if timestamp.value.timestamp() - float(recorded[1]) < silent else "not rising"
