from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.process_part import ProcessPart


@dataclass(frozen=True)
class StartProcessPart(Command[ProcessPart]):
    """Marks one part of a process as running."""

    process_id: int
    position: int
