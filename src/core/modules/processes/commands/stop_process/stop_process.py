from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class StopProcess(Command[Process]):
    """Stops the process: its group is killed and the process ends stopped."""

    row_id: int
