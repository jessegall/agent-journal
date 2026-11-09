from core.base.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.held_run import HeldRun
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.ticks.hang_watch import CPU_FILE

LOOKED_MARK = "looked"


class HeldRuns:
    """Finds the run of an agent that printed nothing for the hang time since its last output or the last time
    the agent read it. The processor time is told from the file the hang watch keeps in the run's folder."""

    def __init__(self, processes: ProcessQuery, folder: OutputFolder, settings: ProcessSettings) -> None:
        self.processes, self.folder, self.settings = processes, folder, settings

    def found(self, agent_id: int, timestamp: Timestamp) -> HeldRun | None:
        limit = self.settings.integer(ProcessSetting.HANG_SECONDS)
        for process in self.processes.agent(agent_id).running().minimum_age(timestamp, limit).oldest().all_rows():
            seconds = self.silent_seconds(process, timestamp)
            if seconds >= limit:
                return HeldRun(process, seconds, self.processor(process, timestamp, seconds))
        return None

    def silent_seconds(self, process: Process, timestamp: Timestamp) -> int:
        printed = self.folder.run_silent_seconds(process.id, timestamp) if self.folder.total_bytes(process.id) else int(process.creation_timestamp().elapsed_seconds(timestamp))
        looked = self.folder.read_mark(process.id, LOOKED_MARK)
        return min(printed, int(Timestamp.parsed(looked).elapsed_seconds(timestamp))) if looked else printed

    def processor(self, process: Process, timestamp: Timestamp, silent: int) -> str:
        recorded = self.folder.text(process.id, CPU_FILE).split()
        if len(recorded) != 2:
            return "not known"
        return "rising" if timestamp.value.timestamp() - float(recorded[1]) < silent else "not rising"
