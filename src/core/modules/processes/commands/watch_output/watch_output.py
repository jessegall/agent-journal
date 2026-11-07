from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.watch import Watch


@dataclass(frozen=True)
class WatchOutput(Command[Watch]):
    """The caller watches a run that has not ended."""

    process_id: int
