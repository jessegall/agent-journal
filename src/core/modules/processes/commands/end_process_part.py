from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.process_part import ProcessPart


@dataclass(frozen=True)
class EndProcessPart(Command[ProcessPart]):
    """Ends one part of a process with its exit code."""

    process_id: int
    position: int
    exit_code: int
