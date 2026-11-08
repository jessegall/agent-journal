from dataclasses import dataclass
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart

SILENT_RUN_SECONDS = 60


@dataclass(frozen=True)
class SilentRun:
    """One ended run of an alias or a command, how long it lasted, and whether it showed a percent in the chat."""

    process: Process
    part: ProcessPart
    seconds: int
    shows_percent: bool

    @property
    def is_silent(self) -> bool:
        return self.seconds > SILENT_RUN_SECONDS and not self.shows_percent
