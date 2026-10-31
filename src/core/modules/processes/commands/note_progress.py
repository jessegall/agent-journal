from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class NoteProgress(Command[Process]):
    """Notes how far a run has come, in percent, as its reader reads it from the output."""

    row_id: int
    percent: int
