from pathlib import Path

from core.base.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.output_folder import OutputFolder

SILENT_SECONDS = 30
PYTHON_PROGRAM = "python"


class SilentRuns:
    """Which part of a running test, build or Python run has printed nothing for 30 seconds."""

    def __init__(self, folder: OutputFolder, parts: ProcessPartQuery) -> None:
        self.folder, self.parts = folder, parts

    def silent_part(self, process: Process, timestamp: Timestamp) -> ProcessPart | None:
        if process.creation_timestamp().elapsed_seconds(timestamp) < SILENT_SECONDS:
            return None
        if self.folder.total_bytes(process.id) and self.folder.run_silent_seconds(process.id, timestamp) < SILENT_SECONDS:
            return None
        part = next((part for part in self.parts.process(process.id).all_rows() if part.ended_at is None), None)
        return part if part is not None and self.is_watched(part) else None

    def is_empty_output(self, part: ProcessPart) -> bool:
        return not self.folder.part_bytes(part.process_id, part.position)

    @staticmethod
    def is_watched(part: ProcessPart) -> bool:
        return part.category.is_long_running or Path(part.program).name.startswith(PYTHON_PROGRAM)
