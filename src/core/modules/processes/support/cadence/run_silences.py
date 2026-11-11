from engine.time.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder


class RunSilences:
    """How long a run has printed nothing: since its last output, or since it was created when it has printed
    nothing yet (counted from created_at; open point 15 of doc 1248 is not decided here)."""

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def seconds(self, process: Process, timestamp: Timestamp) -> int:
        if self.folder.total_bytes(process.id):
            return self.folder.run_silent_seconds(process.id, timestamp)
        return int(process.creation_timestamp().elapsed_seconds(timestamp))
