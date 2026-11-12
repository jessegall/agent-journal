from engine.listener.rows.event_rows import EventRows
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.held_run import HeldRun
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.cadence.run_silences import RunSilences
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.ticks.hang_watch import CPU_FILE


class HeldRuns:
    """Finds the run of an agent that printed nothing for the hang time since its last output or the
    last time the agent read it; an agent whose session ended is held by nothing. The processor time
    is told from the file the hang watch keeps in the run's folder."""

    def __init__(self, processes: ProcessQuery, folder: OutputFolder, settings: ProcessSettings, silences: RunSilences, rows: EventRows) -> None:
        self.processes, self.folder, self.settings, self.silences, self.rows = processes, folder, settings, silences, rows

    def found(self, agent_id: int, timestamp: Timestamp) -> HeldRun | None:
        agent = self.rows.find(Agent, agent_id)
        if agent is None or agent.ended_at is not None:
            return None
        limit = self.settings.integer(ProcessSetting.HANG_SECONDS)
        for process in self.processes.agent(agent_id).running().minimum_age(timestamp, limit).oldest().all_rows():
            seconds = self.silent_seconds(process, timestamp)
            if seconds >= limit:
                return HeldRun(process, seconds, self.processor(process, timestamp, seconds))
        return None

    def silent_seconds(self, process: Process, timestamp: Timestamp) -> int:
        return self.silences.unread_seconds(process, timestamp)

    def processor(self, process: Process, timestamp: Timestamp, silent: int) -> str:
        recorded = self.folder.text(process.id, CPU_FILE).split()
        if len(recorded) != 2:
            return "not known"
        return "rising" if timestamp.value.timestamp() - float(recorded[1]) < silent else "not rising"
