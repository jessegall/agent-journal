from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.watch import Watch


@dataclass(frozen=True)
class UnwatchOutput(Command[Watch]):
    """The caller stops watching a run."""

    process_id: int
