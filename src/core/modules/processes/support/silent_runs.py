from pathlib import Path

from engine.time.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.cadence.run_silences import RunSilences

SILENT_SECONDS = 30
PYTHON_PROGRAM = "python"


class SilentRuns:
    """Which part of a running test, build or Python run has printed nothing for 30 seconds."""

    def __init__(self, silences: RunSilences, parts: ProcessPartQuery) -> None:
        self.silences, self.parts = silences, parts

    def silent_part(self, process: Process, timestamp: Timestamp) -> ProcessPart | None:
        if self.silences.seconds(process, timestamp) < SILENT_SECONDS:
            return None
        part = self.parts.process(process.id).filter(ended_at=None).oldest().first()
        return part if part is not None and self.is_watched(part) else None

    def is_empty_output(self, part: ProcessPart) -> bool:
        return self.silences.is_silent(part)

    @staticmethod
    def is_watched(part: ProcessPart) -> bool:
        return part.category.is_long_running or Path(part.program).name.startswith(PYTHON_PROGRAM)
