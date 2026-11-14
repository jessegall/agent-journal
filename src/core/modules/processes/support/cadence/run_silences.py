from engine.time.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.output_folder import OutputFolder

CHECKED_MARK = "looked"


class RunSilences:
    """How long a run has printed nothing: since its last output, or since it was created when it has printed
    nothing yet (counted from created_at; open point 15 of doc 1248 is not decided here); and how long it has
    gone unread, which also counts from the last time its agent read it while it ran."""

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def seconds(self, process: Process, timestamp: Timestamp) -> int:
        if self.folder.total_bytes(process.id):
            return self.folder.run_silent_seconds(process.id, timestamp)
        return int(process.creation_timestamp().elapsed_seconds(timestamp))

    def is_silent(self, part: ProcessPart) -> bool:
        return not self.folder.part_bytes(part.process_id, part.position)

    def unread_seconds(self, process: Process, timestamp: Timestamp) -> int:
        emitted = self.seconds(process, timestamp)
        checked = self.folder.read_mark(process.id, CHECKED_MARK)
        return min(emitted, int(Timestamp.parsed(checked).elapsed_seconds(timestamp))) if checked else emitted
