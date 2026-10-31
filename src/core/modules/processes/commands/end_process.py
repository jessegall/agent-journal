from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class EndProcess(Command[Process]):
    """Ends a process finished on exit code 0 or failed on another, and keeps its output unless the run was short."""

    row_id: int
    exit_code: int
    byte_count: int
    line_count: int
